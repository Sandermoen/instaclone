import React, { useState, Fragment } from 'react';

import UploadMediaForm from '../UploadMediaForm/UploadMediaForm';
import Modal from '../Modal/Modal';
import Icon from '../Icon/Icon';

const UploadMediaButton = () => {
  const [file, setFile] = useState(undefined);

  return (
    <Fragment>
      <label
        style={{ cursor: 'pointer' }}
        className="icon"
        htmlFor="file-upload"
      >
        <Icon icon="cloud-upload-outline" />
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
