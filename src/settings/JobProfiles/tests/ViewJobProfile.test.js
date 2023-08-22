import React from 'react';
import faker from 'faker';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
  getByText as getByTextScreen,
  within
} from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { noop } from 'lodash';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { ViewJobProfile } from '../ViewJobProfile';
import { UploadingJobsContext } from '../../../components';

const defaultContext = {
  uploadConfiguration: {
    canUseObjectStorage: false,
  }
};

const multipartContext = {
  uploadConfiguration: {
    canUseObjectStorage: true,
  }
};

const jobProfile = {
  records: [
    {
      parentProfiles: [],
      childProfiles: [],
      dataType: 'MARC',
      name: 'Inventory Single Record - Default Create Instance',
      description: '',
      id: 'testId',
      metadata: {
        createdByUsername: 'System',
        updatedByUsername: 'System',
        createdByUserId: '',
        createdDate: '2021-03-16T15:00:00.000+00:00',
        updatedByUserId: '',
        updatedDate: '2021-03-16T15:00:00.000+00:00',
      },
      tags: { tagList: [] },
      userInfo: {
        firstName: 'System',
        lastName: 'System',
        userName: 'System',
      },
    }],
  hasLoaded: true,
};

const fileId = faker.random.uuid();

const viewJobProfileProps = (profile, actionMenuItems) => ({
  match: { params: { id: 'test id' } },
  resources: {
    jobProfileView: profile,
    jobsUsingThisProfile: {
      records: [{
        jobExecutions: [{
          id: fileId,
          fileName: 'jobUsingProfile.mrc',
          hrId: 20,
          completedDate: '2022-03-10T13:43:36.071+00:00',
          runBy: {
            firstName: 'firstName',
            lastName: 'lastName',
          },
          status: 'ERROR',
          jobPartNumber: 1,
          totalJobParts: 20,
        }],
      }],
      hasLoaded: true,
    },
  },
  history: {
    block: noop,
    push: noop,
    replace: noop,
  },
  location: {
    search: '',
    pathname: '',
  },
  actionMenuItems,
});

const renderViewJobProfile = ({
  history,
  match,
  location,
  resources,
  actionMenuItems,
  context = defaultContext
}) => {
  const component = () => (
    <Router>
      <UploadingJobsContext.Provider value={context}>
        <ViewJobProfile
          resources={resources}
          location={location}
          match={match}
          history={history}
          tagsEnabled
          onClose={noop}
          onDelete={noop}
          actionMenuItems={actionMenuItems}
          stripes={{
            okapi: { url: '' },
            hasPerm: () => true
          }}
        />
      </UploadingJobsContext.Provider>
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('<ViewJobProfile>', () => {
  // TODO: Create separate ticket to fix all the accesibility tests
  it.skip('should be rendered with no axe errors', async () => {
    const { container } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    await runAxeTest({ rootNode: container });
  });

  it('should render profile name correctly', () => {
    const { getAllByText } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    expect(getAllByText('Inventory Single Record - Default Create Instance')).toBeDefined();
  });

  it('should display "Summary" accordion', () => {
    const { getByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    expect(getByRole('button', { name: /summary/i }));
  });

  it('should display "Tags" accordion', () => {
    const { getByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    expect(getByRole('button', { name: /tags/i }));
  });

  it('should display "Overview" accordion', () => {
    const { getByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    expect(getByRole('button', { name: /overview/i }));
  });

  it('should display "Jobs using this profile" accordion', () => {
    const { getByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    expect(getByRole('button', { name: /jobs using this profile/i }));
  });

  it('"Overview" section is open by default', () => {
    const { getByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    expect(getByRole('button', {
      name: /overview/i,
      expanded: true,
    }));
  });

  describe('Jobs using this profile section', () => {
    it('should display correct jobs', () => {
      const { getByText } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      expect(getByText('jobUsingProfile.mrc')).toBeDefined();
    });

    it('should display file names as a hotlink', () => {
      const { getByText } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      expect(getByText('jobUsingProfile.mrc').href).toContain(`/data-import/job-summary/${fileId}`);
    });

    it('should not display the "Job parts" column', () => {
      const { queryByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      expect(queryByRole('columnheader', { name: 'Job parts' })).not.toBeInTheDocument();
    });
  });

  describe('Jobs using this profile section - multipart capabilities', () => {
    it('should display the "Job parts" column', () => {
      const { getByRole } = renderViewJobProfile({ ...viewJobProfileProps(jobProfile), context: multipartContext });

      expect(getByRole('columnheader', { name: 'Job parts' })).toBeInTheDocument();
    });
  });

  describe('when clicked on "delete" action', () => {
    it('confirmation modal should appear', () => {
      const {
        getByRole,
        getByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      fireEvent.click(getByRole('button', { name: /actions/i }));
      fireEvent.click(getByText('Delete'));

      expect(getByText('Delete job profile?')).toBeInTheDocument();
    });
  });

  describe('when clicked on "cancel" button', () => {
    it('confirmation modal should be closed', async () => {
      const {
        getByRole,
        getByText,
        queryByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      fireEvent.click(getByRole('button', { name: /actions/i }));
      fireEvent.click(getByText('Delete'));
      fireEvent.click(getByText('Cancel'));

      await waitFor(() => expect(queryByText('Delete job profile?')).not.toBeInTheDocument());
    });
  });

  describe('after deleting a profile', () => {
    it('confirmation modal should be closed', async () => {
      const {
        getByRole,
        getAllByText,
        queryByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      fireEvent.click(getByRole('button', { name: /actions/i }));
      fireEvent.click(getAllByText('Delete')[0]);
      fireEvent.click(getAllByText('Delete')[1]);

      await waitFor(() => expect(queryByText('Delete job profile?')).not.toBeInTheDocument());
    });
  });

  describe('when user run job profile', () => {
    it('confirmation modal should appear', async () => {
      const {
        getByRole,
        getAllByText,
        queryByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile, ['run']));

      fireEvent.click(getByRole('button', { name: /actions/i }));
      fireEvent.click(getAllByText('Run')[0]);

      await waitFor(() => expect(queryByText('Are you sure you want to run this job?')).toBeInTheDocument());
    });
  });

  describe('when user confirm running job profile', () => {
    it('confirmation modal should be closed', async () => {
      const {
        getByRole,
        queryByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile, ['run']));

      fireEvent.click(getByRole('button', { name: /actions/i }));

      const actionsMenu = document.querySelector('[class^=DropdownMenu]');

      fireEvent.click(getByTextScreen(actionsMenu, 'Run'));

      const confirmButton = document.querySelector('#clickable-run-job-profile-modal-confirm');

      fireEvent.click(confirmButton);

      await waitFor(() => expect(queryByText('Are you sure you want to run this job?')).not.toBeInTheDocument());
    });

    it('confirmation button should be disabled', async () => {
      const { getByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile, ['run']));

      fireEvent.click(getByRole('button', { name: /actions/i }));

      const actionsMenu = document.querySelector('[class^=DropdownMenu]');

      fireEvent.click(getByTextScreen(actionsMenu, 'Run'));

      const confirmationModal = getByRole('dialog');

      const confirmButton = within(confirmationModal).getByRole('button', { name: /run/i });

      fireEvent.click(confirmButton);

      await waitFor(() => expect(within(confirmationModal).getByRole('button', { name: /run/i })).toBeDisabled());
    });
  });

  describe('when user cancel running job profile', () => {
    it('confirmation modal should be closed', async () => {
      const {
        getByRole,
        getAllByText,
        queryByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile, ['run']));

      fireEvent.click(getByRole('button', { name: /actions/i }));
      fireEvent.click(getAllByText('Run')[0]);
      fireEvent.click(getAllByText('Cancel')[0]);

      await waitFor(() => expect(queryByText('Are you sure you want to run this job?')).not.toBeInTheDocument());
    });
  });
});
