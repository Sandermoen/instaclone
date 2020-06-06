import React, { useEffect } from 'react';
import classNames from 'classnames';

import Card from '../Card/Card';

const PopupCard = ({ children, hide, leftAlign }) => {
  useEffect(() => {
    if (hide) {
      window.addEventListener('click', hide);
    }

    return () => {
      window.removeEventListener('click', hide);
    };
  }, [hide]);

  return (
    <Card
      className={classNames({
        'popup-card': true,
        'popup-card--left-align': leftAlign,
      })}
    >
      <ul
        style={{
          listStyleType: 'none',
          maxHeight: '30rem',
          overflowY: 'auto',
          backgroundColor: 'white',
        }}
        // Prevent hiding the component when clicking inside the component
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </ul>
    </Card>
  );
};

export default PopupCard;
