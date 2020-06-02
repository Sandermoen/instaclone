import { createSelector } from 'reselect';

const selectFeed = (state) => state.feed;

export const selectFeedPosts = createSelector(
  [selectFeed],
  (feed) => feed.posts
);

export const selectFeedError = createSelector(
  [selectFeed],
  (feed) => feed.error
);

export const selectFeedFetching = createSelector(
  [selectFeed],
  (feed) => feed.fetching
);

export const selectHasMore = createSelector(
  [selectFeed],
  (feed) => feed.hasMore
);
