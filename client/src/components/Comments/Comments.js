import React from 'react';
import PropTypes from 'prop-types';

import Comment from '../Comment/Comment';

const Comments = ({ comments, caption, post }) => (
  <div className="comments">
    {caption && (
      <Comment
        avatar={caption.avatar}
        comment={caption}
        username={caption.username}
        caption
        post={post}
      />
    )}
    {comments.map((comment, idx) => (
      <Comment
        avatar={comment.avatar}
        comment={comment}
        username={comment.username}
        key={idx}
        post={post}
      />
    ))}
  </div>
);

Comments.propTypes = {
  comments: PropTypes.array.isRequired,
  caption: PropTypes.shape({
    message: PropTypes.string,
    avatar: PropTypes.string,
    username: PropTypes.string
  })
};

export default Comments;
