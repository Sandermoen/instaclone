import notificationTypes from './notificationTypes';

const INITIAL_STATE = {
  notifications: [],
  unreadCount: 0,
  fetching: false,
  error: false,
};

const notificationReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case notificationTypes.ADD_NOTIFICATION: {
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1,
      };
    }
    case notificationTypes.FETCH_NOTIFICATIONS_START: {
      return {
        ...state,
        fetching: true,
        error: false,
      };
    }
    case notificationTypes.FETCH_NOTIFICATIONS_FAILURE: {
      return {
        ...state,
        fetching: false,
        error: action.payload,
      };
    }
    case notificationTypes.FETCH_NOTIFICATIONS_SUCCESS: {
      const unreadCount = action.payload.filter(
        (notification) => notification.read === false
      ).length;
      return {
        ...state,
        fetching: false,
        error: false,
        notifications: action.payload,
        unreadCount,
      };
    }
    case notificationTypes.READ_NOTIFICATIONS: {
      const notifications = JSON.parse(JSON.stringify(state.notifications));
      notifications.forEach((notification) => (notification.read = true));
      return {
        ...state,
        unreadCount: 0,
        notifications,
      };
    }
    case notificationTypes.CLEAR_NOTIFICATIONS: {
      return {
        ...state,
        unreadCount: 0,
        notifications: [],
      };
    }
    default: {
      return state;
    }
  }
};

export default notificationReducer;
