import React, { useEffect, useReducer, useRef } from 'react';

import {
  retrieveUserFollowing,
  retrieveUserFollowers,
} from '../../services/profileService';

import useScrollPositionThrottled from '../../hooks/useScrollPositionThrottled';

import { usersListReducer, INITIAL_STATE } from './usersListReducer';

import UserCard from '../UserCard/UserCard';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';

const UsersList = ({
  userId,
  token,
  followingCount,
  followersCount,
  following,
  followers,
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

  useScrollPositionThrottled(async () => {
    if (
      componentRef.current.scrollTop + componentRef.current.offsetHeight ===
        componentRef.current.scrollHeight && following
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

  const renderSkeleton = () => {
    const skeleton = [];
    for (let i = 0; i < 3; i++) {
      skeleton.push(
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.5rem 1.5rem',
          }}
        >
          <SkeletonLoader
            style={{ width: '40px', height: '40px', borderRadius: '100px' }}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <SkeletonLoader
              style={{
                width: '10rem',
                height: '1rem',
                marginLeft: '1rem',
                marginBottom: '5px',
              }}
            />
            <SkeletonLoader
              style={{ width: '15rem', height: '1rem', marginLeft: '1rem' }}
            />
          </div>
        </div>
      );
    }
    return skeleton;
  };

  return (
    <section
      className="following-overview"
      ref={componentRef}
      style={{ overflowY: 'auto' }}
    >
      {state.fetching
        ? renderSkeleton()
        : state.data.map((user, idx) => (
            <UserCard
              key={idx}
              avatar={user.avatar}
              username={user.username}
              userId={user._id}
              following={user.isFollowing}
              token={token}
            />
          ))}
      {state.fetchingAdditional && renderSkeleton()}
    </section>
  );
};

export default UsersList;
