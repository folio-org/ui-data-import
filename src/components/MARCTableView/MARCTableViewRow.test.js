import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { MARCTableViewRow } from './MARCTableViewRow';

const MARCTableViewRowProps = {
  rowData: {
    action: 'EDIT',
    field: '',
    indicator1: 'testIndicator1',
    indicator2: 'testIndicator2',
    subfield: 'testSubfield',
    subaction: 'REPLACE',
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
    position: 'BEFORE_STRING',
  },
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

const renderMARCTableViewRow = ({
  rowData,
  columnWidths,
}) => {
  const component = (
    <MARCTableViewRow
      rowData={rowData}
      columnWidths={columnWidths}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MARCTableViewRow', () => {
  it('should be rendered', () => {
    const { debug } = renderMARCTableViewRow(MARCTableViewRowProps);
    //debug();
  });
});