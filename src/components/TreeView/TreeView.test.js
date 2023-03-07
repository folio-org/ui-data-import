import React from 'react';
import { screen } from '@testing-library/react';
import { axe } from 'jest-axe';

import '../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import { translationsProperties } from '../../../test/jest/helpers';

import css from '../RecordTypesSelect/RecordTypesSelect.css';

import { TreeView } from './TreeView';

const recordsData = {
  children: [
    {
      itemMeta: FOLIO_RECORD_TYPES.INSTANCE,
      children: [
        {
          itemMeta: FOLIO_RECORD_TYPES.HOLDINGS,
          children: [{ itemMeta: FOLIO_RECORD_TYPES.ITEM }],
        },
        { itemMeta: FOLIO_RECORD_TYPES.MARC_HOLDINGS },
      ],
    },
    { itemMeta: FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC },
    {
      itemMeta: {
        ...FOLIO_RECORD_TYPES.ORDER,
        captionId: 'ui-data-import.recordTypes.orderLine',
      },
    },
    { itemMeta: FOLIO_RECORD_TYPES.INVOICE },
    { itemMeta: FOLIO_RECORD_TYPES.MARC_AUTHORITY },
  ],
  connections: [],
};

const renderItemData = item => { return <div>{item.itemMeta.type}</div>; };

const mockProps = {
  data: recordsData,
  indentation: 40,
  spacing: '1rem',
  isLocalLTR: false,
  className: css.treeViewRTL,
  renderItem: renderItemData,
};

const mockSpacingProps = {
  data: recordsData,
  className: css.treeViewLTR,
};

const renderTreeView = treeViewProps => {
  const component = (
    <TreeView
      data={treeViewProps.data}
      indentation={treeViewProps.indentation}
      spacing={treeViewProps.spacing}
      isLocalLTR={treeViewProps.isLocalLTR}
      className={treeViewProps.className}
      renderItem={treeViewProps.renderItem}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Tree View component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderTreeView(mockSpacingProps);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('Should be rendered', () => {
    expect(renderTreeView(mockSpacingProps)).toBeDefined();
  });
});

describe('When meta data is passed it', () => {
  it('should have a length of 3', () => {
    renderTreeView(mockProps);
    const listItems = screen.getAllByRole('list');

    expect(listItems.length).toBe(3);
  });
  it('should contain the required fields', () => {
    const { getByText } = renderTreeView(mockProps);

    expect(getByText('MARC_AUTHORITY')).toBeDefined();
    expect(getByText('MARC_BIBLIOGRAPHIC')).toBeDefined();
    expect(getByText('MARC_HOLDINGS')).toBeDefined();
  });
});
