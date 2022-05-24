import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import {
  renderWithRedux,
  translationsProperties,
} from '../../../test/jest/helpers';

import { ProfileBranch } from './ProfileBranch';

window.ResizeObserver = jest.fn(() => ({
  observe() {},
  unobserve() {},
}));
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
    />
  );

  return renderWithIntl(renderWithRedux(component), translationsProperties);
};

describe('ProfileBranch', () => {
  afterAll(() => {
    delete window.ResizeObserver;
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
      const button = container.querySelector('.defaultCollapseButton');
      const expandedBlock = container.querySelector('.content-wrap.expanded');

      expect(expandedBlock).toHaveClass('expanded');

      fireEvent.click(button);

      expect(expandedBlock).not.toHaveClass('expanded');
    });
  });

  describe('when clicking on For non matches button', () => {
    it('content block should be expanded', () => {
      const { container } = renderProfileBranch(profileBranchProps);
      const button = container.querySelector('[aria-controls="accordion32"]');
      const expandedBlock = container.querySelector('#accordion32');

      expect(expandedBlock).toHaveClass('expanded');

      fireEvent.click(button);

      expect(expandedBlock).not.toHaveClass('expanded');
    });
  });
});
