import { createSelector } from 'reselect';

const getPosts = state => state.posts;

const getPost = (state, { currentPostId }) => state.posts.data[currentPostId];

export const selectPosts = createSelector([getPosts], posts => posts.data);

export const selectReplyComment = createSelector(
  [getPosts],
  posts => posts.replyComment
);

export const selectPost = createSelector([getPost], post => post);

export const selectFetching = createSelector(
  [getPosts],
  posts => posts.fetching
);

export const selectComment = (state, comment) =>
  createSelector([getPost], post => post.comments[comment._id]);
