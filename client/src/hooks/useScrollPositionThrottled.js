import { useState, useEffect } from 'react';
import throttle from 'lodash/throttle';

/**
 * A throttled hook to execute a function upon scroll
 * @function useScrollPositionThrottled
 * @param {function} callback Callback function to call when a user scrolls
 */
const useScrollPositionThrottled = (callback) => {
  const [, setScrollPosition] = useState(0);
  let previousScrollPosition = 0;

  const handleScroll = () => {
    const { scrollTop: currentScrollPosition } =
      document.documentElement || document.body;

    setScrollPosition((previousPosition) => {
      previousScrollPosition = previousPosition;
      return currentScrollPosition;
    });
    callback({ previousScrollPosition, currentScrollPosition });
  };

  // Throttle the function to improve performance
  const handleScrollThrottled = throttle(handleScroll, 250);
  useEffect(() => {
    window.addEventListener('scroll', handleScrollThrottled);

    return () => {
      window.removeEventListener('scroll', handleScrollThrottled);
    };
  }, [handleScrollThrottled]);
};

export default useScrollPositionThrottled;
