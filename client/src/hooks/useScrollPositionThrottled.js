import { useState, useEffect } from 'react';
import throttle from 'lodash/throttle';

/**
 * A throttled hook to execute a function upon scroll
 * @function useScrollPositionThrottled
 * @param {HTMLElement} element The element to calculate the scroll position, the default is document
 * @param {function} callback Callback function to call when a user scrolls
 */
const useScrollPositionThrottled = (callback, element) => {
  const [, setScrollPosition] = useState(0);
  let previousScrollPosition = 0;

  const handleScroll = () => {
    const { scrollTop: currentScrollPosition } = element
      ? element
      : document.documentElement || document.body;

    setScrollPosition((previousPosition) => {
      previousScrollPosition = previousPosition;
      return currentScrollPosition;
    });
    callback({ previousScrollPosition, currentScrollPosition });
  };

  // Throttle the function to improve performance
  const handleScrollThrottled = throttle(handleScroll, 250);
  useEffect(() => {
    element
      ? element.addEventListener('scroll', handleScrollThrottled)
      : window.addEventListener('scroll', handleScrollThrottled);

    return () => {
      element
        ? element.removeEventListener('scroll', handleScrollThrottled)
        : window.removeEventListener('scroll', handleScrollThrottled);
    };
  }, [handleScrollThrottled]);
};

export default useScrollPositionThrottled;
