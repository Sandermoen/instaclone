const aws = require('aws-sdk');
const User = require('../models/User');
const fs = require('fs');

const addPost = async (imageUrl, caption, user) => {
  try {
    // Update the user's profile with the post
    await User.updateOne(
      { _id: user._id },
      {
        $push: {
          posts: {
            image: imageUrl,
            caption,
            date: Date.now()
          }
        }
      }
    );
  } catch (err) {
    throw new Error(err);
  }
};

// Upload the received file to amazon s3
// Might switch to cloudinary instead
module.exports.uploadFile = (req, res, next) => {
  const { caption } = req.body;

  aws.config.setPromisesDependency();
  aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
  });

  // S3 bucket config
  const params = {
    ACL: 'public-read',
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Body: fs.createReadStream(req.file.path),
    Key: `images/${req.file.originalname}`
  };
  const s3 = new aws.S3();
  s3.upload(params, (err, data) => {
    if (err) next(err);
    if (data) {
      fs.unlinkSync(req.file.path);
      const resourceLocation = data.Location;
      try {
        addPost(resourceLocation, caption, res.locals.user);
        return res.status(201).send(resourceLocation);
      } catch (err) {
        return res.status(401).send({ error: err });
      }
    }
  });
};

const findPost = async postId => {
  if (!postId) throw new Error('Please provide a post to retrieve.');
  try {
    const postDocument = await User.findOne(
      {
        'posts._id': postId
      },
      { 'posts.$': 1, username: 1, avatar: 1 }
    );
    if (!postDocument) throw new Error('Could not find post.');
    return postDocument;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports.votePost = async (req, res, next) => {
  const { postId } = req.params;
  if (!postId) {
    return res
      .status(400)
      .send({ error: 'Please provide the post before attempting to like it.' });
  }
  try {
    const { username } = res.locals.user;
    const postDocument = await findPost(postId);
    const post = postDocument.posts[0];

    if (post.likes.includes(username)) {
      // Post is already liked so remove user from like array
      const userIndex = post.likes.findIndex(user => user === username);
      post.likes.splice(userIndex, 1);
      post.likesCount -= 1;
    } else {
      // Post has not been liked so add user to like array
      post.likes.push(username);
      post.likesCount += 1;
    }
    // Update post
    await postDocument.update({ posts: post });
    res.send({ success: true, likes: post.likes, likesCount: post.likesCount });
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
};

// Get a specific post with comments.
module.exports.getPost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const postDocument = await findPost(postId);
    // Query for posts with the same postId and filter them by postId.
    const commentsDocument = await User.aggregate([
      { $match: { 'comments.postId': postId } },
      {
        $project: {
          username: 1,
          avatar: 1,
          comments: {
            $filter: {
              input: '$comments',
              as: 'comment',
              cond: { $eq: ['$$comment.postId', postId] }
            }
          }
        }
      },
      { $unwind: '$comments' },
      {
        $group: {
          _id: '$_id',
          username: { $first: '$username' },
          avatar: { $first: '$avatar' },
          comments: { $push: '$comments' }
        }
      }
    ]);
    const post = postDocument.posts[0];

    // This could probably be done more efficiently.
    const comments = commentsDocument
      .map(document => {
        return document.comments.map(comment => {
          comment.username = document.username;
          if (document.avatar) comment.avatar = document.avatar;
          return comment;
        });
      })
      .flat();

    // Sort comments by most recent.
    comments.sort((a, b) => new Date(b.date) - new Date(a.date)).reverse();

    return res.send({
      ...post.toObject(),
      comments
    });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

module.exports.addComment = async (req, res, next) => {
  const { postId } = req.params;
  const { comment } = req.body;
  const user = res.locals.user;

  if (!comment) {
    return res.status(400).send({ error: 'You cannot post an empty comment.' });
  }

  try {
    User.updateOne(
      { _id: user._id },
      {
        $push: {
          comments: {
            postId,
            userId: user._id,
            date: Date.now(),
            message: comment
          }
        }
      },
      async err => {
        if (err) return next(err);
        const postDocument = await findPost(postId);
        postDocument.update({ $inc: { 'posts.0.commentsCount': 1 } }, err => {
          if (err) return next(err);

          res.status(201).send({
            success: true,
            comment: {
              message: comment,
              username: user.username,
              avatar: user.avatar
            }
          });
        });
      }
    );
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};
