import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { useTransition } from 'react-spring';

import Icon from '../Icon';

const PulsatingIcon = ({
  toggle,
  constantProps = {},
  toggledProps,
  elementRef
}) => {
  const transitions = useTransition(toggle, null, {
    from: { transform: 'scale(1.3)' },
    enter: { transform: 'scale(1)' },
    leave: { display: 'none' },
    config: {
      mass: 1,
      tension: 500,
      friction: 20
    },
    // Prevent animating on initial render
    immediate: !elementRef.current
  });

  return (
    <Fragment>
      {transitions.map(({ item, key, props }) =>
        item ? (
          <Icon
            {...constantProps}
            {...toggledProps[0]}
            style={props}
            key={key}
          />
        ) : (
          <Icon
            {...constantProps}
            {...toggledProps[1]}
            style={props}
            key={key}
          />
        )
      )}
    </Fragment>
  );
};

PulsatingIcon.propTypes = {
  toggle: PropTypes.bool.isRequired,
  constantProps: PropTypes.object,
  toggledProps: PropTypes.arrayOf(PropTypes.object).isRequired,
  elementRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    .isRequired
};

export default PulsatingIcon;
