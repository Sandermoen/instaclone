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
  const currentElement = element
    ? element
    : document.documentElement || document.body;

  /**
   * Handles determining positional values when scrolling
   * @function handleScroll
   * @returns {object} Object with information about the current and previous scroll position
   */
  const handleScroll = () => {
    const { scrollTop: currentScrollPosition } = currentElement;

    setScrollPosition((previousPosition) => {
      previousScrollPosition = previousPosition;
      return currentScrollPosition;
    });
    callback({
      previousScrollPosition,
      currentScrollPosition,
      atBottom:
        currentElement.scrollTop + currentElement.offsetHeight ===
        currentElement.scrollHeight,
    });
  };

  // Throttle the function to improve performance
  const handleScrollThrottled = throttle(handleScroll, 20000);
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
