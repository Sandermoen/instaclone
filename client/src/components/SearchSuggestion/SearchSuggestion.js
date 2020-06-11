import React, { useState, useRef, useEffect } from 'react';

import useScrollPositionThrottled from '../../hooks/useScrollPositionThrottled';

import { searchUsers } from '../../services/userService';

import UsersListSkeleton from '../UsersList/UsersListSkeleton/UsersListSkeleton';
import UserCard from '../UserCard/UserCard';

const SearchSuggestion = ({ fetching, result, onClick, username }) => {
  const [additionalUsers, setAdditionalUsers] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [fetchingAdditionalUsers, setFetchingAdditionalUsers] = useState(false);
  const componentRef = useRef();
  const offset = 10;

  useEffect(() => {
    if (result.length === offset && !shouldFetch) setShouldFetch(true);
  }, [result, shouldFetch]);

  useScrollPositionThrottled(
    async ({ atBottom }) => {
      if (atBottom && shouldFetch && !fetching && !fetchingAdditionalUsers) {
        try {
          setFetchingAdditionalUsers(true);
          const users = await searchUsers(
            username,
            result.length + additionalUsers.length
          );
          // Returned less than the max users meaning there are no more users to fetch
          if (users.length !== offset) setShouldFetch(false);
          setAdditionalUsers((previous) => [...previous, ...users]);
          setFetchingAdditionalUsers(false);
        } catch (err) {
          setFetchingAdditionalUsers(false);
          setShouldFetch(false);
        }
      }
    },
    componentRef.current,
    [shouldFetch, fetching, fetchingAdditionalUsers]
  );

  const renderUserCard = (user, idx) => (
    <li key={idx}>
      <UserCard
        username={user.username}
        avatar={user.avatar}
        subText={user.fullName}
        onClick={() => onClick(user)}
      />
    </li>
  );

  return (
    <ul ref={componentRef} className="search-suggestion">
      {fetching ? (
        <UsersListSkeleton />
      ) : (
        result.map((user, idx) => renderUserCard(user, idx))
      )}
      {fetchingAdditionalUsers ? (
        <UsersListSkeleton />
      ) : (
        additionalUsers.map((user, idx) => renderUserCard(user, idx))
      )}
    </ul>
  );
};

export default SearchSuggestion;
