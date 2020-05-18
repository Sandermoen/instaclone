import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import { hideModal } from '../../redux/modal/modalActions';
import { formatDateDistance } from '../../utils/timeUtils';

import Avatar from '../Avatar/Avatar';

const UserCard = ({
  avatar,
  username,
  subText,
  subTextDark,
  date,
  style,
  hideModal,
  onClick,
  children,
  avatarMedium,
}) => {
  const avatarClassNames = classNames({
    'avatar--small': !avatarMedium,
    'avatar--medium': avatarMedium,
  });
  return (
    <div className="user-card" style={style}>
      {onClick ? (
        <Avatar
          onClick={() => onClick()}
          className={avatarClassNames}
          imageSrc={avatar}
          style={{ cursor: 'pointer' }}
        />
      ) : (
        <Link
          style={{ display: 'flex' }}
          onClick={() => hideModal('OptionsDialog')}
          to={`/${username}`}
        >
          <Avatar className={avatarClassNames} imageSrc={avatar} />
        </Link>
      )}
      <div className="user-card__details">
        {onClick ? (
          <p
            onClick={() => onClick()}
            style={{ cursor: 'pointer' }}
            className="heading-4 font-bold"
          >
            {username}
          </p>
        ) : (
          <Link
            onClick={() => hideModal('OptionsDialog')}
            style={{ textDecoration: 'none' }}
            to={`/${username}`}
          >
            <p className="heading-4 font-bold">{username}</p>
          </Link>
        )}
        {subText && (
          <p
            className={`heading-4 ${
              subTextDark ? 'color-black' : 'color-grey'
            }`}
          >
            {subText}
            {date && (
              <span className="color-grey ml-sm">
                {formatDateDistance(date)}
              </span>
            )}
          </p>
        )}
      </div>
      {children}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  hideModal: (component) => dispatch(hideModal(component)),
});

export default connect(null, mapDispatchToProps)(UserCard);
