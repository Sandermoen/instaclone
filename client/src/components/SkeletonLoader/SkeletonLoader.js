import React from 'react';
import PropTypes from 'prop-types';

const SkeletonLoader = ({ style, animated }) => {
  return animated ? (
    <div style={style} className="skeleton-loader--animated"></div>
  ) : (
    <div style={style} className="skeleton-loader"></div>
  );
};

SkeletonLoader.propTypes = {
  style: PropTypes.object,
};

export default SkeletonLoader;
