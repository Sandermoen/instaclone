import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

const FormInput = ({
  type,
  style,
  valid,
  placeholder,
  fieldProps,
  ...additionalProps
}) => {
  const [inputType, setInputType] = useState('password');
  const handleClick = () => {
    inputType === 'password' ? setInputType('text') : setInputType('password');
  };

  return (
    <div
      style={{ ...style, marginBottom: !placeholder ? '0' : '0.5rem' }}
      data-test="component-input"
      className="form-group"
    >
      <input
        className="form-group__input"
        type={type === 'password' ? inputType : type}
        placeholder={placeholder}
        style={!placeholder ? { padding: '1rem' } : {}}
        {...fieldProps}
        {...additionalProps}
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
  placeholder: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func,
};

export default FormInput;
