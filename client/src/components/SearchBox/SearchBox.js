import React, { Fragment, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import useSearchUsersDebounced from '../../hooks/useSearchUsersDebounced';

import Icon from '../Icon/Icon';
import PopupCard from '../PopupCard/PopupCard';
import UserCard from '../UserCard/UserCard';
import Divider from '../Divider/Divider';
import Loader from '../Loader/Loader';

const SearchBox = ({ style, setResult, onClick }) => {
  const [query, setQuery] = useState('');
  const {
    handleSearchDebouncedRef,
    result,
    fetching,
    setFetching,
  } = useSearchUsersDebounced();
  const history = useHistory();

  useEffect(() => {
    if (result.length > 0 && setResult) {
      setResult(result);
    }
  }, [result, setResult]);

  return (
    <Fragment>
      <form
        className="search-box"
        style={style}
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          onChange={(event) => {
            handleSearchDebouncedRef(event.target.value);
            setQuery(event.target.value);
            event.target.value && setFetching(true);
          }}
          onClick={onClick}
          value={query}
          className="search-box__input"
          placeholder="Search"
        />
        <span className="search-box__placeholder">
          <Icon icon="search" className="icon--tiny color-grey" />
          {fetching && <Loader />}
        </span>
      </form>
      {query && !fetching && !setResult && (
        <PopupCard hide={() => setQuery('')}>
          {result.length === 0 && !fetching ? (
            <h3
              style={{ padding: '1rem 0' }}
              className="heading-3 color-grey font-medium text-center"
            >
              No results found.
            </h3>
          ) : (
            result &&
            result.map((user, idx) => (
              <Fragment key={idx}>
                <UserCard
                  avatar={user.avatar}
                  username={user.username}
                  subText={user.fullName}
                  style={{ padding: '1.5rem 1.5rem' }}
                  onClick={() => {
                    history.push(`/${user.username}`);
                    setQuery('');
                  }}
                />
                {result.length !== idx + 1 && <Divider />}
              </Fragment>
            ))
          )}
        </PopupCard>
      )}
    </Fragment>
  );
};

export default SearchBox;
