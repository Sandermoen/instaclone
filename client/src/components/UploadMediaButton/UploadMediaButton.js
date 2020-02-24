import React, { useState, Fragment } from 'react';

import UploadMediaForm from '../UploadMediaForm/UploadMediaForm';
import Modal from '../Modal/Modal';
import sprite from '../../assets/svg/svg-sprites.svg';

const UploadMediaButton = () => {
  const [file, setFile] = useState(undefined);

  return (
    <Fragment>
      <label className="icon" htmlFor="file-upload">
        <svg style={{ cursor: 'pointer' }}>
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
          <UploadMediaForm file={file} hideForm={() => setFile(undefined)} />
        </Modal>
      )}
    </Fragment>
  );
};

export default UploadMediaButton;
