import React, { useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentUser } from '../redux/user/userSelectors';

import Feed from '../components/Feed/Feed';
import UserCard from '../components/UserCard/UserCard';
import SmallFooter from '../components/Footer/SmallFooter/SmallFooter';
import MobileHeader from '../components/Header/MobileHeader/MobileHeader';
import Icon from '../components/Icon/Icon';
import UploadMediaButton from '../components/UploadMediaButton/UploadMediaButton';

const HomePage = ({ currentUser }) => {
  useEffect(() => {
    document.title = `Instaclone`;
  }, []);

  return (
    <Fragment>
      <MobileHeader>
        <UploadMediaButton />
        <h3 style={{ fontSize: '2.5rem' }} className="heading-logo">
          Instaclone
        </h3>
        <Icon icon="paper-plane-outline" />
      </MobileHeader>
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
            <SmallFooter />
          </div>
        </aside>
      </div>
    </Fragment>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
});

export default connect(mapStateToProps)(HomePage);
