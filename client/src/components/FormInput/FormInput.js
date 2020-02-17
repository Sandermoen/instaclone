import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FormInput = ({ placeholder, type, onChange, required, style, id }) => {
  const [inputType, setInputType] = useState('password');

  const handleClick = () => {
    inputType === 'password' ? setInputType('text') : setInputType('password');
  };

  return (
    <div
      style={{ ...style }}
      id={id}
      data-test="component-input"
      className="form-group"
    >
      <input
        className="form-group__input"
        type={type === 'password' ? inputType : type}
        id="form-input"
        placeholder={placeholder}
        onChange={onChange}
        required={required}
      />
      <span className="form-group__placeholder">{placeholder}</span>
      {type === 'password' && (
        <span onClick={() => handleClick()} className="form-group__toggle">
          {inputType === 'password' ? 'Show' : 'Hide'}
        </span>
      )}
    </div>
  );
};

FormInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

export default FormInput;
