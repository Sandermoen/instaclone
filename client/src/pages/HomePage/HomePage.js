import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser, selectToken } from '../../redux/user/userSelectors';
import {
  selectFeedPosts,
  selectHasMore,
  selectFeedFetching,
} from '../../redux/feed/feedSelectors';
import { fetchFeedPostsStart, clearPosts } from '../../redux/feed/feedActions';

import useScrollPositionThrottled from '../../hooks/useScrollPositionThrottled';

import Feed from '../../components/Feed/Feed';
import UserCard from '../../components/UserCard/UserCard';
import SmallFooter from '../../components/Footer/SmallFooter/SmallFooter';
import MobileHeader from '../../components/Header/MobileHeader/MobileHeader';
import Icon from '../../components/Icon/Icon';
import NewPostButton from '../../components/NewPost/NewPostButton/NewPostButton';

const HomePage = ({
  currentUser,
  fetchFeedPostsStart,
  clearPosts,
  token,
  feedPosts,
  hasMore,
  fetching,
}) => {
  useEffect(() => {
    document.title = `Instaclone`;
    fetchFeedPostsStart(token);
    return () => {
      clearPosts();
    };
  }, []);

  useScrollPositionThrottled(
    ({ previousScrollPosition, currentScrollPosition, atBottom }) => {
      if (atBottom && hasMore && !fetching) {
        fetchFeedPostsStart(token, feedPosts.length);
      }
    }
  );

  return (
    <Fragment>
      <MobileHeader>
        <NewPostButton />
        <h3 style={{ fontSize: '2.5rem' }} className="heading-logo">
          Instaclone
        </h3>
        <Icon icon="paper-plane-outline" />
      </MobileHeader>
      <div data-test="page-home" className="home-page grid">
        <Feed />
        <aside className="sidebar">
          <div className="sidebar__content">
            <UserCard
              avatar={currentUser.avatar}
              username={currentUser.username}
              subText={currentUser.fullName}
              style={{ padding: '0' }}
              avatarMedium
            />
            <SmallFooter />
          </div>
        </aside>
      </div>
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  token: selectToken,
  feedPosts: selectFeedPosts,
  hasMore: selectHasMore,
  fetching: selectFeedFetching,
});

const mapDispatchToProps = (dispatch) => ({
  fetchFeedPostsStart: (authToken, offset) =>
    dispatch(fetchFeedPostsStart(authToken, offset)),
  clearPosts: () => dispatch(clearPosts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
