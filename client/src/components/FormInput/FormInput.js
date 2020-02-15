import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({ placeholder, type, onChange, required }) => (
  <div data-test="component-input" className="form-group">
    <input
      className="form-input"
      type={type}
      id="form-input"
      placeholder={placeholder}
      onChange={onChange}
      required={required}
    />
  </div>
);

FormInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default FormInput;
