import React from 'react';
import { render } from '@testing-library/react';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import ResizeObserver from '../../utils/resizeObserver';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

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
};
const oneTreeLine = {
  from: '[data-id=HOLDINGS]',
  to: '[data-id=INSTANCE]',
  container: '#test',
  fromAnchor: 'left',
  toAnchor: 'left',
  fromAnchorOffset: '10px 10px',
  toAnchorOffset: '10px 10px',
};
const treeLineWithoutContainer = {
  from: '[data-id=HOLDINGS]',
  to: '[data-id=INSTANCE]',
  container: null,
  fromAnchor: '12px 12px',
  toAnchor: '13px 13px',
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
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('TreeLine', () => {
  it('should be rendered inside container', () => {
    window.ResizeObserver = ResizeObserver;
    const { container } = render(parentContainer);

    renderTreeLine(treeLineWithContainer);
    const line = container.children[0].children.length;

    expect(line).toBeGreaterThan(2);
  });

  it('should be rendered inside document.body', () => {
    const { container } = renderTreeLine(treeLineWithoutContainer);
    const line = container.children;

    expect(line).toBeDefined();
  });

  it('should be rendered vertically', () => {
    const { container } = render(parentContainer);

    renderTreeLine(treeLineVertical);
    const line = container.children[0].children.length;

    expect(line).toBeGreaterThan(2);
  });

  it('should be rendered horizontally', () => {
    const { container } = render(parentContainer);

    renderTreeLine(treeLineHorizontal);
    const line = container.children[0].children.length;

    expect(line).toBeGreaterThan(2);
  });

  it('should be rendered one line', () => {
    const { container } = render(parentContainer);

    renderTreeLine(oneTreeLine);
    const line = container.children[0].children.length;

    expect(line).toBeGreaterThan(2);
  });
});
