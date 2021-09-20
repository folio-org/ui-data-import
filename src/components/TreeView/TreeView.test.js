import React from 'react';

import {
  render, screen,
} from '@testing-library/react';

import '../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '../ListTemplate';

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

const renderTreeView = ({
  data,
  indentation,
  spacing,
  isLocalLTR,
  className,
  renderItem,
}) => {
  const component = (
    <TreeView
      data={data}
      indentation={indentation}
      spacing={spacing}
      isLocalLTR={isLocalLTR}
      className={className}
      renderItem={renderItem}
    />
  );

  return render(component);
};

describe('Tree View component', () => {
  it('Should be rendered', () => {
    expect(renderTreeView({
      data: recordsData,
      className: css.treeViewLTR,
    })).toBeDefined();
  });
});

describe('When meta data is passed it', () => {
  it('should have a length of 3', () => {
    const { debug } = renderTreeView({
      data: recordsData,
      indentation: 40,
      spacing: '1rem',
      isLocalLTR: false,
      className: css.treeViewRTL,
      renderItem: renderItemData,
    });

    debug();
    const listItems = screen.getAllByRole('list');

    expect(listItems.length).toBe(3);
  });
  it('should contain the required fields', () => {
    const { getByText } = renderTreeView({
      data: recordsData,
      indentation: 40,
      spacing: '1rem',
      isLocalLTR: false,
      className: css.treeViewRTL,
      renderItem: renderItemData,
    });

    expect(getByText('MARC_AUTHORITY')).toBeDefined();
    expect(getByText('MARC_BIBLIOGRAPHIC')).toBeDefined();
    expect(getByText('MARC_HOLDINGS')).toBeDefined();
  });
});
