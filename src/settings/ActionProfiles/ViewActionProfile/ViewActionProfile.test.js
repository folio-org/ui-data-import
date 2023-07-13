import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import { noop } from 'lodash';
import { createMemoryHistory } from 'history';

import {
  buildStripes,
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { ViewActionProfile } from './ViewActionProfile';

const history = createMemoryHistory();

history.push = jest.fn();

const stripes = buildStripes();

const actionProfileRecord = (
  hasLoaded = true,
  name = 'testName',
  description = 'testDescription',
  createdByUserId = 'testUserId',
  updatedByUserId = 'testUserId',
) => ({
  actionProfileView: {
    records: [{
      parentProfiles: [],
      childProfiles: [],
      action: 'CREATE',
      folioRecord: 'ORDER',
      name,
      description,
      id: 'testId',
      metadata: {
        createdDate: '2020-08-13T14:44:00.000+00:00',
        createdByUserId,
        createdByUsername: 'System',
        updatedDate: '2020-08-13T14:44:00.000+00:00',
        updatedByUserId,
        updatedByUsername: 'System',
      },
    }],
    hasLoaded,
  },
});

const viewActionProfileProps = ({ actionProfileView }) => ({
  resources: { actionProfileView },
  location: {
    search: '/test-path',
    pathname: '/test-path',
  },
  tagsEnabled: true,
});

const renderViewActionProfile = ({
  tagsEnabled,
  location,
  resources,
}) => {
  const component = (
    <Router>
      <ViewActionProfile
        history={history}
        onClose={noop}
        onDelete={noop}
        tagsEnabled={tagsEnabled}
        location={location}
        resources={resources}
        stripes={stripes}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ViewActionProfiles component', () => {
  afterEach(() => {
    history.push.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderViewActionProfile(viewActionProfileProps(actionProfileRecord()));

    await runAxeTest({ rootNode: container });
  });

  it('profile name should be rendered correctly', () => {
    const { getAllByText } = renderViewActionProfile(viewActionProfileProps(actionProfileRecord()));

    expect(getAllByText('testName')).toBeDefined();
  });

  describe('when click on delete action button', () => {
    it('modal window should be shown', () => {
      const { getByText } = renderViewActionProfile(viewActionProfileProps(actionProfileRecord(true, null, null, null, null)));

      fireEvent.click(getByText('Actions'));
      fireEvent.click(getByText('Delete'));

      expect(getByText('Delete action profile?')).toBeDefined();
    });
  });

  describe('when delete action profile', () => {
    it('modal window should be closed', async () => {
      const {
        queryByText,
        getAllByText,
        getByText,
      } = renderViewActionProfile(viewActionProfileProps(actionProfileRecord()));

      fireEvent.click(getByText('Actions'));

      const deleteActionButton = getAllByText('Delete')[0];

      await waitFor(() => fireEvent.click(deleteActionButton));

      const deleteModalButton = getAllByText('Delete')[1];

      fireEvent.click(deleteModalButton);

      await waitFor(() => expect(queryByText('Delete action profile?')).toBeNull());
    });
  });

  describe('when cancel deleting record', () => {
    it('modal window should be closed', async () => {
      const {
        queryByText,
        getByText,
      } = renderViewActionProfile(viewActionProfileProps(actionProfileRecord()));

      fireEvent.click(getByText('Actions'));
      fireEvent.click(getByText('Delete'));
      fireEvent.click(getByText('Cancel'));

      await waitFor(() => expect(queryByText('Delete action profile?')).toBeNull());
    });
  });

  describe('when action profile is loading', () => {
    it('spinner should be shown', () => {
      const { getByText } = renderViewActionProfile(viewActionProfileProps(actionProfileRecord(false)));

      expect(getByText('Loading')).toBeDefined();
    });
  });

  describe('when action profile doesn`t exist', () => {
    it('spinner should be shown', () => {
      const { getByText } = renderViewActionProfile(viewActionProfileProps({ actionProfile: null }));

      expect(getByText('Loading')).toBeDefined();
    });
  });

  describe('when click on deleting button twice', () => {
    it('modal window should be closed', async () => {
      const {
        queryByText,
        getAllByText,
        getByText,
      } = renderViewActionProfile(viewActionProfileProps(actionProfileRecord()));

      fireEvent.click(getByText('Actions'));
      const deleteActionButton = getAllByText('Delete')[0];

      fireEvent.click(deleteActionButton);

      const deleteModalButton = getAllByText('Delete')[1];

      fireEvent.click(deleteModalButton);

      fireEvent.click(deleteModalButton);

      await waitFor(() => expect(queryByText('Delete action profile?')).toBeNull());
    });
  });
});
