import { createSelector } from 'reselect';

const selectUser = (state) => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser
);

export const selectError = createSelector([selectUser], (user) => user.error);

export const selectToken = createSelector([selectUser], (user) => user.token);

export const selectFetching = createSelector(
  [selectUser],
  (user) => user.fetching
);

export const selectFetchingAvatar = createSelector(
  [selectUser],
  (user) => user.fetchingAvatar
);

export const selectUpdatingProfile = createSelector(
  [selectUser],
  (user) => user.updatingProfile
);
