import React, { useState, Fragment, useEffect } from 'react';
import { connect } from 'react-redux';

import { showModal } from '../../redux/modal/modalActions';

import Icon from '../Icon/Icon';

const UploadMediaButton = ({ showModal }) => {
  const [file, setFile] = useState(undefined);
  useEffect(() => {
    if (file) {
      showModal(
        { file, hideForm: () => setFile(undefined) },
        'UploadMediaForm'
      );
    }
  }, [file, showModal]);
  return (
    <Fragment>
      <label
        style={{ cursor: 'pointer' }}
        className="icon"
        htmlFor="file-upload"
      >
        <Icon icon="image-outline" />
      </label>
      <input
        id="file-upload"
        type="file"
        style={{ display: 'none' }}
        accept="image/*"
        // Get the first selected file
        onChange={(event) => setFile(event.target.files[0])}
      />
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
});

export default connect(null, mapDispatchToProps)(UploadMediaButton);
