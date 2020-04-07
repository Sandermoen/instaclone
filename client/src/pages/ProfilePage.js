import React, { useReducer, useEffect, useState, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';

import { selectCurrentUser } from '../redux/user/userSelectors';

import { INITIAL_STATE, profileReducer } from './ProfilePageReducer';
import { showModal } from '../redux/modal/modalActions';

import { getUserProfile } from '../services/profileService';
import { getPosts } from '../services/postService';

import useScrollPositionThrottled from '../hooks/useScrollPositionThrottled';

import Avatar from '../components/Avatar/Avatar';
import Button from '../components/Button/Button';
import ProfileCategory from '../components/ProfileCategory/ProfileCategory';
import Icon from '../components/Icon/Icon';
import ProfileImage from '../components/ProfileImage/ProfileImage';
import Loader from '../components/Loader/Loader';
import SkeletonLoader from '../components/SkeletonLoader/SkeletonLoader';

const ProfilePage = ({ currentUser, showModal }) => {
  const { username } = useParams();
  const [state, dispatch] = useReducer(profileReducer, INITIAL_STATE);

  useScrollPositionThrottled(async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      state.data.posts.length < state.data.postCount &&
      !state.fetchingAdditionalPosts
    ) {
      console.log(state.data.posts.length, state.data.postCount);
      try {
        dispatch({ type: 'FETCH_ADDITIONAL_POSTS_START' });
        const posts = await getPosts(username, state.data.posts.length);
        dispatch({ type: 'FETCH_ADDITIONAL_POSTS_SUCCESS' });
        dispatch({ type: 'ADD_POSTS', payload: posts });
      } catch (err) {
        dispatch({ type: 'FETCH_ADDITIONAL_POSTS_FAILURE', payload: err });
      }
    }
  });

  useEffect(() => {
    try {
      (async function () {
        dispatch({ type: 'FETCH_PROFILE_START' });
        const profile = await getUserProfile(username);
        dispatch({ type: 'FETCH_PROFILE_SUCCESS', payload: profile });
      })();
    } catch (err) {
      dispatch({ type: 'FETCH_PROFILE_FAILURE', payload: err });
    }
  }, [username]);

  const handleClick = (postId) => {
    showModal(
      {
        postId,
        avatar: state.data.avatar,
        username,
        profileDispatch: dispatch,
      },
      'PostDialog'
    );
  };

  const renderButton = () => {
    if (currentUser) {
      return currentUser.username === username ? (
        <Fragment>
          <Button inverted>Edit Profile</Button>
          <div className="icon">
            <Icon icon="aperture-outline" />
          </div>
        </Fragment>
      ) : (
        <Button>Follow</Button>
      );
    }
    return <Button>Follow</Button>;
  };

  const renderProfile = () => {
    if (state.fetching) {
      return <Loader />;
    } else if (state.error) {
      return <h1 className="heading-1">This page does not exist</h1>;
    }
    if (state.data) {
      const {
        followers,
        following,
        user: { avatar, username, bio },
        posts,
        postCount,
      } = state.data;
      return (
        <Fragment>
          <header className="profile-header">
            <Avatar imageSrc={avatar} />
            <div className="profile-header__info">
              <div className="profile-buttons">
                <h1 className="heading-1 font-thin">{username}</h1>
                {renderButton()}
              </div>
              <div className="profile-stats">
                <p className="heading-3">
                  <b>{postCount}</b> posts
                </p>
                <p className="heading-3">
                  <b>{followers}</b>{' '}
                  {followers > 1 || followers === 0 ? 'followers' : 'follower'}
                </p>
                <p className="heading-3">
                  <b>{following}</b> following
                </p>
              </div>
              <div>
                <p className="heading-3">
                  <b>{bio}</b>
                </p>
              </div>
            </div>
          </header>
          <ProfileCategory category="POSTS" icon="apps" />
          <div className="profile-images">
            {posts.map((post, idx) => {
              return (
                <ProfileImage
                  onClick={() => handleClick(post._id)}
                  image={post.image}
                  likes={post.postVotes}
                  comments={post.comments}
                  key={idx}
                />
              );
            })}
            {state.fetchingAdditionalPosts && (
              <Fragment>
                <div>
                  <SkeletonLoader animated />
                </div>
                <div>
                  <SkeletonLoader animated />
                </div>
                <div>
                  <SkeletonLoader animated />
                </div>
              </Fragment>
            )}
          </div>
        </Fragment>
      );
    }
  };

  return <div className="profile-page grid">{renderProfile()}</div>;
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
