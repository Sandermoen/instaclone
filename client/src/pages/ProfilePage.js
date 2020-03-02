import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { selectCurrentUser } from '../redux/user/userSelectors';

import Avatar from '../components/Avatar/Avatar';
import Button from '../components/Button/Button';
import ProfileCategory from '../components/ProfileCategory/ProfileCategory';
import PostDialog from '../components/PostDialog/PostDialog';
import Modal from '../components/Modal/Modal';
import Icon from '../components/Icon/Icon';
import ProfileImage from '../components/ProfileImage/ProfileImage';

const ProfilePage = ({ currentUser }) => {
  const { username } = useParams();
  const [profile, setProfile] = useState(undefined);
  const [currentPost, setCurrentPost] = useState(undefined);

  useEffect(() => {
    axios
      .get(`/user/${username}`)
      .then(response => {
        console.log(response);
        setProfile(response.data);
      })
      .catch(err => console.warn(err.message));
  }, [setProfile, username]);

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

  return (
    <div className="profile-page grid">
      {profile && (
        <Fragment>
          <header className="profile-header">
            <Avatar
              imageSrc={
                profile.avatar
                  ? profile.avatar
                  : require('../assets/img/default-avatar.png')
              }
            />
            <div className="profile-header__info">
              <div className="profile-buttons">
                <h1 className="heading-1 font-thin">{profile.username}</h1>
                {renderButton()}
              </div>
              <div className="profile-stats">
                <p className="heading-3">
                  <b>{profile.postCount}</b> posts
                </p>
                <p className="heading-3">
                  <b>{profile.followersCount}</b>{' '}
                  {profile.followersCount > 1 || profile.followersCount === 0
                    ? 'followers'
                    : 'follower'}
                </p>
                <p className="heading-3">
                  <b>{profile.followingCount}</b> following
                </p>
              </div>
              <div>
                <p className="heading-3">
                  <b>{profile.bio}</b>
                </p>
              </div>
            </div>
          </header>
          <ProfileCategory category="POSTS" />
          <div className="profile-images">
            {profile.posts.map(post => (
              <ProfileImage
                onClick={() => setCurrentPost(post)}
                image={post.image}
                likes={post.likes}
              />
            ))}
          </div>
          {currentPost && (
            <Modal hide={() => setCurrentPost(undefined)}>
              <PostDialog
                post={currentPost}
                avatar={profile.avatar}
                username={profile.username}
                hide={() => setCurrentPost(undefined)}
              />
            </Modal>
          )}
        </Fragment>
      )}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(ProfilePage);
