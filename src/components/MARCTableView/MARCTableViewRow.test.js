import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { MARCTableViewRow } from './MARCTableViewRow';

const MARCTableViewRowProps = ({
  action,
  subaction,
  text = null,
}) => ({
  rowData: {
    action,
    field: '',
    indicator1: 'testIndicator1',
    indicator2: 'testIndicator2',
    subfield: 'testSubfield',
    subaction,
    data: {
      text,
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
});

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
  describe('when mapping details action is Edit', () => {
    describe('when mapping details subaction is not Replace', () => {
      describe('when row has the text ', () => {
        it('should be rendered with correct labels', () => {
          const {
            getByText,
            queryByText,
          } = renderMARCTableViewRow(MARCTableViewRowProps({
            action: 'EDIT',
            subaction: 'CREATE_NEW_FIELD',
            text: 'testText',
          }));

          expect(getByText('Edit')).toBeDefined();
          expect(queryByText('testText')).toBeDefined();
        });
      });

      describe('when row has no text ', () => {
        it('should be rendered with correct labels', () => {
          const { getByText } = renderMARCTableViewRow(MARCTableViewRowProps({
            action: 'EDIT',
            subaction: 'CREATE_NEW_FIELD',
          }));

          expect(getByText('Edit')).toBeDefined();
          expect(getByText('-')).toBeDefined();
        });
      });
    });

    describe('when mapping details subaction is Replace', () => {
      it('should be rendered with correct labels', () => {
        const { getByText } = renderMARCTableViewRow(MARCTableViewRowProps({
          action: 'EDIT',
          subaction: 'REPLACE',
        }));

        expect(getByText('Edit')).toBeDefined();
        expect(getByText('Replace')).toBeDefined();
      });
    });
  });

  describe('when mapping details action is Move', () => {
    describe('when mapping details subaction is Create new field', () => {
      it('should be rendered with correct label', () => {
        const { getByText } = renderMARCTableViewRow(MARCTableViewRowProps({
          action: 'MOVE',
          subaction: 'CREATE_NEW_FIELD',
        }));

        expect(getByText('Move')).toBeDefined();
        expect(getByText('New field')).toBeDefined();
      });
    });

    describe('when mapping details subaction is Add to existing field', () => {
      it('should be rendered with correct label', () => {
        const { getByText } = renderMARCTableViewRow(MARCTableViewRowProps({
          action: 'MOVE',
          subaction: 'ADD_TO_EXISTING_FIELD',
        }));

        expect(getByText('Move')).toBeDefined();
        expect(getByText('Existing field')).toBeDefined();
      });
    });
  });
});
