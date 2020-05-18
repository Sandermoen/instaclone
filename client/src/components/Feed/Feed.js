import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser, selectToken } from '../../redux/user/userSelectors';
import { showModal } from '../../redux/modal/modalActions';
import { showAlert } from '../../redux/alert/alertActions';
import { fetchFeedPostsStart } from '../../redux/feed/feedActions';
import {
  selectFeedPosts,
  selectFeedFetching,
} from '../../redux/feed/feedSelectors';

import PostDialog from '../PostDialog/PostDialog';

const Feed = ({
  fetchFeedPostsStart,
  feedPosts,
  feedFetching,
  currentUser,
  token,
  ...props
}) => {
  useEffect(() => {
    fetchFeedPostsStart(token);
  }, []);

  return (
    <section className="feed">
      {feedFetching ? (
        <Fragment>
          <PostDialog simple loading />
          <PostDialog simple loading />
          <PostDialog simple loading />
        </Fragment>
      ) : (
        feedPosts.map((post, idx) => (
          <PostDialog
            style={idx > 0 ? { marginTop: '5rem' } : {}}
            simple
            postData={post}
            postId={post._id}
            {...props}
          />
        ))
      )}
    </section>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  token: selectToken,
  feedPosts: selectFeedPosts,
  feedFetching: selectFeedFetching,
});

const mapStateToDispatch = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
  fetchFeedPostsStart: (authToken, offset) =>
    dispatch(fetchFeedPostsStart(authToken, offset)),
});

export default connect(mapStateToProps, mapStateToDispatch)(Feed);
