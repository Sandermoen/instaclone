import React, { Fragment, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import useScrollPositionThrottled from '../../hooks/useScrollPositionThrottled';
import { getSuggestedPosts } from '../../services/postService';

import MobileHeader from '../../components/Header/MobileHeader/MobileHeader';
import SearchBox from '../../components/SearchBox/SearchBox';
import TextButton from '../../components/Button/TextButton/TextButton';
import UserCard from '../../components/UserCard/UserCard';
import PreviewImage from '../../components/PreviewImage/PreviewImage';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';
import ImageGrid from '../../components/ImageGrid/ImageGrid';

const SuggestedPosts = ({ token, showModal, showAlert }) => {
  const history = useHistory();
  const [result, setResult] = useState([]);
  const [search, setSearch] = useState(false);
  const [posts, setPosts] = useState({
    posts: null,
    fetching: false,
    hasMore: false,
  });

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
      const response = await getSuggestedPosts(token, offset);
      setPosts((previous) => ({
        posts: previous.posts ? [...previous.posts, ...response] : response,
        fetching: false,
        hasMore: response.length === 20,
      }));
    } catch (err) {
      showAlert(err.message);
    }
  };

  const retrievePostsRef = useRef(retrievePosts);

  useEffect(() => {
    retrievePostsRef.current();
  }, [retrievePostsRef]);

  useScrollPositionThrottled(
    ({ atBottom }) => {
      if (atBottom && posts.hasMore && !posts.fetching) {
        retrievePosts(posts.posts.length);
      }
    },
    null,
    [posts]
  );

  const renderSkeleton = (amount) => {
    const skeleton = [];
    for (let i = 0; i < amount; i++) {
      skeleton.push(
        <SkeletonLoader key={i} style={{ minHeight: '30rem' }} animated />
      );
    }
    return skeleton;
  };

  return (
    <Fragment>
      <MobileHeader
        style={
          search && {
            gridTemplateColumns: 'repeat(2, 1fr) min-content',
            gridColumnGap: '2rem',
          }
        }
      >
        <SearchBox
          style={{ gridColumn: `${search ? '1 / span 2' : '1 / -1'}` }}
          setResult={setResult}
          onClick={() => setSearch(true)}
        />
        {search && (
          <TextButton onClick={() => setSearch(false)} bold large>
            Cancel
          </TextButton>
        )}
      </MobileHeader>
      {search ? (
        <div className="explore-users">
          {result.map((user) => (
            <UserCard
              avatar={user.avatar}
              username={user.username}
              subText={user.fullName}
            />
          ))}
        </div>
      ) : (
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
      )}
    </Fragment>
  );
};

export default SuggestedPosts;
