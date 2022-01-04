import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  act,
  fireEvent,
} from '@testing-library/react';
import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { MappingProfilesForm } from '../MappingProfilesForm';

import { getInitialDetails } from '../initialDetails';
import { FOLIO_RECORD_TYPES } from '../../../components';

const mappingDetailsProp = getInitialDetails(FOLIO_RECORD_TYPES.INVOICE.type);
const mappingProfilesFormProps = {
  handleSubmit: noop,
  initialValues: {
    addedRelations: [],
    deletedRelations: [],
    id: null,
    profile: {
      description: '',
      existingRecordType: '',
      incomingRecordType: '',
      mappingDetails: {},
      name: '',
    },
  },
  location: { search: '?layer=create&sort=name' },
  mappingMarcFieldProtectionFields: [],
  onCancel: noop,
  parentResources: { marcFieldProtectionSettings: { records: [] } },
  pristine: true,
  submitting: false,
};

const renderMappingProfilesForm = ({
  pristine,
  submitting,
  initialValues,
  parentResources,
  mappingMarcFieldProtectionFields,
  location,
  handleSubmit,
  onCancel,
}) => {
  const component = () => (
    <Router>
      <MappingProfilesForm
        pristine={pristine}
        submitting={submitting}
        initialValues={initialValues}
        mappingDetails={mappingDetailsProp}
        parentResources={parentResources}
        mappingMarcFieldProtectionFields={mappingMarcFieldProtectionFields}
        location={location}
        handleSubmit={handleSubmit}
        oncancel={onCancel}
      />
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(noop);

describe('<MappingProfilesForm>', () => {
  afterAll(() => {
    spyConsoleError.mockRestore();
  });

  it('should render correctly', () => {
    renderMappingProfilesForm(mappingProfilesFormProps);
  });

  describe('when "Folio record type" is "Marc Bibliographic"', () => {
    it('"Field mappings for MARC" dropdown should be rendered', async () => {
      const { getByRole } = renderMappingProfilesForm(mappingProfilesFormProps);

      const folioRecordTypeSelect = getByRole('combobox', { name: /folio record type/i });

      act(() => {
        fireEvent.change(folioRecordTypeSelect, { target: { value: 'MARC_BIBLIOGRAPHIC' } });
      });

      expect(getByRole('combobox', { name: /field mappings for marc/i })).toBeInTheDocument();
    });

    describe('when "Field mappings for MARC"', () => {
      it('is "Updates", appropriate "Details" field should be rendered', () => {
        const { getByRole } = renderMappingProfilesForm(mappingProfilesFormProps);

        const folioRecordTypeSelect = getByRole('combobox', { name: /folio record type/i });

        act(() => {
          fireEvent.change(folioRecordTypeSelect, { target: { value: 'MARC_BIBLIOGRAPHIC' } });
        });

        fireEvent.change(getByRole('combobox', { name: /field mappings for marc/i }), { target: { value: 'UPDATE' } });

        // eslint-disable-next-line no-irregular-whitespace
        expect(getByRole('button', { name: /field mapping · marc bibliographic · updates/i })).toBeInTheDocument();
      });

      it('is "Modifications", appropriate "Details" field should be rendered', () => {
        const { getByRole } = renderMappingProfilesForm(mappingProfilesFormProps);

        const folioRecordTypeSelect = getByRole('combobox', { name: /folio record type/i });

        act(() => {
          fireEvent.change(folioRecordTypeSelect, { target: { value: 'MARC_BIBLIOGRAPHIC' } });
        });

        fireEvent.change(getByRole('combobox', { name: /field mappings for marc/i }), { target: { value: 'MODIFY' } });

        // eslint-disable-next-line no-irregular-whitespace
        expect(getByRole('button', { name: /field mapping · marc bibliographic · modifications/i })).toBeInTheDocument();
      });
    });
  });
});
