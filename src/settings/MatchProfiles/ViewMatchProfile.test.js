import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';

import { noop } from 'lodash';
import { createMemoryHistory } from 'history';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { ViewMatchProfile } from './ViewMatchProfile';

const history = createMemoryHistory();

history.push = jest.fn();

const matchProfileRecord = (
  hasLoaded = true,
  name = 'testName',
  description = 'testDescription',
) => ({
  matchProfile: {
    hasLoaded,
    records: [{
      id: 'testId',
      name,
      description,
      incomingRecordType: 'MARC_BIBLIOGRAPHIC',
      existingRecordType: 'INSTANCE',
      incomingMatchExpression: 'testIncomingRecordLabel',
      existingMatchExpression: 'testExistingRecordLabel',
      matchCriterion: 'EXACTLY_MATCHES',
      matchDetails: [{
        incomingRecordType: 'MARC_BIBLIOGRAPHIC',
        existingRecordType: 'INSTANCE',
        incomingMatchExpression: 'testIncomingRecordLabel',
        existingMatchExpression: 'testExistingRecordLabel',
        matchCriterion: 'EXACTLY_MATCHES',
      }],
    }],
  },
});
const viewMatchProfileProps = ({ matchProfile }) => ({
  resources: { matchProfile },
  match: { params: { id: 'testId' } },
  location: {
    search: '/test-path',
    pathname: '/test-path',
  },
  tagsEnabled: true,
});

const renderViewMatchProfile = ({
  resources,
  match,
  location,
  tagsEnabled,
}) => {
  const component = (
    <Router>
      <ViewMatchProfile
        resources={resources}
        match={match}
        location={location}
        tagsEnabled={tagsEnabled}
        history={history}
        onClose={noop}
        onDelete={noop}
        stripes={{ hasPerm: () => true }}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ViewMatchProfile', () => {
  afterEach(() => {
    history.push.mockClear();
  });

  it('match profile name should be rendered correctly', () => {
    const { getAllByText } = renderViewMatchProfile(viewMatchProfileProps(matchProfileRecord()));

    expect(getAllByText('testName')).toBeDefined();
  });

  describe('when click on delete action button', () => {
    it('modal window should be shown', () => {
      const { getByText } = renderViewMatchProfile(viewMatchProfileProps(matchProfileRecord(true, null, null)));

      fireEvent.click(getByText('Actions'));
      fireEvent.click(getByText('Delete'));

      expect(getByText('Delete match profile?')).toBeDefined();
    });
  });

  describe('when delete match profile', () => {
    it('modal window should be closed', async () => {
      const {
        queryByText,
        getAllByText,
        getByText,
      } = renderViewMatchProfile(viewMatchProfileProps(matchProfileRecord()));

      fireEvent.click(getByText('Actions'));

      const deleteActionButton = getAllByText('Delete')[0];

      await waitFor(() => fireEvent.click(deleteActionButton));

      const deleteModalButton = getAllByText('Delete')[1];

      fireEvent.click(deleteModalButton);

      await waitFor(() => expect(queryByText('Delete match profile?')).toBeNull());
    });
  });

  describe('when cancel deleting record', () => {
    it('modal window should be closed', async () => {
      const {
        queryByText,
        getByText,
      } = renderViewMatchProfile(viewMatchProfileProps(matchProfileRecord()));

      fireEvent.click(getByText('Actions'));
      fireEvent.click(getByText('Delete'));
      fireEvent.click(getByText('Cancel'));

      await waitFor(() => expect(queryByText('Delete match profile?')).toBeNull());
    });
  });

  describe('when click on deleting button twice', () => {
    it('modal window should be closed', async () => {
      const {
        queryByText,
        getAllByText,
        getByText,
      } = renderViewMatchProfile(viewMatchProfileProps(matchProfileRecord()));

      fireEvent.click(getByText('Actions'));
      const deleteActionButton = getAllByText('Delete')[0];

      fireEvent.click(deleteActionButton);

      const deleteModalButton = getAllByText('Delete')[1];

      fireEvent.click(deleteModalButton);

      fireEvent.click(deleteModalButton);

      await waitFor(() => expect(queryByText('Delete match profile?')).toBeNull());
    });
  });

  describe('when match profile is loading', () => {
    it('spinner should be shown', () => {
      const { getByText } = renderViewMatchProfile(viewMatchProfileProps(matchProfileRecord(false)));

      expect(getByText('Loading')).toBeDefined();
    });
  });

  describe('when match profile doesn`t exist', () => {
    it('spinner should be shown', () => {
      const { getByText } = renderViewMatchProfile(viewMatchProfileProps({ matchProfile: null }));

      expect(getByText('Loading')).toBeDefined();
    });
  });
});
