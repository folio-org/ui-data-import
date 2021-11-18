import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingMARCBibDetails } from '../MappingMARCBibDetails';
import { FIELD_MAPPINGS_FOR_MARC } from '../../../../../utils';

const mappingMarcFieldProtectionFieldsProp = [];
const fieldMappingsForMARCFieldProp = FIELD_MAPPINGS_FOR_MARC.UPDATES;
const setReferenceTables = jest.fn();
const marcMappingDetailsProp = [];
const marcFieldProtectionFieldsProp = [];
const onUpdateFieldAddProp = jest.fn();

const renderMappingMARCBibDetails = ({
  fieldMappingsForMARCField,
  marcMappingDetails,
}) => {
  const component = () => (
    <MappingMARCBibDetails
      mappingMarcFieldProtectionFields={mappingMarcFieldProtectionFieldsProp}
      fieldMappingsForMARCField={fieldMappingsForMARCField || fieldMappingsForMARCFieldProp}
      setReferenceTables={setReferenceTables}
      marcMappingDetails={marcMappingDetails || marcMappingDetailsProp}
      marcFieldProtectionFields={marcFieldProtectionFieldsProp}
      onUpdateFieldAdd={onUpdateFieldAddProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('<MappingMARCBibDetails>', () => {
  describe('when field mappings for MARC is "Updates"', () => {
    it('should have correct fields', async () => {
      const { findByRole } = renderMappingMARCBibDetails({});

      // eslint-disable-next-line no-irregular-whitespace
      expect(await findByRole('button', { name: /icon field mapping · marc bibliographic · updates/i })).toBeInTheDocument();
      // eslint-disable-next-line no-irregular-whitespace
      expect(await findByRole('button', { name: /icon field mapping · marc bibliographic · override protected fields/i })).toBeInTheDocument();
      // fireEvent.click(await findByRole('button', { name: /add field/i }));
    });

    it('New fields should be displayed correctly', async () => {
      const marcMappingDetailsData = [{
        field: {
          indicator1: '*',
          indicator2: '*',
          subfields: [{ subfield: '*' }],
        },
        order: 0,
      }];

      const { findByText } = renderMappingMARCBibDetails({ marcMappingDetails: marcMappingDetailsData });

      expect(await findByText('Field')).toBeInTheDocument();
      expect(await findByText('In.1')).toBeInTheDocument();
      expect(await findByText('In.2')).toBeInTheDocument();
      expect(await findByText('Subfield')).toBeInTheDocument();
    });
  });

  describe('when field mappings for MARC is "Modifications"', () => {
    it('should have correct fields', async () => {
      const {
        findByRole, getByText,
      } = renderMappingMARCBibDetails({
        fieldMappingsForMARCField: FIELD_MAPPINGS_FOR_MARC.MODIFICATIONS,
        marcMappingDetails: [{
          field: { subfields: [{}] },
          order: 0,
        }],
      });

      // eslint-disable-next-line no-irregular-whitespace
      expect(await findByRole('button', { name: /icon field mapping · marc bibliographic · modifications/i })).toBeInTheDocument();
      expect(getByText('Field')).toBeInTheDocument();
      expect(getByText('In.1')).toBeInTheDocument();
      expect(getByText('In.2')).toBeInTheDocument();
      expect(getByText('Subfield')).toBeInTheDocument();
      expect(getByText('Subaction')).toBeInTheDocument();
      expect(getByText('Data')).toBeInTheDocument();
      expect(getByText('Position')).toBeInTheDocument();
    });
  });
});
