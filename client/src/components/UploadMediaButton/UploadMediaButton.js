import React, { useState, Fragment } from 'react';

import UploadMediaForm from '../UploadMediaForm/UploadMediaForm';
import Modal from '../Modal/Modal';
import sprite from '../../assets/svg/svg-sprites.svg';

const UploadMediaButton = () => {
  const [file, setFile] = useState(undefined);

  return (
    <Fragment>
      <label htmlFor="file-upload">
        <svg>
          <use href={sprite + '#icon-upload'} />
        </svg>
      </label>
      <input
        id="file-upload"
        type="file"
        style={{ display: 'none' }}
        accept="image/*"
        // Get the first selected file
        onChange={event => setFile(event.target.files[0])}
      />
      {file && (
        <Modal>
          <UploadMediaForm file={file} />
        </Modal>
      )}
    </Fragment>
  );
};

export default UploadMediaButton;
