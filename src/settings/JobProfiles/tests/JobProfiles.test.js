import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../test/jest/__mock__';

import { Paneset } from '@folio/stripes/components';

import {
  buildMutator,
  buildStripes,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';

import {
  createJobProfiles,
  jobProfilesShape,
} from '../JobProfiles';

const history = createMemoryHistory();

const stripes = buildStripes();

const mutator = buildMutator({
  jobProfiles: {
    POST: noop,
    PUT: noop,
    DELETE: noop,
  },
  query: {
    replace: noop,
    update: noop,
  },
});

const resources = {
  query: {
    query: '',
    sort: '-name',
  },
  jobProfiles: {
    failed: false,
    hasLoaded: true,
    isPending: false,
    other: { totalRecords: 1 },
    records: [
      {
        childProfiles: [],
        parentProfiles: [],
        dataType: 'MARC',
        deleted: false,
        description: 'Test Description 1',
        id: '80898dee-449f-44dd-9c8e-37d5eb469b1d',
        name: 'Test Name 1',
        tags: { tagList: [] },
        userInfo: {
          firstName: 'System1',
          lastName: 'Admin1',
          userName: 'admin1',
        },
        metadata: {
          createdByUserId: '00000000-0000-0000-0000-000000000000',
          createdDate: '2021-03-16T15:00:00.000+00:00',
          updatedByUserId: '00000000-0000-0000-0000-000000000000',
          updatedDate: '2021-03-16T15:00:00.000+00:00',
        },
      },
    ],
    resource: 'jobProfiles',
  },

};

const jobProfilesProps = {
  checkBoxList: {
    selectedRecords: new Set(),
    isAllChecked: false,
    selectAll: noop,
    deselectAll: noop,
    selectedRecord: noop,
    handleSelectAllCheckbox: noop,
  },
  match: { path: '/settings/data-import/job-profiles' },
  location: {
    pathname: '/settings/data-import/job-profiles',
    search: '?sort=name',
  },
  okapi: {
    tenant: 'tenant',
    token: 'token',
    url: '',
  },
  selectedRecord: {
    record: {},
    hasLoaded: false,
  },
  refreshRemote: noop,
  label: <span>Job Profiles</span>,
  setList: noop,
  detailProps: { jsonSchemas: { identifierTypes: [] } },
};
const renderJobProfiles = ({
  match,
  location,
  selectedRecord,
  setList,
  checkBoxList,
  label,
  okapi,
  refreshRemote,
  detailProps,
}) => {
  const JobProfiles = createJobProfiles();

  const component = () => (
    <Router>
      <Paneset>
        <JobProfiles
          resources={resources}
          mutator={mutator}
          history={history}
          match={match}
          location={location}
          selectedRecord={selectedRecord}
          setList={setList}
          checkboxList={checkBoxList}
          label={label}
          unlink
          stripes={stripes}
          okapi={okapi}
          refreshRemote={refreshRemote}
          detailProps={detailProps}
        />
      </Paneset>
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe.skip('<JobProfiles>', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderJobProfiles(jobProfilesProps);

    await runAxeTest({ rootNode: container });
  });

  it('should render correct amount of items', () => {
    const { getByText } = renderJobProfiles(jobProfilesProps);

    expect(getByText(/1 job profile/i)).toBeInTheDocument();
  });

  describe('query string', () => {
    it('should return correct query string', () => {
      const expected = 'cql.allRecords=1 AND' +
        ' (name="testQuery*" OR' +
        ' tags.tagList="testQuery*" OR' +
        ' description="testQuery*") sortBy name';

      const queryData = {
        query: {
          sort: 'name',
          query: 'testQuery',
        },
      };

      const { query } = jobProfilesShape.manifest.records.params(null, null, queryData, null);

      expect(query).toEqual(expected);
    });
  });

  it('should have correct columns order', () => {
    const { getAllByRole } = renderJobProfiles(jobProfilesProps);

    const headers = getAllByRole('columnheader');

    expect(headers[1]).toHaveTextContent('Name');
    expect(headers[2]).toHaveTextContent('Tags');
    expect(headers[3]).toHaveTextContent('Updated');
    expect(headers[4]).toHaveTextContent('Updated by');
  });

  describe('"Form" section', () => {
    it('"search" button is disabled by default', () => {
      const { getByRole } = renderJobProfiles(jobProfilesProps);

      expect(getByRole('button', { name: /search/i })).toBeDisabled();
    });

    describe('when data entered into search field', () => {
      it('"search" button is active', () => {
        const { getByRole } = renderJobProfiles(jobProfilesProps);

        const searchField = getByRole('searchbox', { name: /search job profiles/i });

        fireEvent.change(searchField, { target: { value: 'test value' } });
        fireEvent.click(getByRole('button', { name: /search/i }));

        expect(getByRole('button', { name: /search/i })).toBeEnabled();
      });
    });
  });

  describe('when "select all" checkbox is clicked', () => {
    it('should change its state to be selected', () => {
      const { getByRole } = renderJobProfiles(jobProfilesProps);

      const selectAll = getByRole('checkbox', { name: /select all items/i });

      fireEvent.click(selectAll);

      expect(selectAll).toBeChecked();
    });
  });

  describe('when creating new job profile if user close', () => {
    it('confirmation modal should appear', async () => {
      const {
        getByRole,
        getByText,
      } = renderJobProfiles(jobProfilesProps);
      const actionsButton = getByRole('button', { name: /actions/i });

      fireEvent.click(actionsButton);
      await waitFor(() => fireEvent.click(getByText('New job profile')));
      fireEvent.change(getByRole('textbox', { name: /name/i }), { target: { value: 'test value' } });
      await waitFor(() => fireEvent.click(getByText('Close')));

      await waitFor(() => expect(getByText(/areyousure/i)).toBeInTheDocument());
    });
  });
});
