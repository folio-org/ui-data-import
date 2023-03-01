import React from 'react';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { MARCTableViewRowContainer } from './MARCTableViewRowContainer';

expect.extend(toHaveNoViolations);

const MARCTableViewRowContainerProps = {
  columns: ['field', 'indicator1', 'indicator2', 'subfield'],
  fields: [{
    order: 0,
    field: {
      subfields: [{
        subfield: 'Subfield',
        data: {
          text: 'testText',
          find: 'testFind',
          replaceWith: 'testReplaceWith',
          marcField: {
            field: 'testField1',
            indicator1: 'testIndicator1',
            indicator2: 'testIndicator2',
            subfields: [{ subfield: 'testSubfield' }],
          },
        },
        subaction: 'ADD_SUBFIELD',
        position: 'BEFORE_STRING',
      }, {
        subfield: 'Subfield',
        data: {
          text: 'testText2',
          find: 'testFind2',
          replaceWith: 'testReplaceWith2',
          marcField: {
            field: 'testField1_2',
            indicator1: 'testIndicator1_2',
            indicator2: 'testIndicator2_2',
            subfields: [{ subfield: 'testSubfield2_2' }],
          },
        },
        subaction: 'ADD_SUBFIELD',
        position: 'BEFORE_STRING',
      }],
      field: 'Field',
      indicator1: 'Indicator1',
      indicator2: 'Indicator2',
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

const renderMARCTableViewRowContainer = ({
  columns,
  fields,
  columnWidths,
}) => {
  const component = (
    <MARCTableViewRowContainer
      columns={columns}
      fields={fields}
      columnWidths={columnWidths}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MARCTableViewRowContainer', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderMARCTableViewRowContainer(MARCTableViewRowContainerProps);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should be rendered with correct cells', () => {
    const { getAllByText } = renderMARCTableViewRowContainer(MARCTableViewRowContainerProps);

    expect(getAllByText('Field')).toBeDefined();
    expect(getAllByText('Indicator1')).toBeDefined();
    expect(getAllByText('Indicator2')).toBeDefined();
    expect(getAllByText('Subfield')).toBeDefined();
  });
});
