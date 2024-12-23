import React, { act } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithFinalForm,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { ActionProfilesFormComponent } from './ActionProfilesForm';

import { LAYER_TYPES } from '../../utils';

const spyOnCheckIfUserInCentralTenant = jest.spyOn(require('@folio/stripes/core'), 'checkIfUserInCentralTenant');

const history = createMemoryHistory();

history.push = jest.fn();

const onSubmitMock = jest.fn();

const actionProfilesFormProps = layerType => ({
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
            createdDate: '2018-12-02T01:50:24.783+00:00',
            createdByUserId: '',
            createdByUsername: '',
            updatedDate: '2018-12-05T01:50:24.783+00:00',
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
    },
  },
  pristine: false,
  submitting: false,
  form: {
    getState: jest.fn(() => ({
      values: {
        addRelation: [],
        deleteRelation: [],
      },
    })),
    change: noop,
    reset: noop,
  },
  match: { path: '/test-path' },
  location: '/test-path',
  layerType,
});

const renderActionProfilesForm = ({
  intl = { formatMessage: noop },
  initialValues,
  pristine,
  submitting,
  form,
  match,
  location,
  layerType,
}) => {
  const component = () => (
    <Router>
      <ActionProfilesFormComponent
        intl={intl}
        initialValues={initialValues}
        pristine={pristine}
        submitting={submitting}
        form={form}
        match={match}
        location={location}
        handleSubmit={onSubmitMock}
        transitionToParams={noop}
        onCancel={noop}
        layerType={layerType}
        baseUrl="base-url"
        onSubmitSuccess={noop}
      />
    </Router>
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('ActionProfilesForm component', () => {
  afterEach(() => {
    onSubmitMock.mockClear();
  });

  describe('when form is in creating new record mode', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderActionProfilesForm(actionProfilesFormProps());

      await runAxeTest({ rootNode: container });
    });

    it('should be rendered', () => {
      const { getAllByText } = renderActionProfilesForm(actionProfilesFormProps());

      expect(getAllByText('New action profile')).toBeDefined();
    });

    describe('when name is set', () => {
      it('name input should change the value', () => {
        const { container } = renderActionProfilesForm(actionProfilesFormProps());
        const nameInput = container.querySelector('[name="profile.name"]');

        fireEvent.change(nameInput, { target: { value: 'testName' } });

        expect(nameInput.value).toBe('testName');
      });
    });

    describe('when user is non-consortial tenant', () => {
      it('should render all record types', () => {
        const { container } = renderActionProfilesForm(actionProfilesFormProps());

        expect(container.querySelector('[value="INSTANCE"]')).toBeDefined();
        expect(container.querySelector('[value="HOLDINGS"]')).toBeDefined();
        expect(container.querySelector('[value="ITEM"]')).toBeDefined();
        expect(container.querySelector('[value="ORDER"]')).toBeDefined();
        expect(container.querySelector('[value="INVOICE"]')).toBeDefined();
        expect(container.querySelector('[value="MARC_BIBLIOGRAPHIC"]')).toBeDefined();
        expect(container.querySelector('[value="MARC_HOLDINGS"]')).toBeDefined();
      });
    });

    describe('when user is in central tenant', () => {
      it('should render "Instance", "Order", "Invoice", "MARC Bibliographic" and "MARC Authority" record types', () => {
        spyOnCheckIfUserInCentralTenant.mockReturnValue(true);

        const { container } = renderActionProfilesForm(actionProfilesFormProps());

        expect(container.querySelector('[value="INSTANCE"]')).toBeDefined();
        expect(container.querySelector('[value="ORDER"]')).toBeDefined();
        expect(container.querySelector('[value="INVOICE"]')).toBeDefined();
        expect(container.querySelector('[value="MARC_BIBLIOGRAPHIC"]')).toBeDefined();
        expect(container.querySelector('[value="MARC_HOLDINGS"]')).toBeDefined();

        expect(container.querySelector('[value="HOLDINGS"]')).not.toBeInTheDocument();
        expect(container.querySelector('[value="ITEM"]')).not.toBeInTheDocument();
      });
    });

    describe('when user is in member tenant', () => {
      it('should render all record types', () => {
        spyOnCheckIfUserInCentralTenant.mockReturnValue(false);

        const { container } = renderActionProfilesForm(actionProfilesFormProps());

        expect(container.querySelector('[value="INSTANCE"]')).toBeDefined();
        expect(container.querySelector('[value="HOLDINGS"]')).toBeDefined();
        expect(container.querySelector('[value="ITEM"]')).toBeDefined();
        expect(container.querySelector('[value="ORDER"]')).toBeDefined();
        expect(container.querySelector('[value="INVOICE"]')).toBeDefined();
        expect(container.querySelector('[value="MARC_BIBLIOGRAPHIC"]')).toBeDefined();
        expect(container.querySelector('[value="MARC_HOLDINGS"]')).toBeDefined();
      });
    });

    describe('when action is set', () => {
      describe('when action is CREATE', () => {
        it('action input should change the value', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const actionInput = container.querySelector('[name="profile.action"]');

          fireEvent.change(actionInput, { target: { value: 'CREATE' } });

          expect(actionInput.value).toBe('CREATE');
        });

        it('all record types except MARC Bibliographic, MARC Holdings and MARC Authority should be available', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const actionInput = container.querySelector('[name="profile.action"]');

          fireEvent.change(actionInput, { target: { value: 'CREATE' } });

          expect(container.querySelector('[value="INSTANCE"]')).not.toBeDisabled();
          expect(container.querySelector('[value="HOLDINGS"]')).not.toBeDisabled();
          expect(container.querySelector('[value="ITEM"]')).not.toBeDisabled();
          expect(container.querySelector('[value="ORDER"]')).not.toBeDisabled();
          expect(container.querySelector('[value="INVOICE"]')).not.toBeDisabled();

          expect(container.querySelector('[value="MARC_BIBLIOGRAPHIC"]')).not.toBeInTheDocument();
          expect(container.querySelector('[value="MARC_HOLDINGS"]')).not.toBeInTheDocument();
          expect(container.querySelector('[value="MARC_AUTHORITY"]')).not.toBeInTheDocument();
        });
      });

      describe('when action is MODIFY', () => {
        it('action input should change the value', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const actionInput = container.querySelector('[name="profile.action"]');

          fireEvent.change(actionInput, { target: { value: 'MODIFY' } });

          expect(actionInput.value).toBe('MODIFY');
        });

        it('only MARC record types should be shown', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const actionInput = container.querySelector('[name="profile.action"]');

          fireEvent.change(actionInput, { target: { value: 'MODIFY' } });

          expect(container.querySelector('[value="MARC_BIBLIOGRAPHIC"]')).toBeDefined();
        });
      });

      describe('when action is UPDATE', () => {
        it('action input should change the value', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const actionInput = container.querySelector('[name="profile.action"]');

          fireEvent.change(actionInput, { target: { value: 'UPDATE' } });

          expect(actionInput.value).toBe('UPDATE');
        });

        it('all record types except Orders, MARC Holdings and Invoice should be available', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const actionInput = container.querySelector('[name="profile.action"]');

          fireEvent.change(actionInput, { target: { value: 'UPDATE' } });

          expect(container.querySelector('[value="INSTANCE"]')).not.toBeDisabled();
          expect(container.querySelector('[value="HOLDINGS"]')).not.toBeDisabled();
          expect(container.querySelector('[value="ITEM"]')).not.toBeDisabled();
          expect(container.querySelector('[value="INVOICE"]')).not.toBeInTheDocument();
          expect(container.querySelector('[value="MARC_BIBLIOGRAPHIC"]')).not.toBeDisabled();
          expect(container.querySelector('[value="MARC_AUTHORITY"]')).not.toBeDisabled();
          expect(container.querySelector('[value="MARC_HOLDINGS"]')).not.toBeInTheDocument();
          expect(container.querySelector('[value="ORDER"]')).not.toBeInTheDocument();
        });
      });
    });

    describe('when record type is set', () => {
      describe('when record type is INSTANCE', () => {
        it('record type input should change the value', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const recordInput = container.querySelector('[name="profile.folioRecord"]');

          fireEvent.change(recordInput, { target: { value: 'INSTANCE' } });

          expect(recordInput.value).toBe('INSTANCE');
        });
      });

      describe('when record type is HOLDINGS', () => {
        it('record type input should change the value', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const recordInput = container.querySelector('[name="profile.folioRecord"]');

          fireEvent.change(recordInput, { target: { value: 'HOLDINGS' } });

          expect(recordInput.value).toBe('HOLDINGS');
        });
      });

      describe('when record type is ITEM', () => {
        it('record type input should change the value', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const recordInput = container.querySelector('[name="profile.folioRecord"]');

          fireEvent.change(recordInput, { target: { value: 'ITEM' } });

          expect(recordInput.value).toBe('ITEM');
        });
      });

      describe('when record type is ORDER', () => {
        it('record type input should change the value', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const recordInput = container.querySelector('[name="profile.folioRecord"]');

          fireEvent.change(recordInput, { target: { value: 'ORDER' } });

          expect(recordInput.value).toBe('ORDER');
        });
      });

      describe('when record type is INVOICE', () => {
        it('record type input should change the value', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const recordInput = container.querySelector('[name="profile.folioRecord"]');

          fireEvent.change(recordInput, { target: { value: 'INVOICE' } });

          expect(recordInput.value).toBe('INVOICE');
        });
      });

      describe('when record type is MARC_BIBLIOGRAPHIC', () => {
        it('record type input should change the value', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const recordInput = container.querySelector('[name="profile.folioRecord"]');

          fireEvent.change(recordInput, { target: { value: 'MARC_BIBLIOGRAPHIC' } });

          expect(recordInput.value).toBe('MARC_BIBLIOGRAPHIC');
        });
      });

      describe('when record type is MARC_AUTHORITY', () => {
        it('record type input should change the value', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const recordInput = container.querySelector('[name="profile.folioRecord"]');

          fireEvent.change(recordInput, { target: { value: 'MARC_AUTHORITY' } });

          expect(recordInput.value).toBe('MARC_AUTHORITY');
        });
      });
    });

    describe('when submit the form', () => {
      it('should submit action profile', async () => {
        const {
          container,
          getByText,
        } = renderActionProfilesForm(actionProfilesFormProps());
        const nameInput = container.querySelector('[name="profile.name"]');

        fireEvent.change(nameInput, { target: { value: 'testName' } });

        const actionInput = container.querySelector('[name="profile.action"]');

        fireEvent.change(actionInput, { target: { value: 'CREATE' } });

        const recordInput = container.querySelector('[name="profile.folioRecord"]');

        fireEvent.change(recordInput, { target: { value: 'INSTANCE' } });

        await waitFor(() => fireEvent.submit(getByText('Save as profile & Close')));

        await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
      });
    });
  });

  describe('when form is in edit mode', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderActionProfilesForm(actionProfilesFormProps(LAYER_TYPES.EDIT));

      await act(async () => {
        await runAxeTest({ rootNode: container });
      });
    });

    it('should be rendered', () => {
      const { getByText } = renderActionProfilesForm(actionProfilesFormProps(LAYER_TYPES.EDIT));

      expect(getByText('Edit testName')).toBeDefined();
    });
  });
});
