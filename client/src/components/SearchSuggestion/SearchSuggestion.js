import React from 'react';

import UsersListSkeleton from '../UsersList/UsersListSkeleton/UsersListSkeleton';
import UserCard from '../UserCard/UserCard';

const SearchSuggestion = ({ fetching, result, onClick }) => (
  <ul className="search-suggestion">
    {fetching ? (
      <UsersListSkeleton />
    ) : (
      result.map((user, idx) => (
        <li key={idx}>
          <UserCard
            username={user.username}
            avatar={user.avatar}
            name={user.name}
            onClick={() => onClick(user)}
          />
        </li>
      ))
    )}
  </ul>
);

export default SearchSuggestion;
