import React from 'react';

import Icon from '../Icon/Icon';

const SearchBox = () => {
  return (
    <form className="search-box">
      <input className="search-box__input" placeholder="Search" />
      <span className="search-box__placeholder">
        <div className="icon icon--tiny icon--grey-1">
          <Icon icon="search" />
        </div>
        Search
      </span>
    </form>
  );
};

export default SearchBox;
