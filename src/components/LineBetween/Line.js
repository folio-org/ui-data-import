import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import { getElement } from './utils';

export const Line = ({
  x0,
  y0,
  x1,
  y1,
  container = document.body,
  className,
  borderWidth = 1,
  borderStyle = 'solid',
  borderColor = 'gray',
  zIndex = 1,
}) => {
  const target = getElement(container);

  const dy = y1 - y0;
  const dx = x1 - x0;

  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const length = Math.sqrt(dx * dx + dy * dy);

  const style = {
    borderTopColor: borderColor,
    borderTopStyle: borderStyle,
    borderTopWidth: borderWidth,
    position: 'absolute',
    top: `${y0}px`,
    left: `${x0}px`,
    width: `${length}px`,
    zIndex,
    transform: `rotate(${angle}deg)`,
    transformOrigin: '0 0',
  };

  return createPortal(
    <div
      className={className}
      style={style}
    />,
    target,
  );
};

Line.propTypes = {
  x0: PropTypes.number.isRequired,
  y0: PropTypes.number.isRequired,
  x1: PropTypes.number.isRequired,
  y1: PropTypes.number.isRequired,
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Element)]).isRequired, // CSS Selector or Element
  borderColor: PropTypes.string,
  borderStyle: PropTypes.string,
  borderWidth: PropTypes.number,
  className: PropTypes.string,
  zIndex: PropTypes.number,
};
