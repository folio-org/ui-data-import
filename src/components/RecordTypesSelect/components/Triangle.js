import React, { memo } from 'react';

import css from '../RecordTypesSelect.css';

const TRIANGLE_DIRECTION = {
  left: 'rotate(180deg)',
  right: 'rotate(0)',
  top: 'rotate(-90deg)',
  bottom: 'rotate(90deg)',
};

export const Triangle = memo(({
  size = 8,
  color = '#b2b2b2',
  direction = 'right',
  style,
}) => (
  <div
    className={css.triangle}
    style={{
      transform: TRIANGLE_DIRECTION[direction],
      borderTop: `${size}px solid transparent`,
      borderLeft: `${size}px solid ${color}`,
      borderBottom: `${size}px solid transparent`,
      ...style,
    }}
  />
));
