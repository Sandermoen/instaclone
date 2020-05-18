import React from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated } from 'react-spring';
import classNames from 'classnames';

import TextButton from '../Button/TextButton/TextButton';

const OptionsDialog = ({
  hide,
  options,
  children,
  title,
  cancelButton = true,
}) => {
  const transitions = useTransition(true, null, {
    from: { transform: 'scale(1.2)', opacity: 0.5 },
    enter: { transform: 'scale(1)', opacity: 1 },
    leave: { opacity: 0 },
    config: {
      mass: 1,
      tension: 500,
      friction: 30,
    },
  });

  return transitions.map(({ item, key, props }) => (
    <animated.div style={props} key={key} className="options-dialog">
      {title && (
        <header className="options-dialog__title">
          <h1 className="heading-3">{title}</h1>
          {!cancelButton && (
            <TextButton style={{ fontSize: '3rem' }} onClick={() => hide()}>
              &#10005;
            </TextButton>
          )}
        </header>
      )}
      {children}
      {options.map((option, idx) => {
        const buttonClassNames = classNames({
          'options-dialog__button': true,
          'options-dialog__button--warning': option.warning,
          [option.className]: option.className,
        });
        return (
          <button
            onClick={(event) => {
              if (option.hasOwnProperty('onClick')) {
                event.stopPropagation();
                option.onClick();
                hide();
              }
            }}
            className={buttonClassNames}
            key={idx}
          >
            {option.text}
          </button>
        );
      })}
      {cancelButton && (
        <button
          className="options-dialog__button"
          onClick={(event) => {
            event.nativeEvent.stopImmediatePropagation();
            hide();
          }}
        >
          Cancel
        </button>
      )}
    </animated.div>
  ));
};

OptionsDialog.propTypes = {
  hide: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export default OptionsDialog;
