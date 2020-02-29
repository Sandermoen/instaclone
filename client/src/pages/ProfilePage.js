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

const ProfilePage = ({ currentUser }) => {
  const { username } = useParams();
  const [profile, setProfile] = useState(undefined);
  const [postDialog, setPostDialog] = useState(undefined);

  useEffect(() => {
    axios
      .get(`/user/${username}`)
      .then(response => {
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
            <ion-icon name="aperture-outline"></ion-icon>
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
          <ProfileCategory category="POSTS" svg="#icon-grid" />
          <div className="profile-images">
            {profile.posts.map(({ image, caption }) => (
              <div
                onClick={() => setPostDialog({ image, caption })}
                key={image}
                className="profile-images__image"
              >
                <img src={image} alt="User post" />
                <div className="profile-images__overlay">
                  <span className="profile-images__content">
                    <div className="icon icon--white">
                      <ion-icon name="chatbubbles"></ion-icon>
                    </div>
                    0
                  </span>
                </div>
              </div>
            ))}
          </div>
          {postDialog && (
            <Modal hide={() => setPostDialog(undefined)}>
              <PostDialog
                imageUrl={postDialog.image}
                comments={postDialog.caption}
                avatar={profile.avatar}
                username={profile.username}
                hide={() => setPostDialog(undefined)}
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
