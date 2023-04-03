import React from 'react';
import faker from 'faker';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  act,
  fireEvent,
} from '@testing-library/react';
import { noop } from 'lodash';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import {
  ACTION_TYPES,
  FOLIO_RECORD_TYPES,
} from '@folio/stripes-data-transfer-components';

import { MappingProfilesForm } from '../MappingProfilesForm';

import { getInitialDetails } from '../initialDetails';
import {
  LAYER_TYPES,
  PROFILE_TYPES,
} from '../../../utils';

const mappingDetailsProp = getInitialDetails(FOLIO_RECORD_TYPES.INVOICE.type);
const metadataMock = {
  createdByUserId: faker.random.uuid(),
  createdDate: '2023-02-16T21:48:26.558+00:00',
  updatedByUserId: faker.random.uuid(),
  updatedDate: '2023-02-16T21:48:26.558+00:00',
};
const userInfoMock = {
  firstName: 'FirstName',
  lastName: 'LastName',
  userName: 'user_name',
};
const handleSubmit = jest.fn();
const mappingProfileName = 'test mapping profile form';
const associatedProfileName1 = 'associated action 1';
const associatedProfileName2 = 'associated action 2';
const mappingProfilesFormProps = {
  initialValues: {
    id: faker.random.uuid(),
    description: '',
    existingRecordType: '',
    incomingRecordType: '',
    mappingDetails: {},
    name: mappingProfileName,
    parentProfiles: [
      {
        id: faker.random.uuid(),
        contentType: PROFILE_TYPES.ACTION_PROFILE,
        order: 0,
        content: {
          id: faker.random.uuid(),
          name: associatedProfileName1,
          action: ACTION_TYPES.CREATE.type,
          folioRecord: FOLIO_RECORD_TYPES.ITEM.type,
          metadata: metadataMock,
          userInfo: userInfoMock,
        },
      },
      {
        id: faker.random.uuid(),
        contentType: PROFILE_TYPES.ACTION_PROFILE,
        order: 1,
        content: {
          id: faker.random.uuid(),
          name: associatedProfileName2,
          action: ACTION_TYPES.CREATE.type,
          folioRecord: FOLIO_RECORD_TYPES.ITEM.type,
          metadata: metadataMock,
          userInfo: userInfoMock,
        },
      },
    ],
    childProfiles: [],
    metadata: metadataMock,
  },
  layerType: LAYER_TYPES.EDIT,
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
  layerType,
  location,
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
        layerType={layerType}
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
    handleSubmit.mockRestore();
  });

  it('should render correctly', () => {
    const { getByText } = renderMappingProfilesForm(mappingProfilesFormProps);

    expect(getByText(`Edit ${mappingProfileName}`)).toBeInTheDocument();
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

  it('should render associations', () => {
    const { getByText } = renderMappingProfilesForm(mappingProfilesFormProps);

    expect(getByText(associatedProfileName1)).toBeInTheDocument();
    expect(getByText(associatedProfileName2)).toBeInTheDocument();
  });

  describe('when unlinking associated profiles', () => {
    it('should display the modal', () => {
      const {
        getByText,
        getAllByTitle,
      } = renderMappingProfilesForm(mappingProfilesFormProps);

      fireEvent.click(getAllByTitle('Unlink this profile')[0]);

      expect(getByText('Confirm removal')).toBeInTheDocument();
    });

    it('and unlink profile on confirm', () => {
      const {
        getByText,
        getAllByTitle,
        queryByText,
      } = renderMappingProfilesForm(mappingProfilesFormProps);

      fireEvent.click(getAllByTitle('Unlink this profile')[0]);
      fireEvent.click(getByText('Confirm'));

      expect(queryByText(associatedProfileName1)).not.toBeInTheDocument();
    });
  });

  describe('when saving the form', () => {
    it('should call handleSubmit func', () => {
      const {
        container,
        getByText,
      } = renderMappingProfilesForm(mappingProfilesFormProps);
      const nameInput = container.querySelector('[name="profile.name"]');

      fireEvent.change(nameInput, { target: { value: 'testName' } });
      fireEvent.click(getByText('Save as profile & Close'));

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
