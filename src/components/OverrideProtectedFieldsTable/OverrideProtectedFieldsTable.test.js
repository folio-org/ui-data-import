import React from 'react';
import { fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import {
  translationsProperties,
  renderWithFinalForm,
} from '../../../test/jest/helpers';

import { OverrideProtectedFieldsTable } from './OverrideProtectedFieldsTable';

import { MARC_TYPES } from '../../utils';

const onChangeEvent = jest.fn();

const marcFieldProtectionFieldsProps = override => ([{
  data: 'test data1',
  field: 'test field1',
  id: 'testId1',
  indicator1: 'test indicator1_1',
  indicator2: 'test indicator2_1',
  override,
  source: 'test source1',
  subfield: 'test subfield1',
}]);

const mappingMarcFieldProtectionFieldsProps = [{
  data: 'test data2',
  field: 'test field2',
  id: 'testId2',
  indicator1: 'test indicator1_2',
  indicator2: 'test indicator2_2',
  override: false,
  source: 'test source2',
  subfield: 'test subfield2',
}];

const renderOverrideProtectedFieldsTable = ({
  isEditable,
  marcFieldProtectionFields,
  mappingMarcFieldProtectionFields,
  folioRecordType,
  isAccordionOpen,
}) => {
  const component = () => (
    <OverrideProtectedFieldsTable
      marcFieldProtectionFields={marcFieldProtectionFields}
      mappingMarcFieldProtectionFields={mappingMarcFieldProtectionFields}
      setReferenceTables={onChangeEvent}
      folioRecordType={folioRecordType}
      isEditable={isEditable}
      isAccordionOpen={isAccordionOpen}
    />
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('OverrideProtectedFieldsTable', () => {
  afterEach(() => {
    onChangeEvent.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderOverrideProtectedFieldsTable({
      isEditable: true,
      folioRecordType: MARC_TYPES.MARC_BIBLIOGRAPHIC,
      marcFieldProtectionFields: marcFieldProtectionFieldsProps(false),
      mappingMarcFieldProtectionFields: mappingMarcFieldProtectionFieldsProps,
    });
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  describe('when override protected fields table is editable', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderOverrideProtectedFieldsTable({
        isEditable: true,
        folioRecordType: MARC_TYPES.MARC_BIBLIOGRAPHIC,
        marcFieldProtectionFields: marcFieldProtectionFieldsProps(false),
        mappingMarcFieldProtectionFields: mappingMarcFieldProtectionFieldsProps,
      });
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('warning text should be shown', () => {
      const { getAllByText } = renderOverrideProtectedFieldsTable({
        isEditable: true,
        folioRecordType: MARC_TYPES.MARC_BIBLIOGRAPHIC,
        marcFieldProtectionFields: marcFieldProtectionFieldsProps(false),
        mappingMarcFieldProtectionFields: mappingMarcFieldProtectionFieldsProps,
      });

      expect(getAllByText('If any protected field should be updated by this profile, check the appropriate box here')).toBeDefined();
    });

    describe('when MARC field Protection Field overriding is allowed', () => {
      describe('when clicking on MARC field Protection Field override checkbox', () => {
        it('form should be upated', () => {
          const fieldToRemove = [...mappingMarcFieldProtectionFieldsProps];
          const { container } = renderOverrideProtectedFieldsTable({
            isEditable: true,
            folioRecordType: MARC_TYPES.MARC_BIBLIOGRAPHIC,
            marcFieldProtectionFields: marcFieldProtectionFieldsProps(true),
            mappingMarcFieldProtectionFields: mappingMarcFieldProtectionFieldsProps,
          });
          const element = container.querySelector('[aria-label="Override protected fields"]');
          fireEvent.click(element);

          expect(onChangeEvent.mock.calls[0][1]).toEqual(fieldToRemove);
        });
      });
    });

    describe('when MARC field Protection Field overriding is not allowed', () => {
      describe('when clicking on MARC field Protection Field override checkbox', () => {
        it('form should be upated', () => {
          const fieldsToAdd = [...mappingMarcFieldProtectionFieldsProps, ...marcFieldProtectionFieldsProps(true)];
          const { container } = renderOverrideProtectedFieldsTable({
            isEditable: true,
            folioRecordType: MARC_TYPES.MARC_BIBLIOGRAPHIC,
            marcFieldProtectionFields: marcFieldProtectionFieldsProps(false),
            mappingMarcFieldProtectionFields: mappingMarcFieldProtectionFieldsProps,
          });
          const element = container.querySelector('[aria-label="Override protected fields"]');

          fireEvent.click(element);

          expect(onChangeEvent.mock.calls[0][1]).toEqual(fieldsToAdd);
        });
      });
    });
  });

  describe('when override protected fields table is not editable', () => {
    it('warning text should be hidden', () => {
      const { queryByText } = renderOverrideProtectedFieldsTable({
        isEditable: false,
        isAccordionOpen: false,
        folioRecordType: MARC_TYPES.MARC_BIBLIOGRAPHIC,
        marcFieldProtectionFields: marcFieldProtectionFieldsProps(false),
        mappingMarcFieldProtectionFields: mappingMarcFieldProtectionFieldsProps,
      });

      expect(queryByText('If any protected field should be updated by this profile, check the appropriate box here')).toBeNull();
    });
  });

  describe('when clicking on accordion', () => {
    it('table with information should be hidden', () => {
      const { container } = renderOverrideProtectedFieldsTable({
        isEditable: true,
        folioRecordType: MARC_TYPES.MARC_BIBLIOGRAPHIC,
        marcFieldProtectionFields: marcFieldProtectionFieldsProps(false),
        mappingMarcFieldProtectionFields: mappingMarcFieldProtectionFieldsProps,
      });
      const accordion = container.querySelector('.defaultCollapseButton');
      const contentBox = container.querySelector('.content-wrap');

      expect(contentBox).toHaveClass('expanded');

      fireEvent.click(accordion);

      expect(contentBox).not.toHaveClass('expanded');
    });
  });
});
