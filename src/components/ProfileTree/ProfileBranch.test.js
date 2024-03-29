import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  renderWithRedux,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { ProfileBranch } from './ProfileBranch';

const profileBranchProps = {
  linkingRules: {
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
  recordData: {
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
  },
  parentRecordData: {
    contentType: 'matchProfile',
    content: {
      id: 'testId',
      name: 'testName',
    },
    childSnapshotWrappers: [{ reactTo: 'MATCH' }, { reactTo: 'NON_MATCH' }],
  },
  parentSectionKey: 'jobProfiles.current.testId.data.match',
  record: null,
  parentSectionData: [{ reactTo: 'MATCH' }],
  setParentSectionData: jest.fn(),
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
};

const renderProfileBranch = ({
  linkingRules,
  recordData,
  parentRecordData,
  parentSectionKey,
  parentSectionData,
  setParentSectionData,
  resources,
  okapi,
  record,
}) => {
  const component = (
    <ProfileBranch
      linkingRules={linkingRules}
      recordData={recordData}
      parentRecordData={parentRecordData}
      parentSectionKey={parentSectionKey}
      parentSectionData={parentSectionData}
      setParentSectionData={setParentSectionData}
      resources={resources}
      okapi={okapi}
      record={record}
      profileType="test profile type"
    />
  );

  return renderWithIntl(renderWithRedux(component), translationsProperties);
};

describe('ProfileBranch component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderProfileBranch(profileBranchProps);

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered', () => {
    const { getAllByText } = renderProfileBranch(profileBranchProps);

    expect(getAllByText('Match profile: "testName"')).toBeDefined();
    expect(getAllByText('For matches')).toBeDefined();
    expect(getAllByText('For non-matches')).toBeDefined();
  });

  describe('when clicking on For matches button', () => {
    it('content block should be collapsed', () => {
      const { container } = renderProfileBranch(profileBranchProps);
      const button = container.querySelectorAll('.defaultCollapseButton')[0];
      const expandedBlock = container.querySelectorAll('.content-wrap.expanded')[0];

      expect(expandedBlock).toHaveClass('expanded');

      fireEvent.click(button);

      expect(expandedBlock).not.toHaveClass('expanded');
    });
  });

  describe('when clicking on For non-matches button', () => {
    it('content block should be expanded', () => {
      const { container } = renderProfileBranch(profileBranchProps);
      const button = container.querySelectorAll('.defaultCollapseButton')[1];
      const expandedBlock = container.querySelectorAll('.content-wrap.expanded')[1];

      expect(expandedBlock).toHaveClass('expanded');

      fireEvent.click(button);

      expect(expandedBlock).not.toHaveClass('expanded');
    });
  });
});
