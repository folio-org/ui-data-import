import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';

import {
  buildResources,
  buildMutator,
  Harness,
} from '@folio/stripes-data-transfer-components/test/helpers';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import {
  FIND_ALL_CQL,
  OCLC_MATCH_EXISTING_SRS_RECORD_ID,
  OCLC_MATCH_NO_SRS_RECORD_ID,
} from '../../utils';
import { matchProfilesShape } from '.';
import { MatchProfiles } from './MatchProfiles';

/* jest.mock('../../components', () => ({
  ...jest.requireActual('../../components'),
  ListView: jest.fn(() => <span>ListView</span>),
})); */

const history = createMemoryHistory();

history.push = jest.fn();

const resources = buildResources({
  modules: {
    records: [{
      name: 'Inventory Storage Module',
      id: 'testId',
    }],
  },
});
const mutator = buildMutator({
  matchProfiles: {
    POST: noop,
    PUT: noop,
  },
  query: {
    replace: jest.fn(),
    update: jest.fn(),
  },
  resultCount: { replace: jest.fn() },
});
const matchProfilesProps = {
  resources: {
    modules: {
      records: [{
        name: 'Inventory Storage Module',
        id: 'testId',
      }],
    },
  },
  stripes: {
    okapi: {
      tenant: 'test-tenant',
      token: 'test-token',
      url: 'test-url',
    },
  },
  location: {
    search: 'data-import-profiles/matchProfiles',
    pathname: 'data-import-profiles/matchProfiles',
  },
  label: <span>Match Profiles</span>,
  selectedRecord: {
    record: null,
    hasLoaded: false,
  },
  checkboxList: {
    selectedRecords: new Set(['testId1']),
    isAllSelected: false,
    selectRecord: noop,
    selectAll: noop,
    deselectAll: noop,
    handleSelectAllCheckbox: noop,
  },
};
/* const matchProfilesProps2 = {
  resources: {
    modules: {
      records: []
    },
  },
  stripes: {
    okapi: {
      tenant: 'test-tenant',
      token: 'test-token',
      url: 'test-url',
    }
  },
  location: {
    search: 'data-import-profiles/matchProfiles',
    pathname: 'data-import-profiles/matchProfiles',
  },
  match: { path: 'data-import-profiles/matchProfiles' },
  label: <span>Match Profiles</span>,
  selectedRecord: {
    record: null,
    hasLoaded: false,
  },
  checkboxList: {
    selectedRecords: new Set(['testId1']),
    isAllSelected: false,
    selectRecord: noop,
    selectAll: noop,
    deselectAll: noop,
    handleSelectAllCheckbox: noop,
  },
}; */
const MatchProfilesComponent = (props) => {
  const {
    stripes,
    location,
    label,
    selectedRecord,
    checkboxList,
  } = props;

  return renderWithReduxForm(
    <Harness translations={translationsProperties}>
      <Router>
        <MatchProfiles
          resources={resources}
          mutator={mutator}
          stripes={stripes}
          location={location}
          match={{ path: 'data-import-profiles/matchProfiles' }}
          unlink={true}
          history={history}
          label={label}
          selectedRecord={selectedRecord}
          checkboxList={checkboxList}
          setList={noop}
        />
      </Router>
    </Harness>
  );
};
const renderMatchProfiles = ({
  stripes,
  location,
  label,
  selectedRecord,
  checkboxList,
}) => {
  return render(
    <MatchProfilesComponent
      stripes={stripes}
      location={location}
      label={label}
      selectedRecord={selectedRecord}
      checkboxList={checkboxList}
    />);
};

describe('MatchProfiles', () => {
  it('should be rendered', () => {
    const { rerender, debug } = renderMatchProfiles(matchProfilesProps);

    debug();

  rerender(renderMatchProfiles(matchProfilesProps));
  });

  describe('query string', () => {
    describe('when sort and query params are set', () => {
      it('should return correct query string', () => {
        const expectedQuery = `propsQuery AND (id="" NOT id=="${OCLC_MATCH_EXISTING_SRS_RECORD_ID}") AND (id="" NOT id=="${OCLC_MATCH_NO_SRS_RECORD_ID}") AND (
  name="testQuery*" OR
  existingRecordType="testQuery*" OR
  field="testQuery*" OR
  fieldMarc="testQuery*" OR
  fieldNonMarc="testQuery*" OR
  existingStaticValueType="testQuery*" OR
  tags.tagList="testQuery*"
) sortBy name`;
        const queryData = {
          query: {
            sort: 'name',
            query: 'testQuery',
          },
        };
        const props = { filterParams: { manifest: { query: 'propsQuery' } } };

        const { query } = matchProfilesShape.manifest.records.params(null, null, queryData, null, props);

        expect(query.trim()).toEqual(expectedQuery);
      });
    });

    describe('when sort and query params are not set', () => {
      it('should return correct query string', () => {
        const expectedQuery = `${FIND_ALL_CQL} AND (id="" NOT id=="${OCLC_MATCH_EXISTING_SRS_RECORD_ID}") AND (id="" NOT id=="${OCLC_MATCH_NO_SRS_RECORD_ID}")`;
        const props = { filterParams: { manifest: { query: null } } };
        const { query } = matchProfilesShape.manifest.records.params(null, null, null, null, props);

        expect(query.trim()).toEqual(expectedQuery);
      });
    });
  });
});
