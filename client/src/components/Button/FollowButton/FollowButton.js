import React, { useState } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import {
  selectCurrentUser,
  selectToken,
} from '../../../redux/user/userSelectors';
import { showModal } from '../../../redux/modal/modalActions';
import { showAlert } from '../../../redux/alert/alertActions';

import { followUser } from '../../../services/profileService';

import Button from '../Button';
import UnfollowPrompt from '../../UnfollowPrompt/UnfollowPrompt';

const FollowButton = ({
  userId,
  token,
  currentUser,
  showModal,
  following,
  username,
  avatar,
  showAlert,
  style,
}) => {
  const [isFollowing, setIsFollowing] = useState(following);
  const [loading, setLoading] = useState(false);

  const follow = async () => {
    try {
      setLoading(true);
      await followUser(userId, token);
      if (!isFollowing) {
        setIsFollowing(true);
      } else {
        setIsFollowing(false);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      showAlert('Could not follow the user.', () => follow());
    }
  };

  if (username === currentUser.username) {
    return <Button disabled>Follow</Button>;
  }

  if (isFollowing) {
    return (
      <Button
        style={style}
        loading={loading}
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
              children: <UnfollowPrompt avatar={avatar} username={username} />,
            },
            'OptionsDialog/OptionsDialog'
          )
        }
        inverted
      >
        Following
      </Button>
    );
  }
  return (
    <Button style={style} loading={loading} onClick={() => follow()}>
      Follow
    </Button>
  );
};

const mapStateToProps = createStructuredSelector({
  currentUser: selectCurrentUser,
  token: selectToken,
});

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  showAlert: (text, onClick) => dispatch(showAlert(text, onClick)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FollowButton);
