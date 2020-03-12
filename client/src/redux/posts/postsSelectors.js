import { createSelector } from 'reselect';

const getPosts = state => state.posts;

const getPost = (state, { currentPostId }) => state.posts.data[currentPostId];

export const selectPosts = createSelector([getPosts], posts => posts.data);

export const selectPost = createSelector([getPost], post => post);

export const selectFetching = createSelector(
  [getPosts],
  posts => posts.fetching
);
