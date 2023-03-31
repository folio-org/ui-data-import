import React from 'react';
import faker from 'faker';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
  getByText as getByTextScreen,
} from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { ViewJobProfile } from '../ViewJobProfile';

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
}) => {
  const component = () => (
    <Router>
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
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe.skip('ViewJobProfile component', () => {
  // TODO: Create separate ticket to fix all the accesibility tests
  it.skip('should be rendered with no axe errors', async () => {
    const { container } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    await runAxeTest({ rootNode: container });
  });

  it('should render profile name correctly', async () => {
    const { findAllByText } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    await waitFor(() => expect(findAllByText('Inventory Single Record - Default Create Instance')).toBeDefined());
  });

  it('should display "Summary" accordion', async () => {
    const { findByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    await waitFor(() => expect(findByRole('button', { name: /summary/i })));
  });

  it('should display "Tags" accordion', async () => {
    const { findByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    await waitFor(() => expect(findByRole('button', { name: /tags/i })));
  });

  it('should display "Overview" accordion', async () => {
    const { findByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    await waitFor(() => expect(findByRole('button', { name: /overview/i })));
  });

  it('should display "Jobs using this profile" accordion', async () => {
    const { getByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    await waitFor(() => expect(getByRole('button', { name: /jobs using this profile/i })));
  });

  it('"Overview" section is open by default', async () => {
    const { findByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    await waitFor(() => expect(findByRole('button', {
      name: /overview/i,
      expanded: true,
    })));
  });

  describe('Jobs using this profile section', () => {
    it('should display correct jobs', async () => {
      const { findByText } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      await waitFor(() => expect(findByText('jobUsingProfile.mrc')).toBeDefined());
    });

    it('should display file names as a hotlink', async () => {
      const { findByText } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      await waitFor(() => expect(findByText('jobUsingProfile.mrc').href).toContain(`/data-import/job-summary/${fileId}`));
    });
  });

  describe('when clicked on "delete" action', () => {
    it('confirmation modal should appear', async () => {
      const {
        findByRole,
        findByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      fireEvent.click(await findByRole('button', { name: /actions/i }));
      fireEvent.click(await findByText('Delete'));

      await waitFor(() => expect(findByText('Delete job profile?')).toBeInTheDocument());
    });
  });

  describe('when clicked on "cancel" button', () => {
    it('confirmation modal should be closed', async () => {
      const {
        findByRole,
        findByText,
        queryByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      fireEvent.click(await findByRole('button', { name: /actions/i }));
      fireEvent.click(await findByText('Delete'));
      fireEvent.click(await findByText('Cancel'));

      await waitFor(() => expect(queryByText('Delete job profile?')).not.toBeInTheDocument());
    });
  });

  describe('after deleting a profile', () => {
    it('confirmation modal should be closed', async () => {
      const {
        findByRole,
        findAllByText,
        queryByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile));
      const actionsButton = await findByRole('button', { name: /actions/i });

      fireEvent.click(actionsButton);

      const firstDeleteButton = await findAllByText('Delete')[0];
      const secondDeleteButton = await findAllByText('Delete')[1];

      fireEvent.click(firstDeleteButton);
      fireEvent.click(secondDeleteButton);

      await waitFor(() => expect(queryByText('Delete job profile?')).not.toBeInTheDocument());
    });
  });

  describe('when user run job profile', () => {
    it('confirmation modal should appear', async () => {
      const {
        findByRole,
        findAllByText,
        queryByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile, ['run']));
      const actionsButton = await findByRole('button', { name: /actions/i });

      fireEvent.click(actionsButton);

      const runButton = await findAllByText('Run')[0];
      fireEvent.click(runButton);

      await waitFor(() => expect(queryByText('Are you sure you want to run this job?')).toBeInTheDocument());
    });
  });

  describe('when user confirm running job profile', () => {
    it('confirmation modal should be closed', async () => {
      const {
        findByRole,
        queryByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile, ['run']));
      const actionsButton = await findByRole('button', { name: /actions/i });

      fireEvent.click(actionsButton);

      const actionsMenu = document.querySelector('[class^=DropdownMenu]');

      fireEvent.click(getByTextScreen(actionsMenu, 'Run'));

      const confirmButton = document.querySelector('#clickable-run-job-profile-modal-confirm');

      fireEvent.click(confirmButton);

      await waitFor(() => expect(queryByText('Are you sure you want to run this job?')).not.toBeInTheDocument());
    });

    it('confirmation button should be disabled', async () => {
      const { findByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile, ['run']));
      const actionsButton = await findByRole('button', { name: /actions/i });

      fireEvent.click(actionsButton);

      const actionsMenu = document.querySelector('[class^=DropdownMenu]');

      fireEvent.click(getByTextScreen(actionsMenu, 'Run'));

      const confirmButton = document.querySelector('#clickable-run-job-profile-modal-confirm');

      fireEvent.click(confirmButton);

      expect(confirmButton).toBeDisabled();
    });
  });

  describe('when user cancel running job profile', () => {
    it('confirmation modal should be closed', async () => {
      const {
        findByRole,
        findAllByText,
        queryByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile, ['run']));

      const actionsButton = await findByRole('button', { name: /actions/i });

      fireEvent.click(actionsButton);

      const runButton = await findAllByText('Run')[0];

      fireEvent.click(runButton);

      const cancelButton = await findAllByText('Cancel')[0];

      fireEvent.click(cancelButton);

      await waitFor(() => expect(queryByText('Are you sure you want to run this job?')).not.toBeInTheDocument());
    });
  });
});
