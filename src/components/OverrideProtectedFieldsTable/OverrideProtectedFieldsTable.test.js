import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { OverrideProtectedFieldsTable } from './OverrideProtectedFieldsTable';

const onChangeEvent = jest.fn();

const overrideProtectedFieldsTableProps = ({
  isEditable,
  marcFieldProtectionFieldsOverride,
  mappingMarcFieldProtectionFieldsOverride,
}) => ({
  marcFieldProtectionFields: [{
    data: 'test data1',
    field: 'test field1',
    id: 'testId1',
    indicator1: 'test indicator1_1',
    indicator2: 'test indicator2_1',
    override: marcFieldProtectionFieldsOverride,
    source: 'test source1',
    subfield: 'test subfield1',
  }],
  mappingMarcFieldProtectionFields: [{
    data: 'test data2',
    field: 'test field2',
    id: 'testId2',
    indicator1: 'test indicator1_2',
    indicator2: 'test indicator2_2',
    override: mappingMarcFieldProtectionFieldsOverride,
    source: 'test source2',
    subfield: 'test subfield2',
  }],
  isEditable,
});

const renderOverrideProtectedFieldsTable = ({
  marcFieldProtectionFields,
  mappingMarcFieldProtectionFields,
  isEditable,
}) => {
  const component = (
    <OverrideProtectedFieldsTable
      marcFieldProtectionFields={marcFieldProtectionFields}
      mappingMarcFieldProtectionFields={mappingMarcFieldProtectionFields}
      setReferenceTables={onChangeEvent}
      isEditable={isEditable}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('OverrideProtectedFieldsTable', () => {
  afterEach(() => {
    onChangeEvent.mockClear();
  });

  describe('when override protected fields table is editable', () => {
    it('additional information should be shown', () => {
      const { getAllByText } = renderOverrideProtectedFieldsTable(overrideProtectedFieldsTableProps({
        isEditable: true,
        marcFieldProtectionFieldsOverride: false,
        mappingMarcFieldProtectionFieldsOverride: false,
      }));

      expect(getAllByText('If any protected field should be updated by this profile, check the appropriate box here')).toBeDefined();
    });
  });

  describe('when override protected fields table is not editable', () => {
    it('additional information should be hidden', () => {
      const { queryByText } = renderOverrideProtectedFieldsTable(overrideProtectedFieldsTableProps({
        isEditable: false,
        marcFieldProtectionFieldsOverride: false,
        mappingMarcFieldProtectionFieldsOverride: false,
      }));

      expect(queryByText('If any protected field should be updated by this profile, check the appropriate box here')).toBeNull();
    });
  });

  describe('when clicking on accordion', () => {
    it('table with information should be hidden', () => {
      const { container } = renderOverrideProtectedFieldsTable(overrideProtectedFieldsTableProps({
        isEditable: true,
        marcFieldProtectionFieldsOverride: false,
        mappingMarcFieldProtectionFieldsOverride: false,
      }));
      const accordion = container.querySelector('.defaultCollapseButton');
      const contentBox = container.querySelector('.content-wrap');

      expect(contentBox).toHaveClass('expanded');

      fireEvent.click(accordion);

      expect(contentBox).not.toHaveClass('expanded');
    });
  });

  describe('when MARC field Protection Field overriding is allowed', () => {
    describe('when clicking on MARC field Protection Field override checkbox', () => {
      it('should be called function for updating form', () => {
        const { container } = renderOverrideProtectedFieldsTable(overrideProtectedFieldsTableProps({
          isEditable: true,
          marcFieldProtectionFieldsOverride: true,
          mappingMarcFieldProtectionFieldsOverride: false,
        }));
        const element = container.querySelector('#checkbox-11');

        fireEvent.click(element);

        expect(onChangeEvent.mock.calls.length).toEqual(1);
      });
    });
  });

  describe('when MARC field Protection Field overriding is not allowed', () => {
    describe('when clicking on MARC field Protection Field override checkbox', () => {
      it('should be called function for updating form', () => {
        const { container } = renderOverrideProtectedFieldsTable(overrideProtectedFieldsTableProps({
          isEditable: true,
          marcFieldProtectionFieldsOverride: false,
          mappingMarcFieldProtectionFieldsOverride: false,
        }));
        const element = container.querySelector('#checkbox-14');

        fireEvent.click(element);

        expect(onChangeEvent.mock.calls.length).toEqual(1);
      });
    });
  });
});
