import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

import { searchUsers } from '../services/userService';

/**
 * A memoized debounced hook to search for users with a given offset
 * @function useSearchUsersDebounced
 * @returns {object} Search function and search result
 */
const useSearchUsersDebounced = () => {
  const [result, setResult] = useState([]);
  const [fetching, setFetching] = useState(false);

  const handleSearch = async (string, offset) => {
    if (!string) {
      setFetching(false);
      return setResult([]);
    }

    try {
      const response = await searchUsers(string, offset);
      setResult(response ? response : []);
      setFetching(false);
    } catch (err) {
      setFetching(false);
      throw new Error(err);
    }
  };
  const handleSearchDebounced = debounce(handleSearch, 500);
  const handleSearchDebouncedMemoized = useCallback(
    (string, offset) => handleSearchDebounced(string, offset),
    []
  );
  return {
    handleSearchDebouncedMemoized,
    result,
    setResult,
    fetching,
    setFetching,
  };
};

export default useSearchUsersDebounced;
