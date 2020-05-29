import React, { useState, Fragment, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { showModal, hideModal } from '../../../redux/modal/modalActions';

import Icon from '../../Icon/Icon';

const NewPostButton = ({ showModal, hideModal, plusIcon }) => {
  const [file, setFile] = useState(undefined);
  const fileInputRef = useRef();
  const history = useHistory();

  useEffect(() => {
    if (file) {
      if (window.outerWidth > 600) {
        showModal(
          { file, hide: () => hideModal('NewPost/NewPost') },
          'NewPost/NewPost'
        );
      } else {
        history.push('/new', { file });
      }
      // Resetting the input value so you are able to
      // use the same file twice
      fileInputRef.current.value = '';
    }
  }, [file, showModal]);
  return (
    <Fragment>
      <input
        id="file-upload"
        type="file"
        style={{ display: 'none' }}
        accept="image/*"
        // Get the first selected file
        onChange={(event) => setFile(event.target.files[0])}
        ref={fileInputRef}
      />
      <label
        style={{ cursor: 'pointer' }}
        className="icon"
        htmlFor="file-upload"
      >
        <Icon icon={plusIcon ? 'add-circle-outline' : 'camera-outline'} />
      </label>
    </Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  showModal: (props, component) => dispatch(showModal(props, component)),
  hideModal: (component) => dispatch(hideModal(component)),
});

export default connect(null, mapDispatchToProps)(NewPostButton);
