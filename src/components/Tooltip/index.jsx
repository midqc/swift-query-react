import React, { useState, useEffect, useRef } from 'react';

const Tooltip = ({ tooltipContent, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    setShowTooltip(true);
    clearTimeout(timeoutRef.current);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 0);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const getPositionStyle = (element) => {
    const elementRect = element.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    let top = elementRect.top - tooltipRect.height - 10;
    let left = elementRect.left + (elementRect.width / 2) - (tooltipRect.width / 2);
  
    // Check if the tooltip overflows the body
    const bodyRect = document.body.getBoundingClientRect();
    if (tooltipRect.bottom > bodyRect.bottom) {
      top = elementRect.top - tooltipRect.height - elementRect.height - 10;
    }
    if (tooltipRect.right > bodyRect.right) {
      left = elementRect.right - tooltipRect.width;
    }
    if (tooltipRect.left < bodyRect.left) {
      left = elementRect.left;
    }
  
    return { top, left };
  };
  
  

  const getOverflowStyle = (tooltipRect) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const overflowRight = tooltipRect.right - viewportWidth;
    const overflowLeft = -tooltipRect.left;
    const overflowBottom = tooltipRect.bottom - viewportHeight;
    const overflowTop = -tooltipRect.top;
    const overflowHorizontal = Math.max(overflowRight, overflowLeft);
    const overflowVertical = Math.max(overflowBottom, overflowTop);

    if (overflowVertical > 0 && overflowVertical > overflowHorizontal) {
      return { top: 'auto', bottom: '100%' };
    } else if (overflowHorizontal > 0) {
      return { left: 'auto', right: '0' };
    } else if (overflowVertical > 0) {
      return { top: '100%', bottom: 'auto' };
    } else {
      return {};
    }
  };

  const tooltipRef = useRef(null);
  const parentRef = useRef(null);

  useEffect(() => {
    if (showTooltip && tooltipRef.current && parentRef.current) {
      const positionStyle = getPositionStyle(parentRef.current);
      tooltipRef.current.style.top = `${positionStyle.top}px`;
      tooltipRef.current.style.left = `${positionStyle.left}px`;

      const overflowStyle = getOverflowStyle(tooltipRef.current.getBoundingClientRect());
      tooltipRef.current.style = {...tooltipRef.current.style, ...overflowStyle};
    }
  }, [showTooltip, parentRef, tooltipRef]);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position: 'relative' }}>
      {React.cloneElement(children, { ref: parentRef })}
      {showTooltip && (
        <div ref={tooltipRef} className="px-2 py-1 m-1 text-base select-none text-neutral-600 bg-neutral-200 dark:text-neutral-600 dark:bg-neutral-800 rounded-xl z-[9999] absolute" style={{ position: 'absolute' }}>
          {tooltipContent()}
        </div>
      )}
    </div>
  );
};

export default Tooltip;

// <Tooltip
// tooltipContent={() => (
//   <>
//     <h3>Dynamic content</h3>
//     <p>This is some dynamic content that changes based on the element that is being hovered over.</p>
//   </>
// )}
// >
// <button>Hover me</button>
// </Tooltip>