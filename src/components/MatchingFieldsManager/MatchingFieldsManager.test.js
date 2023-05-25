import React from 'react';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { MatchingFieldsManager } from './MatchingFieldsManager';

const records = [
  {
    categoryId: 'admin-data',
    label: 'ui-data-import.settings.matchProfiles.adminData',
    value: 'test value',
  },
  {
    categoryId: 'acquisitions-data',
    label: 'ui-data-import.settings.mappingProfiles.map.holdings.acquisitionsData.field.purchaseOrderLineNumber',
    value: 'holdings.purchaseOrderLineNumber',
  }, {
    categoryId: 'acquisitions-data',
    label: 'ui-data-import.settings.mappingProfiles.map.holdings.acquisitionsData.field.vendorReferenceNumber',
    value: 'holdings.vendorReferenceNumber',
  },
];
const resourcesWithFromResources = [{
  id: 'identifiers.items.properties.value',
  label: 'field',
  categoryId: 'identifier',
  value: 'instance.identifiers[].value',
  recordType: 'INSTANCE',
  fromResources: {
    recordsName: 'identifierTypes',
    fieldToDisplay: 'name',
    labelToSend: 'identifierTypeId',
    fieldToSend: 'id',
  },
}];
const resources = {
  identifierTypes: {
    records: [{
      id: 'testId',
      name: 'testName',
    }],
  },
  updatedDate: 'test',
};
const fieldsWithLabel = [{
  value: 'instance.metadata.updatedDate',
  label: 'field',
}];
const fieldsWithoutLabel = [{ value: 'instance.metadata.updatedDate' }];
const defaultIntl = { formatMessage: noop };
const getFieldMatchedChildren = record => <span>{record.getFieldMatched(fieldsWithLabel, 'INSTANCE')}</span>;

const renderMatchingFieldsManager = ({
  children,
  intl = defaultIntl,
}) => {
  const component = (
    <MatchingFieldsManager
      resources={resources}
      intl={intl}
    >
      {children}
    </MatchingFieldsManager>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('MatchingFieldsManager', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderMatchingFieldsManager({ children: getFieldMatchedChildren });

    await runAxeTest({ rootNode: container });
  });

  describe('when matchFileds function is called', () => {
    it('should be rendered', () => {
      const matchFieldsChildren = record => {
        const labelId = record.matchFields(resources, 'INSTANCE')[0].label;

        return <span><FormattedMessage id={labelId} /></span>;
      };
      const { getByText } = renderMatchingFieldsManager({ children: matchFieldsChildren });

      expect(getByText('Updated date and time')).toBeDefined();
    });
  });

  describe('when getFieldMatched function is called', () => {
    describe('when record is not MARC', () => {
      it('should be rendered', () => {
        const { getByText } = renderMatchingFieldsManager({ children: getFieldMatchedChildren });

        expect(getByText('Updated date and time')).toBeDefined();
      });

      describe('when language direction is rtl', () => {
        it('should be rendered correctly', () => {
          document.dir = 'rtl';
          const { getByText } = renderMatchingFieldsManager({ children: getFieldMatchedChildren });

          expect(getByText('Updated date and time')).toBeDefined();
        });
      });

      describe('when record has from resources', () => {
        it('empty title should be rendered', () => {
          const getFieldMatchedChildrenWithFromResources = record => <span>{record.getFieldMatched(resourcesWithFromResources, 'INSTANCE')}</span>;
          const { container } = renderMatchingFieldsManager({ children: getFieldMatchedChildrenWithFromResources });
          const titleElement = container.querySelector('span').innerHTML;

          expect(titleElement).toEqual('');
        });
      });

      describe('when record type doesn`t exist', () => {
        it('empty title should be rendered', () => {
          const getFieldMatchedWithCategoryChildrenWithoutRecordType = record => <span>{record.getFieldMatchedWithCategory(fieldsWithLabel, null)}</span>;
          const { container } = renderMatchingFieldsManager({ children: getFieldMatchedWithCategoryChildrenWithoutRecordType });

          const titleElement = container.querySelector('span').innerHTML;

          expect(titleElement).toEqual('');
        });
      });
    });

    describe('when record is MARC', () => {
      it('should be rendered', () => {
        const getFieldMatchedMARCChildren = record => <span>{record.getFieldMatched(fieldsWithLabel, 'MARCBIB')}</span>;
        const { getByText } = renderMatchingFieldsManager({ children: getFieldMatchedMARCChildren });

        expect(getByText('instance.metadata.updatedDate')).toBeDefined();
      });
    });
  });

  describe('when getFieldMatchedWithCategory function is called', () => {
    describe('when fields have label', () => {
      it('should be rendered', () => {
        const getFieldMatchedWithCategoryChildrenWithLabel = record => <span>{record.getFieldMatchedWithCategory(fieldsWithLabel, 'INSTANCE')}</span>;
        const { getByText } = renderMatchingFieldsManager({ children: getFieldMatchedWithCategoryChildrenWithLabel });

        expect(getByText('Admin data: Updated date and time')).toBeDefined();
      });
    });

    describe('when fields don`t have label', () => {
      it('empty title should be rendered', () => {
        const getFieldMatchedWithCategoryChildrenWithoutLabel = record => <span>{record.getFieldMatchedWithCategory(fieldsWithoutLabel, 'INSTANCE')}</span>;
        const { container } = renderMatchingFieldsManager({ children: getFieldMatchedWithCategoryChildrenWithoutLabel });

        const titleElement = container.querySelector('span').innerHTML;

        expect(titleElement).toEqual('');
      });
    });
  });

  describe('when getDropdownOptions function is called', () => {
    describe('when field hasn`t from resources', () => {
      it('should be rendered', () => {
        const getDropdownOptionsChildren = record => <span>{record.getDropdownOptions(records)[0].label}</span>;
        const { getByText } = renderMatchingFieldsManager({ children: getDropdownOptionsChildren });

        expect(getByText('Admin data: Admin data')).toBeDefined();
      });

      it('should render Purchase Order Line POL', () => {
        const getDropdownOptionsChildren = record => {
          return record.getDropdownOptions(records).map(rec => <span>{rec.label}</span>);
        };
        const { getByText } = renderMatchingFieldsManager({ children: getDropdownOptionsChildren });

        expect(getByText('Acquisitions data: Purchase order line (POL)')).toBeDefined();
      });

      it('should render Vendor reference number', () => {
        const getDropdownOptionsChildren = record => {
          return record.getDropdownOptions(records).map(rec => <span key={rec.categoryId}>{rec.label}</span>);
        };
        const { getByText } = renderMatchingFieldsManager({ children: getDropdownOptionsChildren });

        expect(getByText('Acquisitions data: Vendor reference number')).toBeDefined();
      });
    });

    describe('when field hasn from resources', () => {
      it('should be rendered', () => {
        const getDropdownOptionsChildrenWithFromResources = record => <span>{record.getDropdownOptions(resourcesWithFromResources)[0].label}</span>;
        const { getByText } = renderMatchingFieldsManager({ children: getDropdownOptionsChildrenWithFromResources });

        expect(getByText('Identifier: testName')).toBeDefined();
      });
    });
  });
});
