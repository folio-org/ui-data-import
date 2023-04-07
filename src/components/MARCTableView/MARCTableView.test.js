import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { MARCTableView } from './MARCTableView';

const MARCTableViewProps = {
  columns: ['field', 'indicator1', 'indicator2', 'subfield'],
  fields: [{
    order: 0,
    field: {
      subfields: [{
        subfield: 'Test Subfield',
        data: {
          text: 'testText',
          find: 'testFind',
          replaceWith: 'testReplaceWith',
          marcField: {
            field: 'testField',
            indicator1: 'testIndicator1',
            indicator2: 'testIndicator2',
            subfields: [{ subfield: 'testSubfield' }],
          },
        },
        subaction: 'ADD_SUBFIELD',
        position: 'BEFORE_STRING',
      }, {
        subfield: 'Test Subfield',
        data: {
          text: 'testText2',
          find: 'testFind2',
          replaceWith: 'testReplaceWith2',
          marcField: {
            field: 'testField2',
            indicator1: 'testIndicator1_2',
            indicator2: 'testIndicator2_2',
            subfields: [{ subfield: 'testSubfield2' }],
          },
        },
        subaction: 'ADD_SUBFIELD',
        position: 'BEFORE_STRING',
      }],
      field: 'Test Field',
      indicator1: 'Test Indicator1',
      indicator2: 'Test Indicator2',
    },
    action: 'ADD',
  }],
  columnWidths: {
    action: '90px',
    field: '90px',
    indicator1: '63px',
    indicator2: '63px',
    subfield: '93px',
    subaction: '140px',
    data: '340px',
    position: '140px',
  },
};

const renderMARCTableView = ({
  fields,
  columns,
  columnWidths,
}) => {
  const component = (
    <MARCTableView
      fields={fields}
      columns={columns}
      columnWidths={columnWidths}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MARCTableView component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderMARCTableView(MARCTableViewProps);

    await runAxeTest({ rootNode: container });
  });

  it('MARC table header should be rendered', () => {
    const { getByText } = renderMARCTableView(MARCTableViewProps);

    expect(getByText('Field')).toBeDefined();
    expect(getByText('In.1')).toBeDefined();
    expect(getByText('In.2')).toBeDefined();
    expect(getByText('Subfield')).toBeDefined();
  });

  it('should be rendered with correct cells', () => {
    const { getAllByText } = renderMARCTableView(MARCTableViewProps);

    expect(getAllByText('Test Field')).toBeDefined();
    expect(getAllByText('Test Indicator1')).toBeDefined();
    expect(getAllByText('Test Indicator2')).toBeDefined();
    expect(getAllByText('Test Subfield')).toBeDefined();
  });
});
