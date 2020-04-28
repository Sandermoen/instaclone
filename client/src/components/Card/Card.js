import React from 'react';
import classNames from 'classnames';

const Card = ({ className, style, children }) => {
  const cardClassNames = classNames({
    card: true,
    [className]: className,
  });

  return (
    <div className={cardClassNames} style={style}>
      {children}
    </div>
  );
};

export default Card;
