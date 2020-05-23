import React from 'react';
import { animated } from 'react-spring';

import Icon from '../../../Icon/Icon';

const NotificationPopup = ({ style, notifications }) => {
  let newFollowers = 0;
  let newLikes = 0;
  let newComments = 0;

  notifications.forEach((notification) => {
    if (!notification.read) {
      switch (notification.notificationType) {
        case 'follow': {
          newFollowers += 1;
          break;
        }
        case 'comment':
        case 'mention': {
          newComments += 1;
          break;
        }
        default: {
          newLikes += 1;
        }
      }
    }
  });

  const renderIcons = (icon, number) => (
    <div>
      <Icon className="icon--small" icon={icon} />
      <span>{number}</span>
    </div>
  );

  return (
    <animated.div className="notification-button__popup" style={style}>
      {newFollowers > 0 && renderIcons('person', newFollowers)}
      {newLikes > 0 && renderIcons('heart', newLikes)}
      {newComments > 0 && renderIcons('chatbubble', newComments)}
    </animated.div>
  );
};

export default NotificationPopup;
