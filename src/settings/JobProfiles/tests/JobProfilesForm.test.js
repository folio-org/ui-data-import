import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';

import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';

import {
  JobProfilesForm,
  fetchAssociations,
} from '../JobProfilesForm';
import { PROFILE_TYPES } from '../../../utils';

global.fetch = jest.fn();

const childWrappers = [
  {
    childSnapshotWrappers: [],
    content: {},
    contentType: PROFILE_TYPES.ACTION_PROFILE,
    id: 'testId',
    order: 0,
    profileId: 'testProfileId',
  },
];

const parentResources = {
  jobProfiles: {},
  query: {
    layer: 'duplicate',
    query: '',
    sort: 'name',
  },
};

const form = {
  change: noop,
  reset: noop,
  getState: jest.fn(() => ({
    values: {
      addedRelations: [],
      deletedRelations: [],
    },
  })),
};

const jobProfilesFormProps = idField => ({
  pristine: false,
  initialValues: {
    addedRelations: [],
    deletedRelations: [],
    id: idField,
    profile: {
      id: idField,
      dataType: 'MARC',
      deleted: false,
      description: 'test description',
      name: 'test name',
    },
    tags: { tagList: [] },
  },
  match: { path: '/settings/data-import/job-profiles' },
  submitting: false,
  stripes: {
    okapi: {
      url: '',
      tenant: '',
    },
  },
});

const renderJobProfilesForm = ({
  submitting,
  initialValues,
  stripes,
  match,
}) => {
  const component = () => (
    <Router>
      <JobProfilesForm
        submitting={submitting}
        initialValues={initialValues}
        childWrappers={childWrappers}
        handleSubmit={noop}
        form={form}
        onCancel={noop}
        stripes={stripes}
        parentResources={parentResources}
        transitionToParams={noop}
        match={match}
        onSubmit={jest.fn()}
      />
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('<JobProfilesForm>', () => {
  afterEach(() => {
    global.fetch.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  describe('should display correct title', () => {
    it('when creating new profile', () => {
      const { getAllByText } = renderJobProfilesForm(jobProfilesFormProps());

      expect(getAllByText(/new job profile/i)).toBeDefined();
    });

    it('when editing existing profile', () => {
      const { getAllByText } = renderJobProfilesForm(jobProfilesFormProps('testId'));

      expect(getAllByText(/edit/i, { exact: false })).toBeDefined();
    });
  });

  it('fetches associated jobs correctly', async () => {
    const expected = [{ contentType: PROFILE_TYPES.ACTION_PROFILE }];

    global.fetch.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ childSnapshotWrappers: expected }),
    });

    expect(await fetchAssociations({ url: '/test-path' }, 'testId')).toEqual(expected);
  });

  it('User can change "Accepted data type"', () => {
    const {
      container,
      getByRole,
    } = renderJobProfilesForm(jobProfilesFormProps());

    fireEvent.change(getByRole('combobox', { name: /accepted data type/i }), { target: { value: 'EDIFACT' } });

    expect(container.querySelector('option[value="EDIFACT"]').selected).toBeTruthy();
  });

  describe('when input fields filled with values', () => {
    it('"Save as profile & Close" button should be active', async () => {
      const { getByRole } = renderJobProfilesForm(jobProfilesFormProps());

      fireEvent.change(getByRole('textbox', { name: /name/i }), { target: { value: 'test value' } });
      fireEvent.click(getByRole('button', { name: /save as profile & close/i }));

      expect(getByRole('button', { name: /save as profile & close/i })).toBeEnabled();
    });
  });
});
