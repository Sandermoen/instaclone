import React from 'react';
import { useParams } from 'react-router-dom';

import PostDialog from '../components/PostDialog/PostDialog';

const PostPage = () => {
  const { postId } = useParams();

  return (
    <div className="post-page grid">
      <PostDialog className="border-grey-2" postId={postId} />
    </div>
  );
};

export default PostPage;
