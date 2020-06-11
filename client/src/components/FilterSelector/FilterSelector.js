import React, { useRef, useState, Fragment } from 'react';
import classNames from 'classnames';

import Loader from '../Loader/Loader';

const FilterSelector = ({ setFilter, filters, previewImage }) => {
  const filterSelectorRef = useRef();
  const [selectedFilter, setSelectedFilter] = useState('Normal');

  const handleClick = (name, filter) => {
    setSelectedFilter(name);
    setFilter(filter, name);
  };

  return (
    <ul ref={filterSelectorRef} className="filter-selector">
      {filters.length === 0 ? (
        <Loader />
      ) : (
        <Fragment>
          <li
            className={classNames({
              'filter-selector__item': true,
              'filter-selector__item--active font-bold':
                selectedFilter === 'Normal',
            })}
            onClick={() => handleClick('Normal', '')}
          >
            <span className="filter-selector__filter-name heading-5">
              Normal
            </span>
            <img src={previewImage} alt="Filter preview" />
          </li>
          {filters.map(({ name, filter }, idx) => (
            <li
              className={classNames({
                'filter-selector__item': true,
                'filter-selector__item--active font-bold':
                  selectedFilter === name,
              })}
              onClick={() => handleClick(name, filter)}
              key={idx}
            >
              <span className="filter-selector__filter-name heading-5">
                {name}
              </span>
              <img src={previewImage} style={{ filter }} alt="Filter preview" />
            </li>
          ))}
        </Fragment>
      )}
    </ul>
  );
};

export default FilterSelector;
