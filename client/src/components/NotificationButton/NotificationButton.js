import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useTransition } from 'react-spring';

import {
  selectNotifications,
  selectNotificationState,
} from '../../redux/notification/notificationSelectors';
import { selectToken } from '../../redux/user/userSelectors';

import {
  fetchNotificationsStart,
  readNotificationsStart,
  clearNotifications,
} from '../../redux/notification/notificationActions';

import Icon from '../Icon/Icon';
import NotificationPopup from './NotificationPopup/NotificationPopup';
import NotificationCard from '../NotificationCard/NotificationCard';

const NotificationButton = ({
  notifications,
  notificationState,
  fetchNotificationsStart,
  readNotificationsStart,
  clearNotifications,
  token,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationPopupTimeout, setShowNotificationPopupTimeout] = useState(
    null
  );

  useEffect(() => {
    if (notificationPopupTimeout) {
      clearTimeout(notificationPopupTimeout);
    }
    if (notificationState.unreadCount > 0) {
      !showNotificationPopup && setShowNotificationPopup(true);
      setShowNotificationPopupTimeout(
        setTimeout(() => setShowNotificationPopup(false), 10000)
      );
    }
  }, [notificationState.unreadCount]);

  useEffect(() => {
    if (showNotifications) {
      clearTimeout(notificationPopupTimeout);
      setShowNotificationPopup(false);
    }
  }, [showNotifications]);

  const transitions = useTransition(
    showNotificationPopup && !showNotifications,
    null,
    {
      from: {
        transform: 'scale(0) translateX(-50%)',
        opacity: 0,
      },
      enter: {
        transform: 'scale(1) translateX(-50%)',
        opacity: 1,
      },
      leave: {
        transform: 'scale(0) translateX(-50%)',
        opacity: 0,
      },
      config: {
        tension: 280,
        friction: 20,
      },
    }
  );

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <button className="notification-button">
        <Icon
          icon={showNotifications ? 'heart' : 'heart-outline'}
          className={notificationState.unreadCount > 0 ? 'icon--unread' : ''}
          onClick={() => setShowNotifications((previous) => !previous)}
          style={{ cursor: 'pointer' }}
        />
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <NotificationPopup
                style={props}
                notifications={notifications}
                key={key}
              />
            )
        )}
      </button>
      {showNotifications && (
        <NotificationCard
          notifications={notifications}
          fetchNotificationsStart={fetchNotificationsStart}
          readNotificationsStart={readNotificationsStart}
          clearNotifications={clearNotifications}
          notificationState={notificationState}
          token={token}
          setShowNotifications={setShowNotifications}
        />
      )}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  notifications: selectNotifications,
  notificationState: selectNotificationState,
  token: selectToken,
});

const mapDispatchToProps = (dispatch) => ({
  fetchNotificationsStart: (authToken) =>
    dispatch(fetchNotificationsStart(authToken)),
  readNotificationsStart: (authToken) =>
    dispatch(readNotificationsStart(authToken)),
  clearNotifications: () => dispatch(clearNotifications()),
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationButton);
