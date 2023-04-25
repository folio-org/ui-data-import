import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';

import { noop } from 'lodash';
import { createMemoryHistory } from 'history';
import { runAxeTest } from '@folio/stripes-testing';

import {
  buildStripes,
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { ViewMatchProfile } from './ViewMatchProfile';

global.fetch = jest.fn();

const stripes = buildStripes();

const history = createMemoryHistory();

history.push = jest.fn();

const matchProfileRecord = (
  hasLoaded = true,
  name = 'testName',
  description = 'testDescription',
) => ({
  matchProfileView: {
    hasLoaded,
    records: [{
      id: 'testId',
      name,
      description,
      incomingRecordType: 'MARC_BIBLIOGRAPHIC',
      existingRecordType: 'INSTANCE',
      incomingMatchExpression: {
        dataValueType: 'test data value 1',
        fields: [{
          label: 'test label 1',
          value: 'text value 1',
        }],
        qualifier: {
          comparisonPart: 'NUMERICS_ONLY',
          qualifierType: 'BEGINS_WITH',
          qualifierValue: 'test',
        },
      },
      existingMatchExpression: 'testExistingRecordLabel',
      matchCriterion: 'EXACTLY_MATCHES',
      matchDetails: [{
        incomingRecordType: 'MARC_BIBLIOGRAPHIC',
        existingRecordType: 'INSTANCE',
        incomingMatchExpression: {
          dataValueType: 'test data value 1',
          fields: [{
            label: 'test label 1',
            value: 'text value 1',
          }],
          qualifier: {
            comparisonPart: 'NUMERICS_ONLY',
            qualifierType: 'BEGINS_WITH',
            qualifierValue: 'test',
          },
        },
        existingMatchExpression: {
          fields: [{
            label: 'field',
            value: 'instance.id',
          }],
          dataValueType: 'test dataValueType',
          qualifier: {},
        },
        matchCriterion: 'EXACTLY_MATCHES',
      }],
    }],
  },
});
const viewMatchProfileProps = ({ matchProfileView }) => ({
  resources: { matchProfileView },
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
        stripes={stripes}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ViewMatchProfile component', () => {
  beforeEach(() => {
    global.fetch.mockReturnValue({
      ok: true,
      json: async () => ({
        identifierTypes: [{
          id: '1',
          name: 'ASIN',
          source: 'folio',
        }],
      }),
    });
  });

  afterEach(() => {
    history.push.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  // TODO: Create separate ticket to fix all the accesibility tests
  it.skip('should be rendered with no axe errors', async () => {
    const { container } = renderViewMatchProfile(viewMatchProfileProps(matchProfileRecord()));

    await runAxeTest({ rootNode: container });
  });

  it('match profile name should be rendered correctly', async () => {
    const { findAllByText } = renderViewMatchProfile(viewMatchProfileProps(matchProfileRecord()));

    await waitFor(() => expect(findAllByText('testName')).toBeDefined());
  });

  describe('when click on delete action button', () => {
    it('modal window should be shown', async () => {
      const { findByText } = renderViewMatchProfile(viewMatchProfileProps(matchProfileRecord(true, null, null)));

      const actionsButton = await findByText('Actions');

      fireEvent.click(actionsButton);
      const deleteButton = await findByText('Delete');

      fireEvent.click(deleteButton);

      await waitFor(() => expect(findByText('Delete match profile?')).toBeDefined());
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
    it('spinner should be shown', async () => {
      const { findByText } = renderViewMatchProfile(viewMatchProfileProps(matchProfileRecord(false)));

      await waitFor(() => expect(findByText('Loading')).toBeDefined());
    });
  });

  describe('when match profile doesn`t exist', () => {
    it('spinner should be shown', async () => {
      const { findByText } = renderViewMatchProfile(viewMatchProfileProps({ matchProfile: null }));

      await waitFor(() => expect(findByText('Loading')).toBeDefined());
    });
  });
});
