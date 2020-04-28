import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

const FormInput = ({
  placeholder,
  type,
  onChange,
  required,
  style,
  name,
  fieldProps,
  valid,
}) => {
  const [inputType, setInputType] = useState('password');
  const handleClick = () => {
    inputType === 'password' ? setInputType('text') : setInputType('password');
  };

  return (
    <div
      style={{ ...style }}
      data-test="component-input"
      className="form-group"
    >
      <input
        name={name}
        className="form-group__input"
        type={type === 'password' ? inputType : type}
        id="form-input"
        placeholder={placeholder}
        onChange={onChange}
        required={required}
        {...fieldProps}
      />
      <span className="form-group__placeholder">{placeholder}</span>
      <div className="input-icons">
        {typeof valid === 'boolean' ? (
          valid ? (
            <Icon className="color-grey" icon="checkmark-circle-outline" />
          ) : (
            <Icon className="color-red" icon="close-circle-outline" />
          )
        ) : null}
        {type === 'password' && (
          <span onClick={() => handleClick()} className="form-group__toggle">
            {inputType === 'password' ? 'Show' : 'Hide'}
          </span>
        )}
      </div>
    </div>
  );
};

FormInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func,
};

export default FormInput;
