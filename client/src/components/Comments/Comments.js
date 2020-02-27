import React from 'react';
import PropTypes from 'prop-ty';

import Comment from '../Comment/Comment';

const Comments = ({ commnets }) => (
  <div className="comments">
    <Comment avatar={avatar} comment={comments} username={username} caption />
    <Comment avatar={avatar} comment={comments} username={username} />
  </div>
);

export default Comments;
