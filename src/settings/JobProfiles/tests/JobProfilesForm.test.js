import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';

import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { JobProfilesForm } from '../JobProfilesForm';

const jobProfilesFormProps = id => ({
  pristine: false,
  initialValues: {
    id,
    profile: {
      id,
      dataType: 'MARC',
      deleted: false,
      description: 'test description',
      name: 'Default - Name',
    },
  },
  parentResources: {
    query: {
      layer: 'edit',
      query: '',
      sort: 'name',
    },
    jobProfiles: {
      hasLoaded: true,
      failed: false,
      isPending: false,
      pendingMutations: [],
      failedMutations: [],
      successfulMutations: [],
      other: { totalRecords: 1 },
      records: [{
        childProfiles: [],
        dataType: 'MARC',
        deleted: false,
        description: 'test description 1',
        id: 'id1',
        metadata: {
          createdDate: '2021-01-14T14:00:00.000+00:00',
          createdByUserId: '00000000-0000-0000-0000-000000000000',
          updatedDate: '2021-01-14T15:00:00.462+00:00',
          updatedByUserId: '00000000-0000-0000-0000-000000000000',
        },
        name: 'name1',
        parentProfiles: [],
        userInfo: {
          firstName: 'System',
          lastName: 'System',
          userName: 'System',
        },
      }],
    },
  },
  match: { path: '/settings/data-import/job-profiles' },
  onCancel: noop,
  handleSubmit: noop,
  childWrappers: [{
    childSnapshotWrappers: [
      {
        childSnapshotWrappers: [],
        content: {
          id: 'id2',
          name: 'name2',
          description: 'description',
          incomingRecordType: 'MARC_BIBLIOGRAPHIC',
          existingRecordType: 'INSTANCE',
        },
        contentType: 'MAPPING_PROFILE',
        id: 'id3',
        order: 0,
        profileId: 'id3',
      },
    ],
    content: {
      id: 'id4',
      name: 'name4',
      description: 'description',
      action: 'EDIT',
      folioRecord: 'INSTANCE',
      metadata: {
        createdByUserId: '00000000-0000-0000-0000-000000000000',
        createdDate: '2021-01-14T14:00:00.000+00:00',
        updatedByUserId: '00000000-0000-0000-0000-000000000000',
        updatedDate: '2021-01-14T15:00:00.462+00:00',
      },
    },
    contentType: 'ACTION_PROFILE',
    id: 'id5',
    order: 0,
    profileId: 'id6',
  }],
  form: {
    change: noop,
    reset: noop,
    getState: jest.fn(() => ({
      values: {
        addedRelations: [],
        deletedRelations: [],
      },
    })),
  },
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
  childWrappers,
  handleSubmit,
  form,
  onCancel,
  stripes,
  parentResources,
  match,
}) => {
  const component = () => (
    <Router>
      <JobProfilesForm
        submitting={submitting}
        initialValues={initialValues}
        childWrappers={childWrappers}
        handleSubmit={handleSubmit}
        form={form}
        onCancel={onCancel}
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
    jest.clearAllTimers();
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

  it('User can change "Accepted data type"', async () => {
    const {
      getByRole,
      getByText,
    } = renderJobProfilesForm(jobProfilesFormProps());

    fireEvent.change(getByRole('combobox', { name: /accepted data type/i }),
      { target: { value: 'EDIFACT' } });

    await waitFor(() => expect(getByText('EDIFACT')).toBeInTheDocument());
  });

  describe('when input fields filled with values', () => {
    it('"Save as profile & Close" button should be active', async () => {
      const { getByRole } = renderJobProfilesForm(jobProfilesFormProps());

      fireEvent.change(getByRole('textbox', { name: /name/i }), { target: { value: 'test value' } });
      await waitFor(() => fireEvent.click(getByRole('button', { name: /save as profile & close/i })));

      expect(getByRole('button', { name: /save as profile & close/i })).toBeEnabled();
    });
  });
});
