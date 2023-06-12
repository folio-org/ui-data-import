import React from 'react';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../test/jest/__mock__';

import { Pluggable } from '@folio/stripes/core';

import {
  renderWithIntl,
  renderWithRedux,
  translationsProperties,
} from '../../../test/jest/helpers';

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

global.fetch = jest.fn();

const profileTreeProps = ({
  allowUnlink,
  allowDelete,
}) => {
  return {
    setData: noop,
    linkingRules: {
      allowUnlink,
      allowDelete,
      profilesAllowed: ['matchProfiles', 'actionProfiles'],
      childrenAllowed: ['actionProfiles', 'matchProfiles'],
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
          id: 'jobProfileId',
          dataType: 'EDIFACT',
          metadata: {
            createdByUserId: 'testUserId',
            updateByUserId: 'testUserId',
          },
          description: 'testDescription',
        }],
      },
    },
  };
};

const renderProfileTree = ({
  linkingRules,
  contentData,
  setData,
  okapi,
  resources,
}) => {
  const component = (
    <ProfileTree
      linkingRules={linkingRules}
      contentData={contentData}
      okapi={okapi}
      resources={resources}
      setData={setData}
      parentId="test parentId"
    />
  );

  return renderWithIntl(renderWithRedux(component), translationsProperties);
};

describe('ProfileTree component', () => {
  afterEach(() => {
    Pluggable.mockClear();
    global.fetch.mockClear();
  });

  afterAll(() => {
    delete window.ResizeObserver;
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderProfileTree(profileTreeProps({
      allowUnlink: false,
      allowDelete: true,
    }));

    await runAxeTest({ rootNode: container });
  });

  describe('when clicking on delete button', () => {
    it('modal window shod be closed', async () => {
      const {
        container,
        findByText,
      } = renderProfileTree(profileTreeProps({
        allowUnlink: false,
        allowDelete: true,
      }));
      const onDeleteButton = container.querySelector('button[data-test-profile-delete="true"]');

      fireEvent.click(onDeleteButton);

      const deleteButtonModal = await findByText('Confirm');

      fireEvent.click(deleteButtonModal);

      await waitFor(() => expect(deleteButtonModal).not.toBeVisible());
    });
  });

  it('should be rendered', async () => {
    global.fetch.mockReturnValue({
      ok: true,
      json: async () => ({
        id: 'testId',
        profileId: 'testProfileId',
        content: {
          id: 'testContentId',
          name: 'test name',
          metadata: {
            createdDate: '2023-04-06T08:55:23.034+00:00',
            createdByUserId: 'fed7855f-c3c1-54ea-acc1-0a62cb1d15d3',
            updatedByUserId: 'fed7855f-c3c1-54ea-acc1-0a62cb1d15d3',
            updatedDate: '2023-04-06T08:55:23.034+00:00',
          },
        }
      }),
    });

    const { findAllByText } = renderProfileTree(profileTreeProps({
      allowUnlink: true,
      allowDelete: false,
    }));

    Pluggable.mock.calls[0][0].onLink([{ id: 'testId' }]);

    await waitFor(() => expect(findAllByText('Match profile: "testName"')).toBeDefined());
  });
});
