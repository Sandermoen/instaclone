import React from 'react';

import Avatar from '../Avatar/Avatar';

const UnfollowPrompt = ({ avatar, username }) => (
  <div className="unfollow-prompt">
    <Avatar style={{ width: '10rem', height: '10rem' }} imageSrc={avatar} />
    <p
      style={{ marginTop: '3rem' }}
      className="heading-4"
    >{`Unfollow @${username}?`}</p>
  </div>
);

export default UnfollowPrompt;
