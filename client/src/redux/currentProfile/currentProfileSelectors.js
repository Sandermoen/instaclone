import { createSelector } from 'reselect';

export const selectProfileState = state => state.currentProfile;

export const selectCurrentProfile = createSelector(
  [selectProfileState],
  profileState => profileState.profile
);

export const selectPosts = createSelector(
  [selectCurrentProfile],
  profile => profile.posts
);
