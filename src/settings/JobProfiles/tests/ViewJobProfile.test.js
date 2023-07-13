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

import {
  buildStripes,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { STATUS_CODES } from '../../../utils';

import { ViewJobProfile } from '../ViewJobProfile';

global.fetch = jest.fn();

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
  failed: { httpStatus: 200 },
};

const fileId = faker.random.uuid();

const stripes = buildStripes();

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
    go: noop,
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
        stripes={stripes}
      />
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('ViewJobProfile component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: STATUS_CODES.OK,
      json: async () => ({}),
    });
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    await runAxeTest({ rootNode: container });
  });

  it('should render profile name correctly', async () => {
    const { findAllByText } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    const profileName = await findAllByText('Inventory Single Record - Default Create Instance');

    expect(profileName).toBeDefined();
  });

  it('should display "Summary" accordion', async () => {
    const { findByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    const summaryAccordion = await findByRole('button', { name: /summary/i });

    expect(summaryAccordion).toBeInTheDocument();
  });

  it('should display "Tags" accordion', async () => {
    const { findByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    const tagsAccordion = await findByRole('button', { name: /tags/i });

    expect(tagsAccordion).toBeInTheDocument();
  });

  it('should display "Overview" accordion', async () => {
    const { findByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    const overviewAccordion = await findByRole('button', { name: /overview/i });

    expect(overviewAccordion).toBeInTheDocument();
  });

  it('should display "Jobs using this profile" accordion', async () => {
    const { findByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    const jobsUsingAccordion = await findByRole('button', { name: /jobs using this profile/i });

    expect(jobsUsingAccordion).toBeInTheDocument();
  });

  it('"Overview" section is open by default', async () => {
    const { findByRole } = renderViewJobProfile(viewJobProfileProps(jobProfile));

    const expandedOverviewSection = await findByRole('button', {
      name: /overview/i,
      expanded: true,
    });

    expect(expandedOverviewSection).toBeInTheDocument();
  });

  describe('Jobs using this profile section', () => {
    it('should display correct jobs', async () => {
      const { findByText } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      await waitFor(() => expect(findByText('jobUsingProfile.mrc')).toBeDefined());
    });

    it('should display file names as a hotlink', async () => {
      const { findByText } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      const fileNameHotLink = await findByText('jobUsingProfile.mrc');

      expect(fileNameHotLink.href).toContain(`/data-import/job-summary/${fileId}`);
    });
  });

  describe('when clicked on "delete" action', () => {
    it('confirmation modal should appear', async () => {
      const {
        findByRole,
        findByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile));

      const actionsButton = await findByRole('button', { name: /actions/i });
      fireEvent.click(actionsButton);

      const deleteButton = await findByText('Delete');
      fireEvent.click(deleteButton);

      const confirmationText = await findByText('Delete job profile?');

      expect(confirmationText).toBeInTheDocument();
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

      const firstDeleteButton = await findAllByText('Delete');
      fireEvent.click(firstDeleteButton[0]);

      const secondDeleteButton = await findAllByText('Delete');
      fireEvent.click(secondDeleteButton[1]);

      await waitFor(() => expect(queryByText('Delete job profile?')).not.toBeInTheDocument());
    });
  });

  describe('when job profile was deleted', () => {
    it('should render information that it was deleted', () => {
      const { getByText } = renderViewJobProfile(viewJobProfileProps({
        records: [],
        hasLoaded: false,
        failed: { httpStatus: STATUS_CODES.NOT_FOUND },
      }));

      expect(getByText('Job profile deleted')).toBeInTheDocument();
      expect(getByText('Not available - this job profile has been deleted')).toBeInTheDocument();
      expect(getByText('Return to previous screen')).toBeInTheDocument();
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

      const runButton = await findAllByText('Run');
      fireEvent.click(runButton[0]);

      await waitFor(() => expect(queryByText('Are you sure you want to run this job?')).toBeInTheDocument());
    });
  });

  describe('when user confirm running job profile', () => {
    it('confirmation modal should be closed', async () => {
      const {
        container,
        findByText,
      } = renderViewJobProfile(viewJobProfileProps(jobProfile, ['run']));

      const actionsButton = await findByText('Actions');
      fireEvent.click(actionsButton);

      const runButton = await findByText('Run');
      fireEvent.click(runButton);

      const confirmButton = document.querySelector('#clickable-run-job-profile-modal-confirm');
      fireEvent.click(confirmButton);

      const modalTitle = container.querySelector('#run-job-profile-modal-label');

      expect(modalTitle).not.toBeInTheDocument();
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

      const runButton = await findAllByText('Run');
      fireEvent.click(runButton[0]);

      const cancelButton = await findAllByText('Cancel');
      fireEvent.click(cancelButton[0]);

      await waitFor(() => expect(queryByText('Are you sure you want to run this job?')).not.toBeInTheDocument());
    });
  });
});
