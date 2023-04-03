import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';

import '../../../../test/jest/__mock__';

import { ACTION_TYPES } from '@folio/stripes-data-transfer-components';
import { Pluggable } from '@folio/stripes/core';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { ProfileAssociator } from '../ProfileAssociator';

import { PROFILE_TYPES } from '../../../utils';

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

const contentDataProp = [{
  contentType: PROFILE_TYPES.JOB_PROFILE,
  content: {
    name: 'testName1',
    id: 'testId1',
    userInfo: {
      firstName: 'System1',
      lastName: 'System1',
      userName: 'System1',
    },
    metadata: {
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdDate: 1618322400000,
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedDate: 1607871600462,
    },
  },
  id: 'testId1',
}, {
  contentType: PROFILE_TYPES.JOB_PROFILE,
  content: {
    name: 'testName2',
    id: 'testId2',
    userInfo: {
      firstName: 'System2',
      lastName: 'System2',
      userName: 'System2',
    },
    metadata: {
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdDate: 1618322400000,
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedDate: 1608058800000,
    },
  },
  id: 'testId2',
},
{
  contentType: PROFILE_TYPES.ACTION_PROFILE,
  content: {
    name: 'testName3',
    id: 'testId3',
    userInfo: {
      firstName: 'System3',
      lastName: 'System3',
      userName: 'System3',
    },
    metadata: {
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdDate: 1618322400000,
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedDate: 1608058800000,
    },
  },
  id: 'testId3',
}];

const relationsToAddProp = [{
  masterProfileId: PROFILE_TYPES.JOB_PROFILE,
  detailProfileId: PROFILE_TYPES.JOB_PROFILE,
}];

const renderProfileAssociator = ({
  record,
  isMultiSelect,
  useSearch,
  contentData,
  parentType,
  masterType,
  detailType,
}) => {
  const component = (
    <Router>
      <ProfileAssociator
        entityKey="jobProfiles"
        profileType="actionProfiles"
        namespaceKey="AJP"
        parentType={parentType || PROFILE_TYPES.ACTION_PROFILE}
        masterType={masterType || PROFILE_TYPES.JOB_PROFILE}
        detailType={detailType || PROFILE_TYPES.ACTION_PROFILE}
        contentData={contentData || contentDataProp}
        record={record}
        isMultiSelect={isMultiSelect}
        useSearch={useSearch}
        relationsToAdd={relationsToAddProp}
        hasLoaded
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('<ProfileAssociator>', () => {
  describe('when there is no associated profiles', () => {
    it('renders empty message', () => {
      const { getByText } = renderProfileAssociator({
        record: {
          id: 'testId1',
          action: ACTION_TYPES.CREATE,
          name: 'testName1',
        },
        contentData: [],
        isMultiSelect: true,
        useSearch: true,
      });

      expect(getByText('The list contains no items')).toBeInTheDocument();
    });
  });

  it('"Search" button is disabled by default', () => {
    const { getByRole } = renderProfileAssociator({
      record: {
        id: 'testId1',
        action: ACTION_TYPES.CREATE,
        name: 'testName1',
      },
      isMultiSelect: false,
      useSearch: true,
    });

    expect(getByRole('button', { name: /search/i })).toBeDisabled();
  });

  describe('when input field is filled', () => {
    it('"Search" button is enabled', () => {
      const { getByRole } = renderProfileAssociator({
        record: {
          id: 'testId1',
          action: ACTION_TYPES.CREATE,
          name: 'testName1',
        },
        isMultiSelect: true,
        useSearch: true,
      });

      const searchInput = getByRole('searchbox', { name: /search job profiles/i });

      fireEvent.change(searchInput, { target: { value: 'test' } });

      expect(getByRole('button', { name: /search/i })).toBeEnabled();
    });

    it('user can clear search box', async () => {
      const {
        getByRole,
        container,
      } = renderProfileAssociator({
        record: {
          id: 'testId1',
          action: ACTION_TYPES.CREATE,
          name: 'testName1',
        },
        isMultiSelect: true,
        useSearch: true,
      });

      const searchInput = getByRole('searchbox', { name: /search job profiles/i });

      fireEvent.change(searchInput, { target: { value: 'test' } });

      searchInput.focus();

      fireEvent.click(container.querySelector('#input-jobProfiles-search-field-clear-button'));

      await waitFor(() => expect(getByRole('button', { name: /search/i })).toBeDisabled());
      await waitFor(() => expect(getByRole('searchbox', { name: /search job profiles/i }).value).toEqual(''));
    });
  });

  describe('when user search', () => {
    it('input field persists search term', async () => {
      const { getByRole } = renderProfileAssociator({
        record: {
          id: 'testId1',
          action: ACTION_TYPES.CREATE,
          name: 'testName1',
        },
        isMultiSelect: true,
        useSearch: true,
      });

      const searchInput = getByRole('searchbox', { name: /search job profiles/i });

      fireEvent.change(searchInput, { target: { value: 'term' } });

      fireEvent.click(getByRole('button', { name: /search/i }));

      await waitFor(() => expect(searchInput.value).toBe('term'));
    });
  });

  describe('when "unlink" button is clicked', () => {
    it('Confirmation modal should appear', async () => {
      const {
        getAllByTitle,
        findByText,
      } = renderProfileAssociator({
        isMultiSelect: false,
        useSearch: false,
        masterType: PROFILE_TYPES.JOB_PROFILE,
        parentType: PROFILE_TYPES.JOB_PROFILE,
        detailType: PROFILE_TYPES.JOB_PROFILE,
      });

      const unlinkButton = getAllByTitle(/unlink this profile/i)[0];

      fireEvent.click(unlinkButton);

      expect(await findByText('Confirmation modal')).toBeInTheDocument();
    });

    describe('when cancel button is clicked', () => {
      it('Confirmation modal should be closed', async () => {
        const {
          getAllByTitle,
          findByText,
          queryByText,
        } = renderProfileAssociator({
          isMultiSelect: false,
          useSearch: false,
        });

        const unlinkButton = getAllByTitle(/unlink this profile/i)[0];

        fireEvent.click(unlinkButton);

        const cancelButton = await findByText('Cancel');

        fireEvent.click(cancelButton);

        await waitFor(() => expect(queryByText('Confirmation')).not.toBeInTheDocument());
      });
    });

    describe('when confirm button is clicked', () => {
      it('Confirmation modal should be closed', async () => {
        const {
          getAllByTitle,
          findByText,
          queryByText,
        } = renderProfileAssociator({
          isMultiSelect: false,
          useSearch: false,
        });

        const unlinkButton = getAllByTitle(/unlink this profile/i)[0];

        fireEvent.click(unlinkButton);

        const confirmButton = await findByText('Confirm');

        fireEvent.click(confirmButton);

        await waitFor(() => expect(queryByText('Confirmation')).not.toBeInTheDocument());
      });
    });
  });

  it('profiles are sorted by "Name" column by default', () => {
    const { container } = renderProfileAssociator({ isMultiSelect: true });

    const dataRows = container.querySelectorAll('[data-row-index]');

    expect(dataRows[0]).toHaveTextContent('testName1');
    expect(dataRows[1]).toHaveTextContent('testName2');
  });

  it('User can sort profiles by "Name"', () => {
    const {
      container,
      getByText,
    } = renderProfileAssociator({ isMultiSelect: true });

    const dataRows = container.querySelectorAll('[data-row-index]');

    fireEvent.click(getByText('Name'));

    expect(dataRows[0]).toHaveTextContent('testName2');
    expect(dataRows[1]).toHaveTextContent('testName1');
  });

  it('User can sort profiles by "Updated date"', () => {
    const {
      container,
      getByText,
    } = renderProfileAssociator({ isMultiSelect: true });

    const dataRows = container.querySelectorAll('[data-row-index]');

    fireEvent.click(getByText('Updated'));

    expect(dataRows[0]).toHaveTextContent('12/13/2020');
    expect(dataRows[1]).toHaveTextContent('12/15/2020');
  });

  it('renders plugin info', async () => {
    jest.spyOn(console, 'error').mockImplementationOnce(() => {});
    const { getByText } = renderProfileAssociator({
      isMultiSelect: false,
      parentType: PROFILE_TYPES.JOB_PROFILE,
      masterType: PROFILE_TYPES.ACTION_PROFILE,
      detailType: PROFILE_TYPES.JOB_PROFILE,
    });

    act(() => Pluggable.mock.calls[0][0].onLink([{ id: 'testId' }]));
    expect(getByText('Find Import Profile Plugin is not available now')).toBeInTheDocument();
  });
});
