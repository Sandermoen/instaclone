import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '../redux/user/userSelectors';

import Feed from '../components/Feed/Feed';
import UserCard from '../components/UserCard/UserCard';

const HomePage = ({ currentUser }) => {
  useEffect(() => {
    document.title = `Instaclone`;
  }, []);

  return (
    <div data-test="page-home" className="home-page grid">
      <Feed />
      <aside className="sidebar">
        <div className="sidebar__content">
          <UserCard
            avatar={currentUser.avatar}
            username={currentUser.username}
            subText={currentUser.fullName}
            avatarMedium
          />
        </div>
      </aside>
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(HomePage);
