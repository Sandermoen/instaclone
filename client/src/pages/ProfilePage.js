import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';

import { selectCurrentUser } from '../redux/user/userSelectors';
import {
  selectProfileState,
  selectCurrentProfile
} from '../redux/currentProfile/currentProfileSelectors';

import { fetchCurrentProfileStart } from '../redux/currentProfile/currentProfileActions';

import Avatar from '../components/Avatar/Avatar';
import Button from '../components/Button/Button';
import ProfileCategory from '../components/ProfileCategory/ProfileCategory';
import PostDialog from '../components/PostDialog/PostDialog';
import Modal from '../components/Modal/Modal';
import Icon from '../components/Icon/Icon';
import ProfileImage from '../components/ProfileImage/ProfileImage';
import Loader from '../components/Loader/Loader';

const ProfilePage = ({
  currentUser,
  fetchCurrentProfileStart,
  profileState,
  currentProfile
}) => {
  const { username } = useParams();
  const [currentPost, setCurrentPost] = useState(undefined);

  useEffect(() => {
    fetchCurrentProfileStart(username);
  }, [username, fetchCurrentProfileStart]);

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
    if (profileState.fetching) {
      return <Loader />;
    } else if (profileState.error) {
      return <h1 className="heading-1">This page does not exist</h1>;
    }
    if (currentProfile) {
      return (
        <Fragment>
          <header className="profile-header">
            <Avatar
              imageSrc={
                currentProfile.avatar
                  ? currentProfile.avatar
                  : require('../assets/img/default-avatar.png')
              }
            />
            <div className="profile-header__info">
              <div className="profile-buttons">
                <h1 className="heading-1 font-thin">
                  {currentProfile.username}
                </h1>
                {renderButton()}
              </div>
              <div className="profile-stats">
                <p className="heading-3">
                  <b>{currentProfile.postCount}</b> posts
                </p>
                <p className="heading-3">
                  <b>{currentProfile.followersCount}</b>{' '}
                  {currentProfile.followersCount > 1 ||
                  currentProfile.followersCount === 0
                    ? 'followers'
                    : 'follower'}
                </p>
                <p className="heading-3">
                  <b>{currentProfile.followingCount}</b> following
                </p>
              </div>
              <div>
                <p className="heading-3">
                  <b>{currentProfile.bio}</b>
                </p>
              </div>
            </div>
          </header>
          <ProfileCategory category="POSTS" icon="apps" />
          <div className="profile-images">
            {currentProfile.posts.map((post, idx) => (
              <ProfileImage
                onClick={() => setCurrentPost(post)}
                image={post.image}
                likes={post.likes}
                key={idx}
              />
            ))}
          </div>
          {currentPost && (
            <Modal hide={() => setCurrentPost(undefined)}>
              <PostDialog
                post={currentPost}
                avatar={currentProfile.avatar}
                username={currentProfile.username}
                hide={() => setCurrentPost(undefined)}
              />
            </Modal>
          )}
        </Fragment>
      );
    }
  };

  return <div className="profile-page grid">{renderProfile()}</div>;
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  profileState: selectProfileState,
  currentProfile: selectCurrentProfile
});

const mapDispatchToProps = dispatch => ({
  fetchCurrentProfileStart: username =>
    dispatch(fetchCurrentProfileStart(username))
});

ProfilePage.whyDidYouRender = true;

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
