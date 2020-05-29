import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectToken } from '../../redux/user/userSelectors';
import {
  selectFeedPosts,
  selectFeedFetching,
} from '../../redux/feed/feedSelectors';

import PostDialog from '../PostDialog/PostDialog';

const Feed = ({ feedPosts, feedFetching, token, ...props }) => {
  return (
    <section className="feed">
      {feedPosts &&
        feedPosts.map((post, idx) => (
          <PostDialog simple postData={post} postId={post._id} key={idx} />
        ))}
      {feedFetching && (
        <Fragment>
          <PostDialog simple loading />
          <PostDialog simple loading />
          <PostDialog simple loading />
        </Fragment>
      )}
    </section>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
  feedPosts: selectFeedPosts,
  feedFetching: selectFeedFetching,
});

export default connect(mapStateToProps)(Feed);
