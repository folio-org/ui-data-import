import React from 'react';

import { render } from '@testing-library/react';

import '../../../test/jest/__mock__';

import { TreeLine } from './TreeLine';

const parentContainer = (
  <div
    id="test"
    className="tester"
  >
    <div data-id="HOLDINGS">testFrom</div>
    <div data-id="INSTANCE">testTo</div>
  </div>
);
const treeLineWithContainer = {
  from: '[data-id=HOLDINGS]',
  to: '[data-id=INSTANCE]',
  container: '#test',
  fromAnchor: '12px 12px',
  toAnchor: '13px 13px',
  isLocalLTR: false,
  orientation: 'horizontal',
  fromAnchorOffset: '10px 10px',
  toAnchorOffset: '13px 13px',
  className: 'test',
};
const treeLineHorizontal = {
  from: '[data-id=HOLDINGS]',
  to: '[data-id=INSTANCE]',
  container: '#test',
  fromAnchor: '12%',
  toAnchor: '13%',
  isLocalLTR: true,
  orientation: 'horizontal',
  fromAnchorOffset: '10px 10px',
  toAnchorOffset: '13px 13px',
  className: 'horizontal',
};
const treeLineVertical = {
  from: '[data-id=HOLDINGS]',
  to: '[data-id=INSTANCE]',
  container: '#test',
  fromAnchor: 'left',
  toAnchor: 'left',
  isLocalLTR: false,
  orientation: 'vertical',
  fromAnchorOffset: '10px 10px',
  toAnchorOffset: '13px 13px',
  className: 'vertical',
};
const oneTreeLine = {
  from: '[data-id=HOLDINGS]',
  to: '[data-id=INSTANCE]',
  container: '#test',
  fromAnchor: 'left',
  toAnchor: 'left',
  fromAnchorOffset: '10px 10px',
  toAnchorOffset: '10px 10px',
  className: 'one-line',
};
const treeLineWithoutContainer = {
  from: '[data-id=HOLDINGS]',
  to: '[data-id=INSTANCE]',
  container: null,
  fromAnchor: '12px 12px',
  toAnchor: '13px 13px',
  className: 'test',
};
const renderTreeLine = ({
  from,
  to,
  container,
  fromAnchor,
  toAnchor,
  isLocalLTR,
  orientation,
  fromAnchorOffset,
  toAnchorOffset,
  className,
}) => {
  const component = (
    <TreeLine
      from={from}
      to={to}
      container={container}
      fromAnchor={fromAnchor}
      toAnchor={toAnchor}
      isLocalLTR={isLocalLTR}
      orientation={orientation}
      fromAnchorOffset={fromAnchorOffset}
      toAnchorOffset={toAnchorOffset}
      className={className}
    />
  );

  return render(component);
};

window.ResizeObserver = jest.fn();
window.ResizeObserver.mockImplementation(() => {
  return {
    observe() {},
    unobserve() {},
  };
});

describe('TreeLine', () => {
  afterAll(() => {
    delete window.ResizeObserver;
  });

  it('should be rendered inside container', () => {
    const { container } = render(parentContainer);

    renderTreeLine(treeLineWithContainer);
    const element = container.querySelector('.test');

    expect(element).toBeDefined();
  });

  it('should be rendered inside document.body when container is not defined', () => {
    const { container } = renderTreeLine(treeLineWithoutContainer);
    const element = container.querySelector('.test');

    expect(element).toBeDefined();
  });

  it('should be rendered vertically', () => {
    const { container } = render(parentContainer);

    renderTreeLine(treeLineVertical);
    const element = container.querySelector('.vertical');

    expect(element).toBeDefined();
  });

  it('should be rendered horizontally', () => {
    const { container } = render(parentContainer);

    renderTreeLine(treeLineHorizontal);
    const element = container.querySelector('.horizontal');

    expect(element).toBeDefined();
  });

  it('should be rendered one line', () => {
    const { container } = render(parentContainer);

    renderTreeLine(oneTreeLine);
    const element = container.querySelector('.one-line');

    expect(element).toBeDefined();
  });
});
