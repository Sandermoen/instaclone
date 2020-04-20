import React, { useEffect, useReducer, useRef } from 'react';

import {
  retrieveUserFollowing,
  retrieveUserFollowers,
} from '../../services/profileService';

import useScrollPositionThrottled from '../../hooks/useScrollPositionThrottled';

import { usersListReducer, INITIAL_STATE } from './usersListReducer';

import UserCard from '../UserCard/UserCard';
import UsersListSkeleton from './UsersListSkeleton/UsersListSkeleton';

const UsersList = ({
  userId,
  token,
  followingCount,
  followersCount,
  following,
}) => {
  const [state, dispatch] = useReducer(usersListReducer, INITIAL_STATE);
  const componentRef = useRef();

  useEffect(() => {
    (async function () {
      try {
        dispatch({ type: 'FETCH_START' });
        const response = following
          ? await retrieveUserFollowing(
              userId,
              state.data ? state.data.length : 0,
              token
            )
          : await retrieveUserFollowers(
              userId,
              state.data ? state.data.length : 0,
              token
            );
        dispatch({ type: 'FETCH_SUCCESS', payload: response });
      } catch (err) {
        dispatch({ type: 'FETCH_FAILURE', payload: err });
      }
    })();
  }, [userId, token]);

  useScrollPositionThrottled(async ({ atBottom }) => {
    if (
      atBottom && following
        ? state.data.length < followingCount
        : state.data.length < followersCount &&
          !state.fetching &&
          !state.fetchingAdditional
    ) {
      try {
        dispatch({ type: 'FETCH_ADDITIONAL_START' });
        const response = await retrieveUserFollowing(
          userId,
          state.data.length,
          token
        );
        dispatch({ type: 'ADD_USERS', payload: response });
      } catch (err) {
        dispatch({ type: 'FETCH_FAILURE', payload: err });
      }
    }
  }, componentRef.current);

  return (
    <section
      className="following-overview"
      ref={componentRef}
      style={{ overflowY: 'auto' }}
    >
      {state.fetching ? (
        <UsersListSkeleton />
      ) : (
        state.data.map((user, idx) => (
          <UserCard
            key={idx}
            avatar={user.avatar}
            username={user.username}
            userId={user._id}
            following={user.isFollowing}
            token={token}
            followButton
          />
        ))
      )}
      {state.fetchingAdditional && <UsersListSkeleton />}
    </section>
  );
};

export default UsersList;
