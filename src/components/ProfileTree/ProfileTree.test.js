import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { ProfileTree } from './ProfileTree';
import { fireEvent } from '@testing-library/react';

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

window.ResizeObserver = jest.fn(() => ({
  observe() {},
  unobserve() {},
}));

const onUnlink = jest.fn();
const onDelete = jest.fn();

const profileTreeProps = ({ allowUnlink, allowDelete, record }) => {
  return {
    linkingRules: { 
      allowUnlink,
      allowDelete,
      profilesAllowed: ['matchProfiles', 'actionProfiles'],
      childrenAllowed: ['actionProfiles', 'matchProfiles'],
      siblingsProhibited: { actionProfiles: ['matchProfile'] },
      columnsAllowed: {
        matchProfiles: [
          'name',
          'match',
        ],
        actionProfiles: [
          'name',
          'action',
        ],
      },
    },
    contentData: [{
      hasLoaded: true,
      records: [{
        id: 'testId',
        profileId: 'testProfileId',
          contentType: 'matchProfile',
          content: {
            id: 'testId',
            name: 'testName',
            description: 'testDescription1',
            tags: { tagList: ['testTag'] },
            match: 'testMatch',
          },
          description: 'testDescription2',
      }],
      contentType: 'matchProfile',
      content: {
        id: 'testId',
        name: 'testName'
      },
      childSnapshotWrappers: [{ 
        reactTo: 'MATCH',
        contentType: 'matchProfile',
        content: {
          id: 'testId',
          name: 'testName'
        },
        childSnapshotWrappers: [],
      }, { 
        reactTo: 'NON_MATCH',
        contentType: 'matchProfile',
        content: {
          id: 'testId',
          name: 'testName'
        },
        childSnapshotWrappers: [],
      }],
    }],
    okapi: {
      tenant: 'test-tenant',
      token: 'test-token',
      url: 'test-url',
    },
    resources: {
      jobProfile: {
        hasLoaded: true,
        records: [{
          name: 'testName',
          dataType: 'EDIFACT',
          metadata: {
            createdByUserId: 'testUserId',
            updateByUserId: 'testUserId',
          },
          description: 'testDescription',
        }],
      }
    },
    record,
  };
};

const renderProfileTree = ({
  linkingRules,
  contentData,
  okapi,
  resources,
  record,
}) => {
  const component = (
    <ProfileTree
      linkingRules={linkingRules}
      contentData={contentData}
      okapi={okapi}
      onUnlink={onUnlink}
      onDelete={onDelete}
      resources={resources}
      record={record}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ProfileTree', () => {
  afterAll(() => {
    delete window.ResizeObserver;
    onUnlink.mockClear();
    onDelete.mockClear();
  });

  it('should be rendered', () => {
    const { container, getByText, getAllByText, debug } = renderProfileTree(profileTreeProps({
      allowUnlink: true,
      allowDelete: false,
      record: null,
    }));

    expect(getAllByText('Match profile: "testName"')).toBeDefined();
    expect(getAllByText('For matches')).toBeDefined();
    expect(getAllByText('For non-matches')).toBeDefined();
  });

  describe('when clicking on delete button', () => {
    it('should called deleting function', () => {
      const { container, getByText, getAllByText, debug } = renderProfileTree(profileTreeProps({
        allowUnlink: false,
        allowDelete: true,
        record: null,
      }));
      const onDeleteButton = container.querySelector('button[data-test-profile-delete="true"]');

      fireEvent.click(onDeleteButton);

      const deleteButtonModal = getByText('Confirm');

      fireEvent.click(deleteButtonModal);

      expect(onDelete).toHaveBeenCalledTimes(1);
    });
  });

  describe('when clicking on unlink button', () => {
    it('should called unlinking function', () => {
      const { container, getByText, getAllByText, debug } = renderProfileTree(profileTreeProps({
        allowUnlink: true,
        allowDelete: false,
        record: null,
      }));
      const unlinkButton = container.querySelector('button[data-test-profile-unlink="true"]');
      debug(container, 300000);
      fireEvent.click(unlinkButton);

      const unlink = getByText('Confirm');

      fireEvent.click(unlink);

      expect(onUnlink).toHaveBeenCalledTimes(1);
    });
  });
});