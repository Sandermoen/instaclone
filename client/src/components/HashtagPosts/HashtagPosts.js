import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';

import useScrollPositionThrottled from '../../hooks/useScrollPositionThrottled';
import { getHashtagPosts } from '../../services/postService';

import MobileHeader from '../../components/Header/MobileHeader/MobileHeader';
import TextButton from '../../components/Button/TextButton/TextButton';
import PreviewImage from '../../components/PreviewImage/PreviewImage';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import ImageGrid from '../../components/ImageGrid/ImageGrid';

const HashtagPosts = ({ token, showModal, showAlert }) => {
  const [posts, setPosts] = useState({
    posts: [],
    postCount: 0,
    fetching: false,
    hasMore: false,
  });

  const { hashtag } = useParams();
  const history = useHistory();

  const handleClick = (postId, avatar) => {
    if (window.outerWidth <= 600) {
      history.push(`/post/${postId}`);
    } else {
      showModal(
        {
          postId,
          avatar,
        },
        'PostDialog/PostDialog'
      );
    }
  };

  const retrievePosts = async (offset) => {
    try {
      setPosts((previous) => ({ ...previous, fetching: true }));
      const response = await getHashtagPosts(token, hashtag, offset);
      response.posts
        ? setPosts((previous) => ({
            posts: previous.posts
              ? [...previous.posts, ...response.posts]
              : response.posts,
            postCount: response.postCount,
            fetching: false,
            hasMore: response.length === 20,
          }))
        : setPosts((previous) => ({ ...previous, fetching: false }));
    } catch (err) {
      showAlert(err.message);
    }
  };

  const renderSkeleton = (amount) => {
    const skeleton = [];
    for (let i = 0; i < amount; i++) {
      skeleton.push(
        <SkeletonLoader key={i} style={{ minHeight: '30rem' }} animated />
      );
    }
    return skeleton;
  };

  useScrollPositionThrottled(
    ({ atBottom }) => {
      if (atBottom && posts.hasMore && !posts.fetching) {
        retrievePosts(posts.posts.length);
      }
    },
    null,
    [posts]
  );

  const retrievePostsRef = useRef(retrievePosts);

  useEffect(() => {
    retrievePostsRef.current();
  }, [retrievePostsRef]);

  return !posts.fetching && posts.posts.length === 0 ? (
    <div className="hashtag-posts__empty">
      <h2 className="heading-2">
        Could not find any post associated with #{hashtag}.
      </h2>
    </div>
  ) : (
    <Fragment>
      <MobileHeader backArrow>
        <TextButton style={{ justifySelf: 'center' }} bold large>
          #{hashtag}
        </TextButton>
      </MobileHeader>
      <div className="hashtag-posts__title">
        <h2 className="heading-2">#{hashtag}</h2>
        <h3 className="heading-3 font-medium">
          <span className="font-bold">{posts.postCount}</span>{' '}
          {posts.postCount === 1 ? 'post' : 'posts'}
        </h3>
      </div>
      <ImageGrid>
        {posts.posts &&
          posts.posts.map((post, idx) => (
            <PreviewImage
              key={idx}
              image={post.thumbnail}
              likes={post.postVotes}
              comments={post.comments}
              filter={post.filter}
              onClick={() => handleClick(post._id, post.avatar)}
            />
          ))}
        {posts.fetching && renderSkeleton(10)}
      </ImageGrid>
    </Fragment>
  );
};

export default HashtagPosts;
