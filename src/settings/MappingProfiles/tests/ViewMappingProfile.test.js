import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { ViewMappingProfile } from '../ViewMappingProfile';

import { getInitialDetails } from '../initialDetails';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  Layer: ({ children }) => (
    <div>{children}</div>
  ),
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

const mappingDetails = getInitialDetails('INVOICE');

const resources = {
  mappingProfileView: {
    records: [{
      childProfiles: [],
      deleted: false,
      existingRecordType: 'INVOICE',
      id: 'id1',
      incomingRecordType: 'EDIFACT_INVOICE',
      marcFieldProtectionSettings: [],
      metadata: {
        createdByUserId: '00000000-0000-0000-0000-000000000000',
        createdDate: '2021-03-01T15:00:00.000+00:00',
        updatedByUserId: '00000000-0000-0000-0000-000000000000',
        updatedDate: '2021-03-01T16:00:00.462+00:00',
      },
      mappingDetails,
      parentProfiles: [],
      userInfo: {
        firstName: 'System',
        lastName: 'System',
        userName: 'System',
      },
    }],
    hasLoaded: true,
  },
};

const viewMappingProfilesProps = {
  parentResources: { marcFieldProtectionSettings: { records: [] } },
  location: {
    search: '?sort=name',
    pathname: '/settings/data-import/mapping-profiles/view/id1',
  },
  match: { params: { id: 'id1' } },
  tagsEnabled: true,
  onClose: jest.fn(),
  onDelete: jest.fn(),
};

const renderViewMappingProfile = ({
  parentResources,
  location,
  match,
  tagsEnabled,
  onClose,
  onDelete,
}) => {
  const component = () => (
    <Router>
      <ViewMappingProfile
        resources={resources}
        parentResources={parentResources}
        location={location}
        history={history}
        match={match}
        tagsEnabled={tagsEnabled}
        onClose={onClose}
        onDelete={onDelete}
        stripes={{ hasPerm: () => true }}
      />
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

const spyConsoleError = jest.spyOn(console, 'error').mockImplementation(noop);

describe('ViewMappingProfile component', () => {
  afterAll(() => {
    spyConsoleError.mockRestore();
  });

  it('renders correctly', async () => {
    const {
      getByText,
      getByRole,
    } = renderViewMappingProfile(viewMappingProfilesProps);

    // has correct subheader
    expect(getByText('Field mapping profile')).toBeInTheDocument();
    // has actions button
    expect(getByRole('button', { name: /actions/i })).toBeInTheDocument();
    // has correct sections
    expect(getByRole('button', { name: /summary/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /tags/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /details/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /associated action profiles/i })).toBeInTheDocument();
  });

  it('"Details" section has correct sub-sections', () => {
    const { getByRole } = renderViewMappingProfile(viewMappingProfilesProps);

    expect(getByRole('button', { name: /invoice adjustments/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /invoice information/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /extended information/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /invoice line information/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /invoice line fund distribution/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /invoice line adjustments/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /vendor information/i })).toBeInTheDocument();
  });

  describe('Confirmation modal', () => {
    it('should be opened when "Delete" action is clicked', async () => {
      const {
        getByRole,
        getByText,
      } = renderViewMappingProfile(viewMappingProfilesProps);

      fireEvent.click(getByRole('button', { name: /actions/i }));
      fireEvent.click(getByRole('button', { name: /delete/i }));

      await waitFor(() => expect(getByText('Confirmation modal')).toBeInTheDocument());
    });

    it('should be closed when cancelled', async () => {
      const {
        findByRole,
        getByText,
      } = renderViewMappingProfile(viewMappingProfilesProps);

      const actionsButton = await findByRole('button', { name: /actions/i });
      fireEvent.click(actionsButton);

      const deleteButton = await findByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      const confirmationModalTitle = getByText('Confirmation modal');

      expect(confirmationModalTitle).toBeInTheDocument();

      const cancelButton = await findByRole('button', { name: 'Cancel' });
      fireEvent.click(cancelButton);

      expect(confirmationModalTitle).not.toBeInTheDocument();
    });

    it('should be closed when confirmed', async () => {
      const {
        getByRole,
        getByText,
        queryByText,
      } = renderViewMappingProfile(viewMappingProfilesProps);

      fireEvent.click(getByRole('button', { name: /actions/i }));
      fireEvent.click(getByRole('button', { name: /delete/i }));

      await waitFor(() => expect(getByText('Confirmation modal')).toBeInTheDocument());

      fireEvent.click(getByRole('button', { name: 'Confirm' }));

      await waitFor(() => expect(queryByText('Confirmation modal')).not.toBeInTheDocument());
    });
  });
});
