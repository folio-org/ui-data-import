import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/test/helpers';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { actionProfilesShape } from '.';
import { ActionProfiles } from './ActionProfiles';

import {
  OCLC_CREATE_INSTANCE_ACTION_ID,
  OCLC_UPDATE_INSTANCE_ACTION_ID,
  OCLC_CREATE_MARC_BIB_ACTION_ID,
  QUICKMARK_DERIVE_CREATE_BIB_ACTION_ID,
  QUICKMARK_DERIVE_CREATE_HOLDINGS_ACTION_ID,
} from '../../utils';

const testSet = new Set(['testId1']);

const history = createMemoryHistory();

history.push = jest.fn();

const resources = buildResources({
  query: {
    filters: 'testFilter',
    notes: true,
  },
  records: {
    hasLoaded: true,
    isPending: false,
    other: { totalRecords: 1 },
    successfulMutations: [{ record: { id: 'testId1' } }],
  },
  actionProfiles: { records: ['test1', 'test2'] },
});
const mutator = buildMutator({
  query: {
    replace: noop,
    update: noop,
  },
  resultCount: { replace: noop },
  actionProfiles: {
    POST: noop,
    PUT: noop,
  },
});

const actionProfilesProps = {
  location: {
    search: 'data-import-profiles/actionProfiles',
    pathname: 'data-import-profiles/actionProfiles',
  },
  unlink: true,
  match: { path: 'data-import-profiles/actionProfiles' },
  label: <span>Action Profiles</span>,
  selectedRecord: {
    record: null,
    hasLoaded: false,
  },
  checkboxList: {
    selectedRecords: testSet,
    isAllSelected: false,
    selectRecord: noop,
    selectAll: noop,
    deselectAll: noop,
    handleSelectAllCheckbox: noop,
  },
  setList: noop,
};

const renderActionProfiles = ({
  location,
  unlink,
  match,
  label,
  selectedRecord,
  checkboxList,
  setList,
}) => {
  const component = () => (
    <Router>
      <ActionProfiles
        resources={resources}
        mutator={mutator}
        location={location}
        unlink={unlink}
        match={match}
        history={history}
        label={label}
        selectedRecord={selectedRecord}
        checkboxList={checkboxList}
        setList={setList}
      />
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('ActionProfiles', () => {
  afterEach(() => {
    history.push.mockClear();
  });

  it('should be rendered', () => {
    const { getByText } = renderActionProfiles(actionProfilesProps);

    expect(getByText('Action Profiles')).toBeDefined();
    expect(getByText('Actions')).toBeDefined();
  });

  describe('query string', () => {
    describe('when sort and query params are set', () => {
      it('should return correct query string', () => {
        const expectedQuery = `cql.allRecords=1 AND (id="" NOT id=="${OCLC_CREATE_INSTANCE_ACTION_ID}") AND (id="" NOT id=="${OCLC_UPDATE_INSTANCE_ACTION_ID}") AND (id="" NOT id=="${OCLC_CREATE_MARC_BIB_ACTION_ID}") AND (id="" NOT id=="${QUICKMARK_DERIVE_CREATE_BIB_ACTION_ID}") AND (id="" NOT id=="${QUICKMARK_DERIVE_CREATE_HOLDINGS_ACTION_ID}") AND (
  name="testQuery*" OR
  action="testQuery*" OR
  folioRecord="testQuery*" OR
  tags.tagList="testQuery*"
) sortBy name`;
        const queryData = {
          query: {
            sort: 'name',
            query: 'testQuery',
          },
        };
        const { query } = actionProfilesShape.manifest.records.params(null, null, queryData, null);

        expect(query).toEqual(expectedQuery);
      });
    });

    describe('when sort and query params are  not set', () => {
      it('should return correct query string', () => {
        const expectedQuery = `cql.allRecords=1 AND (id="" NOT id=="${OCLC_CREATE_INSTANCE_ACTION_ID}") AND (id="" NOT id=="${OCLC_UPDATE_INSTANCE_ACTION_ID}") AND (id="" NOT id=="${OCLC_CREATE_MARC_BIB_ACTION_ID}") AND (id="" NOT id=="${QUICKMARK_DERIVE_CREATE_BIB_ACTION_ID}") AND (id="" NOT id=="${QUICKMARK_DERIVE_CREATE_HOLDINGS_ACTION_ID}")`;
        const { query } = actionProfilesShape.manifest.records.params();

        expect(query.trim()).toEqual(expectedQuery);
      });
    });
  });
});
