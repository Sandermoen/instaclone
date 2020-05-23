import React from 'react';

import Card from '../../Card/Card';
import NotificationFeed from '../NotificationFeed/NotificationFeed';

const NotificationCard = (props) => {
  return (
    <Card className="notification-card">
      <ul
        style={{
          listStyleType: 'none',
          maxHeight: '30rem',
          overflowY: 'auto',
          backgroundColor: 'white',
        }}
        // Prevent hiding the component when clicking inside the component
        onClick={(event) => event.stopPropagation()}
      >
        <NotificationFeed {...props} />
      </ul>
    </Card>
  );
};

export default NotificationCard;
