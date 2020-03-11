import React from 'react';
import PropTypes from 'prop-types';

import Comment from '../Comment/Comment';

const Comments = ({ comments, caption }) => (
  <div className="comments">
    {caption && (
      <Comment
        avatar={caption.avatar}
        comment={caption.message}
        username={caption.username}
        caption
      />
    )}
    {comments.map((comment, idx) => (
      <Comment
        avatar={comment.avatar}
        comment={comment}
        username={comment.username}
        key={idx}
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
