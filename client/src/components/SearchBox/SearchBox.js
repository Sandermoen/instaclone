import React from 'react';

import sprite from '../../assets/svg/svg-sprites.svg';

const SearchBox = () => {
  return (
    <form className="search-box">
      <input className="search-box__input" placeholder="Search" />
      <span className="search-box__placeholder">
        <svg>
          <use href={sprite + '#icon-magnifying-glass'} />
        </svg>
        Search
      </span>
    </form>
  );
};

export default SearchBox;
