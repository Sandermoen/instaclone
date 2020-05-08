const Comment = require('../models/Comment');
const ObjectId = require('mongoose').Types.ObjectId;
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');

/**
 * Retrieves a post's comments with a specified offset
 * @function retrieveComments
 * @param {string} postId The id of the post to retrieve comments from
 * @param {number} offset The amount of comments to skip
 * @returns {array} Array of comments
 */
module.exports.retrieveComments = async (postId, offset, exclude = 0) => {
  try {
    const commentsAggregation = await Comment.aggregate([
      {
        $facet: {
          comments: [
            { $match: { post: ObjectId(postId) } },
            // Sort the newest comments to the top
            { $sort: { date: -1 } },
            // Skip the comments we do not want
            // This is desireable in the even that a comment has been created
            // and stored locally, we'd not want duplicate comments
            { $skip: Number(exclude) },
            // Re-sort the comments to an ascending order
            { $sort: { date: 1 } },
            { $skip: Number(offset) },
            { $limit: 10 },
            {
              $lookup: {
                from: 'commentreplies',
                localField: '_id',
                foreignField: 'parentComment',
                as: 'commentReplies',
              },
            },
            {
              $lookup: {
                from: 'commentvotes',
                localField: '_id',
                foreignField: 'comment',
                as: 'commentVotes',
              },
            },
            { $unwind: '$commentVotes' },
            {
              $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
              },
            },
            { $unwind: '$author' },
            {
              $addFields: {
                commentReplies: { $size: '$commentReplies' },
                commentVotes: '$commentVotes.votes',
              },
            },
            {
              $unset: [
                'author.password',
                'author.email',
                'author.private',
                'author.bio',
                'author.bookmarks',
              ],
            },
          ],
          commentCount: [
            {
              $match: { post: ObjectId(postId) },
            },
            { $group: { _id: null, count: { $sum: 1 } } },
          ],
        },
      },
      {
        $unwind: '$commentCount',
      },
      {
        $addFields: {
          commentCount: '$commentCount.count',
        },
      },
    ]);
    return commentsAggregation[0];
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * @function sendEmail
 * @param {string} to The destination email address to send an email to
 * @param {string} subject The subject of the email
 * @param {html} template Html to include in the email
 */
module.exports.sendEmail = async (to, subject, template) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: '"Instaclone Support" <support@instaclone.net>',
    to,
    subject,
    html: template,
  });
};

/**
 * Sends a confirmation email to an email address
 * @function sendConfirmationEmail
 * @param {string} username The username of the user to send the email to
 * @param {string} email The email of the user to send the email to
 * @param {string} confirmationToken The token to use to confirm the email
 */
module.exports.sendConfirmationEmail = async (
  username,
  email,
  confirmationToken
) => {
  if (process.env.NODE_ENV === 'production') {
    try {
      const source = fs.readFileSync(
        'templates/confirmationEmail.html',
        'utf8'
      );
      template = handlebars.compile(source);
      const html = template({
        username: username,
        confirmationUrl: `${process.env.HOME_URL}/confirm/${confirmationToken}`,
        url: process.env.HOME_URL,
      });
      await this.sendEmail(email, 'Confirm your instaclone account', html);
    } catch (err) {
      console.log(err);
    }
  }
};
