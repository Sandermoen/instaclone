import React from 'react';
import PropTypes from 'prop-types';

import Comment from '../Comment/Comment';

const Comments = ({ comments }) => (
  <div className="comments">
    <Comment avatar={avatar} comment={comments} username={username} caption />
    <Comment avatar={avatar} comment={comments} username={username} />
  </div>
);

Comments.propTypes = {
  comments: PropTypes.array.isRequired
};

export default Comments;
