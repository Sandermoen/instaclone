import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import { selectCurrentUser } from '../redux/user/userSelectors';
import { selectPosts } from '../redux/posts/postsSelectors';

import { showModal } from '../redux/modal/modalActions';
import { addPosts, clearPosts } from '../redux/posts/postsActions';

import Avatar from '../components/Avatar/Avatar';
import Button from '../components/Button/Button';
import ProfileCategory from '../components/ProfileCategory/ProfileCategory';
import Icon from '../components/Icon/Icon';
import ProfileImage from '../components/ProfileImage/ProfileImage';
import Loader from '../components/Loader/Loader';

const ProfilePage = ({
  currentUser,
  showModal,
  posts,
  addPosts,
  clearPosts
}) => {
  const { username } = useParams();
  const [currentProfile, setCurrentProfile] = useState({
    fetching: false,
    error: false,
    data: undefined
  });

  useEffect(() => {
    // Fetch the user's profile
    setCurrentProfile({ fetching: true });
    axios
      .get(`/user/${username}`)
      .then(response => {
        const {
          username,
          followersCount,
          followingCount,
          postCount,
          posts,
          avatar
        } = response.data;
        setCurrentProfile({
          fetching: false,
          data: { username, followersCount, followingCount, postCount, avatar }
        });
        // Add all posts to state
        addPosts(posts);
      })
      .catch(err =>
        setCurrentProfile({
          fetching: false,
          error: err.data
        })
      );

    return () => {
      clearPosts();
    };
  }, [username, addPosts]);

  const handleClick = postId => {
    showModal(
      {
        currentPostId: postId,
        avatar: currentProfile.data.avatar,
        username
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
    if (currentProfile.fetching) {
      return <Loader />;
    } else if (currentProfile.error) {
      return <h1 className="heading-1">This page does not exist</h1>;
    }
    if (currentProfile.data) {
      const {
        avatar,
        username,
        postCount,
        followersCount,
        bio
      } = currentProfile.data;
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
                  <b>{followersCount}</b>{' '}
                  {followersCount > 1 || followersCount === 0
                    ? 'followers'
                    : 'follower'}
                </p>
                <p className="heading-3">
                  <b>{followersCount}</b> following
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
            {Object.entries(posts).map((postArray, idx) => {
              const post = postArray[1];
              return (
                <ProfileImage
                  onClick={() => handleClick(post._id)}
                  image={post.image}
                  likes={post.likesCount}
                  comments={post.commentsCount}
                  key={idx}
                />
              );
            })}
          </div>
        </Fragment>
      );
    }
  };

  return <div className="profile-page grid">{renderProfile()}</div>;
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  posts: selectPosts
});

const mapDispatchToProps = dispatch => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  addPosts: posts => dispatch(addPosts(posts)),
  clearPosts: () => dispatch(clearPosts())
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
