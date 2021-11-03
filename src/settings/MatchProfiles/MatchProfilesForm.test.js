import React from 'react';
import queryString from 'query-string';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import {
  renderWithFinalForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { MatchProfilesForm, MatchProfilesFormComponent } from './MatchProfilesForm';

import { LAYER_TYPES } from '../../utils';

import * as utils from '../../utils/formUtils';

//jest.mock('../../components/MatchCriterion/edit', () => ({ MatchCriterion: () => <span>MatchCriterion</span> }));

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  ConfirmationModal: jest.fn(({
    open,
    onCancel,
    onConfirm,
  }) => (open ? (
    <div>
      <span>Confirmation modal</span>
      <button
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="button"
        id="confirmButton"
        onClick={onConfirm}
      >
        Confirm
      </button>
    </div>
  ) : null)),
}));

const history = createMemoryHistory();

history.push = jest.fn();

const handleProfileSave = jest.spyOn(utils, 'handleProfileSave');

const matchProfilesFormProps = (
  search = '?layer=create',
  ) => ({
  initialValues: {
    profile: {
      parentProfiles: [{
        id: '0d85d496-4504-4e79-be97-c6995d101b7e',
        contentType: 'MAPPING_PROFILE',
        content: {
          id: '0d85d496-4504-4e79-be97-c6995d101b7e',
          name: 'Order from MARC 1',
          description: 'Order from CoolVendor MARC order record',
          tags: { tagList: ['cool-vendor'] },
          incomingRecordType: 'MARC_BIBLIOGRAPHIC',
          existingRecordType: 'ORDER',
          deleted: false,
          userInfo: {
            firstName: 'DIKU',
            lastName: 'ADMINISTRATOR',
            userName: 'diku_admin',
          },
          parentProfiles: [],
          childProfiles: [],
          metadata: {
            createdDate: 1543741530000,
            createdByUserId: '',
            createdByUsername: '',
            updatedDate: 1544000730000,
            updatedByUserId: '',
            updatedByUsername: '',
          },
        },
        childSnapshotWrappers: [],
      }],
      childProfiles: [],
      name: 'testName',
      folioRecord: null,
      action: null,
      description: 'testDescription',
      id: 'testId',
      matchDetails: [{
        existingMatchExpression: {
          fields: [{
            label: 'field',
            value: 'instance.id',
          }],
        },
        incomingMatchExpression: {
          fields: [{
            label: 'testLabel_2',
            value: null,
          }],
        },
      }],
      incomingRecordType: 'MARC_BIBLIOGRAPHIC',
      existingRecordType: 'MARC_AUTHORITY',
    },
    matchDetails: [{
      existingMatchExpression: {
        fields: [{
          label: 'field',
          value: 'instance.id',
        }],
      },
      incomingMatchExpression: {
        fields: [{
          label: 'testLabel_2',
          value: null,
        }],
      },
    }],
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    existingRecordType: 'MARC_AUTHORITY',
  },
  pristine: true,
  submitting: true,
  location: {
    search,
    pathname: '/test-path',
  },
  jsonSchemas: {
    INSTANCE: {},
    HOLDINGS: {},
    ITEM: {},
    ORDER: {},
    INVOICE: {},
  },
  form: {
    getState: jest.fn(() => ({
      values: {
        addRelation: [],
        deleteRelation: [],
      },
    })),
    reset: noop,
    getFieldState: noop,
    batch: noop,
    change: noop,
  },
});

const renderMatchProfilesForm = ({
  initialValues,
  pristine,
  submitting,
  location,
  jsonSchemas,
  form,
}) => {
  const { layer } = queryString.parse(location.search);
  const isEditMode = layer === LAYER_TYPES.EDIT;
  const editModeComponent = () => (
    <Router>
      <MatchProfilesFormComponent
        initialValues={initialValues}
        pristine={pristine}
        submitting={submitting}
        location={location}
        jsonSchemas={jsonSchemas}
        form={form}
        match={{ path: '/test-path' }}
        handleSubmit={noop}
        onCancel={noop}
        transitionToParams={noop}
        onSubmit={jest.fn()}
      />
    </Router>
  );
  const createModeComponent = () => (
    <Router>
      <MatchProfilesForm
        initialValues={initialValues}
        pristine={pristine}
        submitting={submitting}
        location={location}
        jsonSchemas={jsonSchemas}
        form={form}
        match={{ path: '/test-path' }}
        handleSubmit={noop}
        onCancel={noop}
        transitionToParams={noop}
        onSubmit={jest.fn()}
      />
    </Router>
  );
  const component = isEditMode ? editModeComponent : createModeComponent;
  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('MatchProfilesForm', () => {
  afterEach(() => {
    handleProfileSave.mockClear();
  });

  describe('when form is in creating new record mode', () => {
    it('should be rendered', () => {
      const { getAllByText } = renderMatchProfilesForm(matchProfilesFormProps());
      
      expect(getAllByText('New match profile')).toBeDefined();
    });

    describe('when name is set', () => {
      it('name input should change the value', () => {
        const { container } = renderMatchProfilesForm(matchProfilesFormProps());
        const nameInput = container.querySelector('[name="profile.name"]');

        fireEvent.change(nameInput, { target: { value: 'test' } });

        expect(nameInput.value).toEqual('test');
      });
    });

    describe('when incoming MARC Bibliographic record values are set', () => {
      it('inputs whould change the value', () => {
        const { container } = renderMatchProfilesForm(matchProfilesFormProps());

        const fieldInput = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[0].value"]');
        const in1Input = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[1].value"]');
        const in2Input = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[2].value"]');
        const subfieldInput = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[3].value"]');

        fireEvent.change(fieldInput, { target: { value: '0011' } });
        fireEvent.change(in1Input, { target: { value: '**' } });
        fireEvent.change(in2Input, { target: { value: '**' } });
        fireEvent.change(subfieldInput, { target: { value: '*' } });

        expect(fieldInput.value).toEqual('0011');
        expect(in1Input.value).toEqual('**');
        expect(in2Input.value).toEqual('**');
        expect(subfieldInput.value).toEqual('*');
      });
    });

    describe('', () => {
      it('', () => {
        
      });
    });

    describe('when form has data to create record', () => {
      it('record should be saved', () => {
        const { container, getByText, debug } = renderMatchProfilesForm(matchProfilesFormProps());
        const nameInput = container.querySelector('[name="profile.name"]');
        const fieldInput = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[0].value"]');
        const in1Input = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[1].value"]');
        const in2Input = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[2].value"]');
        const subfield = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[3].value"]');

        fireEvent.change(nameInput, { target: { value: 'test' } });
        fireEvent.change(fieldInput, { target: { value: '001' } });
        fireEvent.change(in1Input, { target: { value: '**' } });
        fireEvent.change(in2Input, { target: { value: '**' } });
        fireEvent.change(subfield, { target: { value: '*' } });
//debug(container, 400000);
        fireEvent.click(getByText('Save as profile & Close'));

        expect(handleProfileSave).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when form is in edit mode', () => {
    it('should be rendered', async () => {
      const { container, getByText, debug } = renderMatchProfilesForm(matchProfilesFormProps('?layer=edit'));
      const nameInput = container.querySelector('[name="profile.name"]');
      fireEvent.change(nameInput, { target: { value: 'test' } });
      await waitFor(() => fireEvent.click(getByText('Save as profile & Close')));
      expect(getByText('Edit testName')).toBeDefined();
      //debug(container, 18000);
    });
  });
});
