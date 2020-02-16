import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({ placeholder, type, onChange, required, id }) => (
  <div data-test="component-input" className="form-group">
    <input
      className="form-group__input"
      type={type}
      id="form-input"
      placeholder={placeholder}
      onChange={onChange}
      required={required}
    />
    <span className="form-group__placeholder">{placeholder}</span>
  </div>
);

FormInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default FormInput;
