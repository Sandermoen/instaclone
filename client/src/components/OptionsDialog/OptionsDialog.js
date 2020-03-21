import React from 'react';
import PropTypes from 'prop-types';
import { useTransition, animated } from 'react-spring';
import classNames from 'classnames';

const OptionsDialog = ({ hide, options }) => {
  const transitions = useTransition(true, null, {
    from: { transform: 'scale(1.1)', opacity: 0.5 },
    enter: { transform: 'scale(1)', opacity: 1 },
    leave: { opacity: 0 }
  });

  return transitions.map(({ item, key, props }) => (
    <animated.div style={props} className="options-dialog">
      {options.map((option, idx) => {
        const buttonClassNames = classNames({
          'options-dialog__button': true,
          'options-dialog__button--warning': option.warning
        });
        return (
          <button
            onClick={() => {
              if (option.hasOwnProperty('onClick')) {
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
      <button
        className="options-dialog__button"
        onClick={event => {
          event.nativeEvent.stopImmediatePropagation();
          hide();
        }}
      >
        Cancel
      </button>
    </animated.div>
  ));
};

OptionsDialog.propTypes = {
  hide: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired
};

export default OptionsDialog;
