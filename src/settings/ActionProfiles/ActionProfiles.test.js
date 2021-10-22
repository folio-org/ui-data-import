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
        const expectedQuery = 'cql.allRecords=1 AND ' +
        '(id="" NOT id=="d0ebba8a-2f0f-11eb-adc1-0242ac120002") AND ' +
        '(id="" NOT id=="cddff0e1-233c-47ba-8be5-553c632709d9") AND ' +
        '(id="" NOT id=="6aa8e98b-0d9f-41dd-b26f-15658d07eb52") AND ' +
        '(id="" NOT id=="f8e58651-f651-485d-aead-d2fa8700e2d1") AND ' +
        '(id="" NOT id=="adbe1e5c-7796-4902-b18e-794b1d58caac") AND (\n' +
        '  name="testQuery*" OR\n' +
        '  action="testQuery*" OR\n' +
        '  folioRecord="testQuery*" OR\n' +
        '  tags.tagList="testQuery*"\n' +
        ') sortBy name';
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
        const expectedQuery = 'cql.allRecords=1 AND ' +
        '(id="" NOT id=="d0ebba8a-2f0f-11eb-adc1-0242ac120002") AND ' +
        '(id="" NOT id=="cddff0e1-233c-47ba-8be5-553c632709d9") AND ' +
        '(id="" NOT id=="6aa8e98b-0d9f-41dd-b26f-15658d07eb52") AND ' +
        '(id="" NOT id=="f8e58651-f651-485d-aead-d2fa8700e2d1") AND ' +
        '(id="" NOT id=="adbe1e5c-7796-4902-b18e-794b1d58caac")';
        const { query } = actionProfilesShape.manifest.records.params();

        expect(query.trim()).toEqual(expectedQuery);
      });
    });
  });
});
