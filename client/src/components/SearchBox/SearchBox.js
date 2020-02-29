import React from 'react';

const SearchBox = () => {
  return (
    <form className="search-box">
      <input className="search-box__input" placeholder="Search" />
      <span className="search-box__placeholder">
        <div className="icon icon--tiny icon--grey-1">
          <ion-icon name="search"></ion-icon>
        </div>
        Search
      </span>
    </form>
  );
};

export default SearchBox;
