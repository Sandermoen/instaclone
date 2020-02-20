import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { selectCurrentUser } from '../redux/user/userSelectors';

import Avatar from '../components/Avatar/Avatar';
import Button from '../components/Button/Button';
import ProfileCategory from '../components/ProfileCategory/ProfileCategory';

import sprite from '../assets/svg/svg-sprites.svg';

const ProfilePage = ({ currentUser }) => {
  const { username } = useParams();
  const [profile, setProfile] = useState(undefined);
  // const [error, setError] = useState(undefined);

  useEffect(() => {
    axios
      .get(`/user/${username}`)
      .then(response => {
        setProfile(response.data);
      })
      .catch(err => console.log(err.message));
  }, [setProfile, username]);

  const renderButton = () => {
    if (currentUser) {
      return currentUser.username === username ? (
        <Fragment>
          <Button inverted>Edit Profile</Button>
          <svg className="icon">
            <use href={sprite + '#icon-cog'} />
          </svg>
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
            <Avatar imageSrc="https://iupac.org/wp-content/uploads/2018/05/default-avatar.png" />
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
            {profile.posts.map(post => (
              <div key={post} className="profile-images__image">
                <img src={post} alt="User post" />
              </div>
            ))}
          </div>
        </Fragment>
      )}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser
});

export default connect(mapStateToProps)(ProfilePage);
