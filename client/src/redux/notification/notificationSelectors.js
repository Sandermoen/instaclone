import { createSelector } from 'reselect';

const selectNotificationsObject = (state) => state.notifications;

export const selectNotifications = createSelector(
  [selectNotificationsObject],
  (notifications) => notifications.notifications
);

export const selectNotificationState = createSelector(
  [selectNotificationsObject],
  (notifications) => notifications
);
