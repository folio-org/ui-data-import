import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { Pluggable } from '@folio/stripes/core';
import { translationsProperties } from '../../../test/jest/helpers';

import { ProfileTree } from './ProfileTree';

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

const profileTreeProps = ({
  allowUnlink,
  allowDelete,
  record,
}) => {
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
        name: 'testName',
      },
      childSnapshotWrappers: [{
        reactTo: 'MATCH',
        contentType: 'matchProfile',
        content: {
          id: 'testId',
          name: 'testName',
        },
        childSnapshotWrappers: [],
      }, {
        reactTo: 'NON_MATCH',
        contentType: 'matchProfile',
        content: {
          id: 'testId',
          name: 'testName',
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
      },
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
      resources={resources}
      record={record}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ProfileTree', () => {
  afterEach(() => {
    delete window.ResizeObserver;
    Pluggable.mockClear();
  });

  describe('when clicking on delete button', () => {
    it('modal window shod be closed', () => {
      const {
        container,
        getByText,
      } = renderProfileTree(profileTreeProps({
        allowUnlink: false,
        allowDelete: true,
        record: null,
      }));
      const onDeleteButton = container.querySelector('button[data-test-profile-delete="true"]');

      fireEvent.click(onDeleteButton);

      const deleteButtonModal = getByText('Confirm');

      fireEvent.click(deleteButtonModal);

      expect(deleteButtonModal).not.toBeVisible();
    });
  });

  it('should be rendered', () => {
    const { getByText } = renderProfileTree(profileTreeProps({
      allowUnlink: true,
      allowDelete: false,
      record: null,
    }));

    Pluggable.mock.calls[0][0].onLink([{ id: 'testId' }]);

    expect(getByText('This list contains no items')).toBeDefined();
  });
});
