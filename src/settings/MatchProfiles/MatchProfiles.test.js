import React, { act } from 'react';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../test/jest/__mock__';

import { Paneset } from '@folio/stripes/components';

import { Harness } from '../../../test/helpers';
import {
  buildMutator,
  buildStripes,
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { FIND_ALL_CQL } from '../../utils';
import { MatchProfiles, matchProfilesShape } from './MatchProfiles';

const stripes = buildStripes({
  discovery: {
    modules: { 'Inventory Storage Module': '1.0.0' },
  }
});

const history = createMemoryHistory();

history.push = jest.fn();

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
  location: {
    search: 'data-import-profiles/matchProfiles',
    pathname: 'data-import-profiles/matchProfiles',
  },
  label: <span>Match Profiles</span>,
};

const getMatchProfileComponent = ({
  resources,
  location,
  label,
}) => {
  return (
    <Harness translations={translationsProperties}>
      <Router>
        <Paneset>
          <MatchProfiles
            resources={resources}
            mutator={mutator}
            stripes={stripes}
            location={location}
            match={{ path: 'data-import-profiles/matchProfiles' }}
            unlink
            history={history}
            label={label}
            initialValues={{}}
            setList={noop}
          />
        </Paneset>
      </Router>
    </Harness>
  );
};
const renderMatchProfiles = props => {
  const component = () => getMatchProfileComponent(props);

  return render(renderWithReduxForm(component));
};

describe('MatchProfiles component', () => {
  it.skip('should be rendered with no axe errors', async () => {
    const { container } = renderMatchProfiles(matchProfilesProps);

    await act(async () => {
      await runAxeTest({ rootNode: container });
    });
  });

  it('should be rendered', () => {
    const { getByText } = renderMatchProfiles(matchProfilesProps);

    expect(getByText('Match Profiles')).toBeDefined();
  });

  describe('query string', () => {
    describe('when sort and query params are set', () => {
      it('should return correct query string', () => {
        const expectedQuery = `propsQuery AND (
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
        const props = { filterParams: { manifest: { query: null } } };
        const { query } = matchProfilesShape.manifest.records.params(null, null, null, null, props);

        expect(query.trim()).toEqual(FIND_ALL_CQL);
      });
    });
  });
});
