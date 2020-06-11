import React, { Fragment } from 'react';

import FilterSelector from '../../FilterSelector/FilterSelector';
import SkeletonLoader from '../../SkeletonLoader/SkeletonLoader';

const NewPostFilter = ({ previewImage, setPreviewImage, filters }) => {
  return (
    <Fragment>
      <div className="new-post__preview">
        <div className="new-post__preview-image-container">
          {previewImage.src ? (
            <img
              src={previewImage.src}
              alt="Customize"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: previewImage.filter,
              }}
            />
          ) : (
            <SkeletonLoader />
          )}
        </div>
      </div>
      <FilterSelector
        setFilter={(filter, filterName) =>
          setPreviewImage((previous) => ({ ...previous, filter, filterName }))
        }
        previewImage={previewImage.src}
        filters={filters}
      />
    </Fragment>
  );
};

export default NewPostFilter;
