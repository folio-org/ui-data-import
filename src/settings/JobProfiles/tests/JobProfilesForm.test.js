import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { fireEvent } from '@testing-library/react';

import { noop } from 'lodash';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import {
  JobProfilesForm,
  fetchAssociations,
} from '../JobProfilesForm';
import {
  LAYER_TYPES,
  PROFILE_TYPES,
} from '../../../utils';

global.fetch = jest.fn();

const childWrappers = [
  {
    childSnapshotWrappers: [{
      content: { name: 'Attached action profile' },
      contentType: PROFILE_TYPES.ACTION_PROFILE,
      id: 'testId',
      profileId: 'testProfileId',
      order: 0,
      childSnapshotWrappers: [],
    }],
  },
];

const mutator = {
  childWrappers: {
    GET: jest.fn().mockResolvedValue(childWrappers),
    reset: jest.fn(),
  },
};

const resources = {
  childWrappers: { records: childWrappers },
};

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

const jobProfilesFormProps = ({
  idField,
  layerType,
}) => ({
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
  layerType,
});

const renderJobProfilesForm = ({
  submitting,
  initialValues,
  stripes,
  match,
  layerType,
}) => {
  const component = () => (
    <Router>
      <JobProfilesForm
        submitting={submitting}
        initialValues={initialValues}
        handleSubmit={noop}
        form={form}
        onCancel={noop}
        stripes={stripes}
        parentResources={parentResources}
        transitionToParams={noop}
        match={match}
        onSubmit={jest.fn()}
        layerType={layerType}
        mutator={mutator}
        resources={resources}
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

  describe('when profile is duplicated', () => {
    describe('and there are attached profiles', () => {
      it('should initialize the form with these profiles', () => {
        const { getByText } = renderJobProfilesForm(jobProfilesFormProps({ layerType: LAYER_TYPES.DUPLICATE }));

        expect(getByText('Action profile: "Attached action profile"')).toBeDefined();
      });
    });
  });

  describe('should display correct title', () => {
    it('when creating new profile', () => {
      const { getAllByText } = renderJobProfilesForm(jobProfilesFormProps({}));

      expect(getAllByText(/new job profile/i)).toBeDefined();
    });

    it('when editing existing profile', () => {
      const { getAllByText } = renderJobProfilesForm(jobProfilesFormProps({ idField: 'testId' }));

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
    } = renderJobProfilesForm(jobProfilesFormProps({}));

    fireEvent.change(getByRole('combobox', { name: /accepted data type/i }), { target: { value: 'EDIFACT' } });

    expect(container.querySelector('option[value="EDIFACT"]').selected).toBeTruthy();
  });

  describe('when input fields filled with values', () => {
    it('"Save as profile & Close" button should be active', async () => {
      global.fetch
        .mockReturnValue(Promise.resolve({
          status: 200,
          ok: true,
          json: async () => ({}),
        }));

      const { getByRole } = renderJobProfilesForm(jobProfilesFormProps({ layerType: LAYER_TYPES.EDIT }));

      fireEvent.change(getByRole('textbox', { name: /name/i }), { target: { value: 'test value' } });
      fireEvent.click(getByRole('button', { name: /save as profile & close/i }));

      expect(getByRole('button', { name: /save as profile & close/i })).toBeEnabled();
    });
  });
});
