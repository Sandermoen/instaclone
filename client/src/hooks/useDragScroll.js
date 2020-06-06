import { useEffect } from 'react';

let isDown = false;
let startX = 0;
let scrollLeft = 0;

const useDragScroll = (elementRef) => {
  useEffect(() => {
    let mouseDownEvent = null;
    let mouseLeaveEvent = null;
    let mouseUpEvent = null;
    let mouseMoveEvent = null;
    const element = elementRef.current;
    if (elementRef.current) {
      const down = (event) => {
        event.preventDefault();
        isDown = true;
        startX = event.pageX - elementRef.current.offsetLeft;
        scrollLeft = elementRef.current.scrollLeft;
      };
      const leave = () => (isDown = false);
      const move = (event) => {
        if (!isDown) return;
        event.preventDefault();
        const x = event.pageX - elementRef.current.offsetLeft;
        const walk = x - startX;
        elementRef.current.scrollLeft = scrollLeft - walk;
      };

      mouseDownEvent = elementRef.current.addEventListener(
        'mousedown',
        (event) => down(event)
      );
      mouseLeaveEvent = elementRef.current.addEventListener('mouseleave', () =>
        leave()
      );
      mouseUpEvent = elementRef.current.addEventListener('mouseup', () =>
        leave()
      );
      mouseMoveEvent = elementRef.current.addEventListener(
        'mousemove',
        (event) => move(event)
      );
    }
    return () => {
      if (element) {
        // Remove event listeners
        element.removeEventListener('mousedown', mouseDownEvent);
        element.removeEventListener('mouseleave', mouseLeaveEvent);
        element.removeEventListener('mouseup', mouseUpEvent);
        element.removeEventListener('mousemove', mouseMoveEvent);
      }
    };
  }, [elementRef]);
};

export default useDragScroll;
