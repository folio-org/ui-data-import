import React from 'react';
import { render } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../test/jest/__mock__';

import { Line } from './Line';

const lineWithParentContainer = {
  x0: 0,
  y0: 0,
  x1: 0,
  y1: 10,
  container: '.testClassName',
  className: 'tester',
  borderWidth: 2,
  borderStyle: 'solid',
  borderColor: '#000',
  zIndex: 2,
};

const renderLine = ({
  x0,
  y0,
  x1,
  y1,
  container,
  className,
  borderWidth,
  borderStyle,
  borderColor,
  zIndex,
}) => {
  const component = (
    <Line
      x0={x0}
      y0={y0}
      x1={x1}
      y1={y1}
      container={container}
      className={className}
      borderWidth={borderWidth}
      borderStyle={borderStyle}
      borderColor={borderColor}
      zIndex={zIndex}
    />
  );

  return render(component);
};

describe('Line component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderLine(lineWithParentContainer);

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered in parent element', () => {
    const { container } = renderLine(lineWithParentContainer);
    const line = container.querySelector('.tester');

    expect(line).toBeDefined();
  });
});
