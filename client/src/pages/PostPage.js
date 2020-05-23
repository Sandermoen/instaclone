import React, { Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';

import PostDialog from '../components/PostDialog/PostDialog';
import MobileHeader from '../components/Header/MobileHeader/MobileHeader';
import Icon from '../components/Icon/Icon';

const PostPage = () => {
  const { postId } = useParams();

  return (
    <Fragment>
      <MobileHeader backArrow>
        <h3 className="heading-3">Post</h3>
        {/* Empty element to keep flexbox happy */}
        <div></div>
      </MobileHeader>
      <div className="post-page grid">
        <PostDialog className="border-grey-2" postId={postId} />
      </div>
    </Fragment>
  );
};

export default PostPage;
