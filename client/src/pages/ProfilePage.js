import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Avatar from '../components/Avatar/Avatar';
import Button from '../components/Button/Button';

import sprite from '../assets/svg/svg-sprites.svg';

const ProfilePage = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(undefined);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    axios
      .get(`/user/${username}`)
      .then(response => {
        setProfile(response.data);
      })
      .catch(err => setError(err.message));
  }, [setProfile, setError]);

  return (
    <div className="profile-page grid">
      {profile && (
        <header className="profile-header">
          <Avatar imageSrc="https://iupac.org/wp-content/uploads/2018/05/default-avatar.png" />
          <div className="profile-header__info">
            <div className="profile-buttons">
              <h1 className="heading-1 font-thin">{profile.username}</h1>
              <Button inverted>Edit Profile</Button>
              <svg className="profile-buttons__settings-icon">
                <use href={sprite + '#icon-cog'} />
              </svg>
            </div>
            <div className="profile-stats">
              <p className="heading-3">
                <b>{profile.postCount}</b> posts
              </p>
              <p className="heading-3">
                <b>{profile.followersCount}</b> follower
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
      )}
    </div>
  );
};

export default ProfilePage;
