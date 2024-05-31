import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../test/jest/__mock__';

import { Paneset } from '@folio/stripes/components';

import {
  buildMutator,
  buildOkapi,
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
history.push = jest.fn();

const okapi = buildOkapi();

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
  match: { path: '/settings/data-import/job-profiles' },
  location: {
    pathname: '/settings/data-import/job-profiles',
    search: '?sort=name',
  },
  refreshRemote: noop,
  label: <span>Job Profiles</span>,
  detailProps: { jsonSchemas: { identifierTypes: [] } },
};
const renderJobProfiles = ({
  match,
  location,
  label,
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
          label={label}
          unlink
          stripes={stripes}
          okapi={okapi}
          refreshRemote={refreshRemote}
          detailProps={detailProps}
          initialValues={{}}
          setList={noop}
        />
      </Paneset>
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('JobProfiles component', () => {
  afterEach(() => {
    history.push.mockClear();
  });

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

    expect(headers[0]).toHaveTextContent('Name');
    expect(headers[1]).toHaveTextContent('Tags');
    expect(headers[2]).toHaveTextContent('Updated');
    expect(headers[3]).toHaveTextContent('Updated by');
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

  describe('when creating new job profile if user close', () => {
    it('confirmation modal should appear', async () => {
      const {
        findByRole,
        getByText,
      } = renderJobProfiles(jobProfilesProps);
      const actionsButton = await findByRole('button', { name: /actions/i });
      fireEvent.click(actionsButton);

      const newJobProfileButton = getByText('New job profile');
      fireEvent.click(newJobProfileButton);

      const nameField = await findByRole('textbox', { name: /name/i });
      fireEvent.change(nameField, { target: { value: 'test value' } });

      const closeButton = getByText('Close');
      fireEvent.click(closeButton);

      expect(getByText('Are you sure?')).toBeInTheDocument();
    });
  });
});
