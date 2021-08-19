import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { MARCTableViewRowContainer } from './MARCTableViewRowContainer';

const MARCTableViewRowContainerProps = {
  columns: ['field', 'indicator1', 'indicator2', 'subfield'],
  fields: [{
    order: 0,
    field: {
      subfields: [{
        subfield: 'testSubfield',
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
        subfield: 'testSubfield2',
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
      field: 'testField',
      indicator1: 'testIndicator1',
      indicator2: 'testIndicator2',
    },
    action: 'ADD_SUBFIELD',
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
  it('should be rendered', () => {
    const { debug } = renderMARCTableViewRowContainer(MARCTableViewRowContainerProps);
    //debug();
  });
});