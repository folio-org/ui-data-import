import React from 'react';
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

import { ActionProfilesFormComponent } from './ActionProfilesForm';

import * as utils from '../../utils/formUtils';

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

const actionProfilesFormProps = (search = '?layer=create') => ({
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
  location: {
    search,
    pathname: '/test-path',
  },
});

const renderActionProfilesForm = ({
  intl = { formatMessage: noop },
  initialValues,
  pristine,
  submitting,
  form,
  match,
  location,
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
        handleSubmit={noop}
        transitionToParams={noop}
        onCancel={noop}
      />
    </Router>
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('ActionProfilesForm', () => {
  afterEach(() => {
    handleProfileSave.mockClear();
  });

  describe('when form is in creating new record mode', () => {
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

    describe('when action is set', () => {
      describe('when action is CREATE', () => {
        it('action input should change the value', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const actionInput = container.querySelector('[name="profile.action"]');

          fireEvent.change(actionInput, { target: { value: 'CREATE' } });

          expect(actionInput.value).toBe('CREATE');
        });

        it('all record types except Order and MARC Holdings should be available', () => {
          const { container } = renderActionProfilesForm(actionProfilesFormProps());
          const actionInput = container.querySelector('[name="profile.action"]');

          fireEvent.change(actionInput, { target: { value: 'CREATE' } });

          expect(container.querySelector('[value="INSTANCE"]')).not.toBeDisabled();
          expect(container.querySelector('[value="HOLDINGS"]')).not.toBeDisabled();
          expect(container.querySelector('[value="ITEM"]')).not.toBeDisabled();
          expect(container.querySelector('[value="ORDER"]')).not.toBeInTheDocument();
          expect(container.querySelector('[value="INVOICE"]')).not.toBeDisabled();
          expect(container.querySelector('[value="MARC_BIBLIOGRAPHIC"]')).not.toBeDisabled();
          expect(container.querySelector('[value="MARC_AUTHORITY"]')).not.toBeDisabled();
          expect(container.querySelector('[value="MARC_HOLDINGS"]')).not.toBeInTheDocument();
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
          expect(container.querySelector('[value="MARC_AUTHORITY"]')).toBeDefined();
          expect(container.querySelector('[value="MARC_HOLDINGS"]')).toBeDefined();
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

      // skip test until https://issues.folio.org/browse/UIDATIMP-1231 will be ready
      describe.skip('when record type is ORDER', () => {
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

        await waitFor(() => fireEvent.click(getByText('Save as profile & Close')));

        await waitFor(() => expect(handleProfileSave).toHaveBeenCalledTimes(1));
      });
    });
  });

  describe('when form is in edit mode', () => {
    it('should be rendered', () => {
      const { getByText } = renderActionProfilesForm(actionProfilesFormProps('?layer=edit'));

      expect(getByText('Edit testName')).toBeDefined();
    });
  });

  describe('when edit profile and save', () => {
    it('confirmation modal should be shown', async () => {
      const {
        container,
        getByText,
      } = renderActionProfilesForm(actionProfilesFormProps('?layer=edit'));
      const nameInput = container.querySelector('[name="profile.name"]');

      fireEvent.change(nameInput, { target: { value: 'testName2' } });

      await waitFor(() => fireEvent.click(getByText('Save as profile & Close')));

      await waitFor(() => expect(getByText('Confirmation modal')).toBeDefined());
    });
  });

  describe('when confirm changes', () => {
    it('confirmation modal should be hidden', async () => {
      const {
        container,
        getByText,
        queryByText,
      } = renderActionProfilesForm(actionProfilesFormProps('?layer=edit'));
      const nameInput = container.querySelector('[name="profile.name"]');

      fireEvent.change(nameInput, { target: { value: 'testName2' } });

      await waitFor(() => fireEvent.click(getByText('Save as profile & Close')));
      await waitFor(() => fireEvent.click(getByText('Confirm')));

      expect(queryByText('Confirmation modal')).toBeNull();
    });

    it('action profile should be saved', async () => {
      const {
        container,
        getByText,
      } = renderActionProfilesForm(actionProfilesFormProps('?layer=edit'));
      const nameInput = container.querySelector('[name="profile.name"]');

      fireEvent.change(nameInput, { target: { value: 'testName2' } });

      await waitFor(() => fireEvent.click(getByText('Save as profile & Close')));
      await waitFor(() => fireEvent.click(getByText('Confirm')));

      await waitFor(() => expect(handleProfileSave).toHaveBeenCalledTimes(1));
    });
  });

  describe('when cancel changes', () => {
    it('confirmation modal should be hidden', async () => {
      const {
        container,
        getByText,
        queryByText,
      } = renderActionProfilesForm(actionProfilesFormProps('?layer=edit'));
      const nameInput = container.querySelector('[name="profile.name"]');

      fireEvent.change(nameInput, { target: { value: 'testName2' } });

      await waitFor(() => fireEvent.click(getByText('Save as profile & Close')));
      await waitFor(() => fireEvent.click(getByText('Cancel')));

      expect(queryByText('Confirmation modal')).toBeNull();
    });
  });
});
