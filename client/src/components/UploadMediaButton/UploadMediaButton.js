import React, { useState, Fragment } from 'react';

import UploadMediaForm from '../UploadMediaForm/UploadMediaForm';
import Modal from '../Modal/Modal';
const UploadMediaButton = () => {
  const [file, setFile] = useState(undefined);

  return (
    <Fragment>
      <label
        style={{ cursor: 'pointer' }}
        className="icon"
        htmlFor="file-upload"
      >
        <ion-icon name="cloud-upload-outline"></ion-icon>
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
        <Modal hide={() => setFile(undefined)}>
          <UploadMediaForm file={file} hideForm={() => setFile(undefined)} />
        </Modal>
      )}
    </Fragment>
  );
};

export default UploadMediaButton;
