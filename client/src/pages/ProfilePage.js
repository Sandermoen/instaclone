import React, { useReducer, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';

import { selectCurrentUser, selectToken } from '../redux/user/userSelectors';

import { INITIAL_STATE, profileReducer } from './ProfilePageReducer';
import { showModal } from '../redux/modal/modalActions';

import { getUserProfile, followUser } from '../services/profileService';
import { getPosts } from '../services/postService';

import useScrollPositionThrottled from '../hooks/useScrollPositionThrottled';

import Avatar from '../components/Avatar/Avatar';
import Button from '../components/Button/Button';
import ProfileCategory from '../components/ProfileCategory/ProfileCategory';
import Icon from '../components/Icon/Icon';
import ProfileImage from '../components/ProfileImage/ProfileImage';
import Loader from '../components/Loader/Loader';
import SkeletonLoader from '../components/SkeletonLoader/SkeletonLoader';
import UsersList from '../components/UsersList/UsersList';
import UnfollowPrompt from '../components/UnfollowPrompt/UnfollowPrompt';

const ProfilePage = ({ currentUser, token, showModal }) => {
  const { username } = useParams();
  const [state, dispatch] = useReducer(profileReducer, INITIAL_STATE);

  const follow = async () => {
    try {
      dispatch({ type: 'FOLLOW_USER_START' });
      const response = await followUser(state.data.user._id, token);
      dispatch({
        type: 'FOLLOW_USER_SUCCESS',
        payload: response.operation,
      });
    } catch (err) {
      dispatch({
        type: 'FOLLOW_USER_FAILURE',
        payload: err,
      });
    }
  };

  useScrollPositionThrottled(async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight &&
      state.data.posts.length < state.data.postCount &&
      !state.fetchingAdditionalPosts
    ) {
      try {
        dispatch({ type: 'FETCH_ADDITIONAL_POSTS_START' });
        const posts = await getPosts(username, state.data.posts.length);
        dispatch({ type: 'FETCH_ADDITIONAL_POSTS_SUCCESS' });
        dispatch({ type: 'ADD_POSTS', payload: posts });
      } catch (err) {
        dispatch({ type: 'FETCH_ADDITIONAL_POSTS_FAILURE', payload: err });
      }
    }
  }, null);

  useEffect(() => {
    document.title = `@${username} • Instaclone photos`;
    try {
      (async function () {
        dispatch({ type: 'FETCH_PROFILE_START' });
        const profile = await getUserProfile(username, token);
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
      if (currentUser.username === username) {
        return (
          <Fragment>
            <Button inverted>Edit Profile</Button>
            <div className="icon">
              <Icon icon="aperture-outline" />
            </div>
          </Fragment>
        );
      } else if (state.data.isFollowing) {
        return (
          <Button
            loading={state.following}
            onClick={() =>
              showModal(
                {
                  options: [
                    {
                      warning: true,
                      text: 'Unfollow',
                      onClick: () => follow(),
                    },
                  ],
                  children: (
                    <UnfollowPrompt
                      avatar={state.data.user.avatar}
                      username={state.data.user.username}
                    />
                  ),
                },
                'OptionsDialog'
              )
            }
            inverted
          >
            Following
          </Button>
        );
      }
    }
    return (
      <Button
        loading={state.following}
        onClick={() => follow(state.data.user._id, token)}
      >
        Follow
      </Button>
    );
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
                <p
                  onClick={() =>
                    showModal(
                      {
                        options: [],
                        title: 'Followers',
                        cancelButton: false,
                        children: (
                          <UsersList
                            userId={state.data.user._id}
                            token={token}
                            followersCount={followers}
                            followers
                          />
                        ),
                      },
                      'OptionsDialog'
                    )
                  }
                  style={{ cursor: 'pointer' }}
                  className="heading-3"
                >
                  <b>{followers}</b>{' '}
                  {followers > 1 || followers === 0 ? 'followers' : 'follower'}
                </p>
                <p
                  onClick={() =>
                    showModal(
                      {
                        options: [],
                        title: 'Following',
                        cancelButton: false,
                        children: (
                          <UsersList
                            userId={state.data.user._id}
                            token={token}
                            followingCount={following}
                            following
                          />
                        ),
                      },
                      'OptionsDialog'
                    )
                  }
                  style={{ cursor: 'pointer' }}
                  className="heading-3"
                >
                  <b>{following}</b> following
                </p>
              </div>
              <div>
                <p className="heading-3">
                  <b>John Marston</b>
                </p>
                <p className="heading-3">{bio}</p>
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
  token: selectToken,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
