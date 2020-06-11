import React, { Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useHistory } from 'react-router-dom';

import useScrollPositionThrottled from '../../hooks/useScrollPositionThrottled';

import { selectToken } from '../../redux/user/userSelectors';
import { showAlert } from '../../redux/alert/alertActions';
import { showModal } from '../../redux/modal/modalActions';

import { getSuggestedPosts } from '../../services/postService';

import MobileHeader from '../../components/Header/MobileHeader/MobileHeader';
import SearchBox from '../../components/SearchBox/SearchBox';
import TextButton from '../../components/Button/TextButton/TextButton';
import UserCard from '../../components/UserCard/UserCard';
import PreviewImage from '../../components/PreviewImage/PreviewImage';
import SkeletonLoader from '../../components/SkeletonLoader/SkeletonLoader';

const ExplorePage = ({ token, showAlert, showModal }) => {
  const [result, setResult] = useState([]);
  const [suggestedPosts, setSuggestedPosts] = useState({
    posts: null,
    fetching: false,
    hasMore: false,
  });
  const [search, setSearch] = useState(false);
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
      setSuggestedPosts((previous) => ({ ...previous, fetching: true }));
      const response = await getSuggestedPosts(token, offset);
      setSuggestedPosts((previous) => ({
        posts: previous.posts ? [...previous.posts, ...response] : response,
        fetching: false,
        hasMore: response.length === 20,
      }));
    } catch (err) {
      showAlert(err.message);
    }
  };

  useEffect(() => {
    document.title = 'Instaclone';
    retrievePosts();
  }, [getSuggestedPosts, setSuggestedPosts, showAlert]);

  useScrollPositionThrottled(
    ({ atBottom }) => {
      if (atBottom && suggestedPosts.hasMore && !suggestedPosts.fetching) {
        retrievePosts(suggestedPosts.posts.length);
      }
    },
    null,
    [suggestedPosts]
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
        show
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
      <main className="explore-page grid">
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
          <div className="explore-posts">
            {suggestedPosts.posts &&
              suggestedPosts.posts.map((post, idx) => (
                <PreviewImage
                  key={idx}
                  image={post.thumbnail}
                  likes={post.postVotes}
                  comments={post.comments}
                  filter={post.filter}
                  onClick={() => handleClick(post._id, post.avatar)}
                />
              ))}
            {suggestedPosts.fetching && renderSkeleton(10)}
          </div>
        )}
      </main>
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectToken,
});

const mapDistpachToProps = (dispatch) => ({
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
  showModal: (props, component) => dispatch(showModal(props, component)),
});

export default connect(mapStateToProps, mapDistpachToProps)(ExplorePage);
