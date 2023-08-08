import React from 'react';
import faker from 'faker';
import { noop } from 'lodash';
import { BrowserRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';

import { RecordsTable } from './RecordsTable';

window.open = jest.fn();
window.open.mockReturnValue({ focus: jest.fn() });
const history = createMemoryHistory();

const firstRecordJobExecutionId = faker.random.uuid();

const jobLogEntriesRecords = [{
  sourceRecordActionStatus: 'CREATED',
  sourceRecordType: 'MARC_BIBLIOGRAPHIC',
  instanceActionStatus: 'CREATED',
  sourceRecordTitle: 'Test record 1',
  jobExecutionId: firstRecordJobExecutionId,
  sourceRecordId: '59138d56-bc81-4f66-9f72-f57f53621111',
  sourceRecordOrder: '0',
}, {
  sourceRecordActionStatus: 'CREATED',
  sourceRecordType: 'MARC_BIBLIOGRAPHIC',
  instanceActionStatus: 'CREATED',
  sourceRecordTitle: 'Test record 2',
  jobExecutionId: firstRecordJobExecutionId,
  sourceRecordId: '59138d56-bc81-4f66-9f72-f57f53629646',
  sourceRecordOrder: '0',
}];

const jobLogEntriesResources = {
  jobLogEntries: {
    records: jobLogEntriesRecords,
    other: { totalRecords: jobLogEntriesRecords.length }
  },
};

const jobLogRecords = [{
  jobExecutionId: '467d7627-c0db-4fb7-b333-4b4983dbf781',
  sourceRecordId: '59138d56-bc81-4f66-9f72-f57f53621111',
  sourceRecordOrder : 0,
  sourceRecordTitle: 'Test record 1',
  sourceRecordActionStatus: 'CREATED',
  instanceActionStatus: 'CREATED',
  error: '',
  relatedInstanceInfo: {
    actionStatus: 'CREATED',
    idList: ['720031b9-a792-4936-963c-a7b63fb96574'],
    hridList: ['in00000000014'],
    error: '',
  },
  relatedHoldingsInfo: [],
  relatedItemInfo: [],
  relatedAuthorityInfo: {
    idList: [],
    hridList: [],
  },
  relatedPoLineInfo: {
    idList: [],
    hridList: [],
  },
  relatedInvoiceInfo: {
    idList: [],
    hridList: [],
  },
  relatedInvoiceLineInfo: { },
}, {
  jobExecutionId: '467d7627-c0db-4fb7-b333-4b4983dbf781',
  sourceRecordId: '59138d56-bc81-4f66-9f72-f57f53629646',
  sourceRecordOrder : 4,
  sourceRecordTitle: 'Test record 2',
  sourceRecordActionStatus: 'CREATED',
  instanceActionStatus: 'CREATED',
  error: '',
  relatedInstanceInfo: {
    actionStatus: 'CREATED',
    idList: ['720031b9-a792-4936-963c-a7b63fb96574'],
    hridList: ['in00000000014'],
    error: '',
  },
  relatedHoldingsInfo: [{
    actionStatus: 'CREATED',
    id: 'f648c370-d9d6-432c-a502-b8eb718f867c',
    permanentLocationId: '53cf956f-c1df-410b-8bea-27f712cca7c0',
    hrid: 'ho00000000017',
    error: '',
  }, {
    actionStatus: 'CREATED',
    id: '5cadf17f-eb72-475c-a2e0-7e56f54f0000',
    permanentLocationId: '758258bc-ecc1-41b8-abca-f7b610822ffd',
    hrid: 'ho00000000018',
    error: '',
  }, {
    actionStatus: 'DISCARDED',
    id: '5cadf17f-eb72-475c-a2e0-7e56f54fd3b4',
    permanentLocationId: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
    hrid: 'ho00000000014',
    error: '',
  }],
  relatedItemInfo: [{
    actionStatus: 'CREATED',
    id: '37f20cb1-f60c-4195-80a1-00a16c4af5cb',
    hrid: 'it00000000015',
    holdingsId: 'f648c370-d9d6-432c-a502-b8eb718f867c',
    error: '',
  }, {
    actionStatus: 'DISCARDED',
    id: 'ccd19bf0-add1-46bb-899b-c457fd448b51',
    hrid: 'it00000000016',
    holdingsId: 'f648c370-d9d6-432c-a502-b8eb718f867c',
    error: 'test error',
  }, {
    actionStatus: 'CREATED',
    id: 'ccd19bf0-add1-46bb-899b-c457fd441111',
    hrid: 'it00000000019',
    holdingsId: '5cadf17f-eb72-475c-a2e0-7e56f54f0000',
    error: '',
  }, {
    actionStatus: 'CREATED',
    id: '3bcfe427-a747-405f-b3f3-1d842ffb2222',
    hrid: 'it00000000018',
    holdingsId: '5cadf17f-eb72-475c-a2e0-7e56f54f0000',
    error: '',
  }, {
    actionStatus: 'CREATED',
    id: '3bcfe427-a747-405f-b3f3-1d842ffb49c6',
    hrid: 'it00000000014',
    holdingsId: 'f648c370-d9d6-432c-a502-b8eb718f867c',
    error: '',
  }],
  relatedAuthorityInfo: {
    idList: [],
    hridList: [],
  },
  relatedPoLineInfo: {
    idList: [],
    hridList: [],
  },
  relatedInvoiceInfo: {
    idList: [],
    hridList: [],
  },
  relatedInvoiceLineInfo: { },
}];

const jobLogResources = {
  jobLog: {
    records: jobLogRecords,
    other: { totalRecords: jobLogRecords.length }
  },
};

const locations = {
  records: [{
    id: '53cf956f-c1df-410b-8bea-27f712cca7c0',
    code: 'KU/CC/DI/A',
  }, {
    id: 'fcd64ce1-6995-48f0-840e-89ffa2288371',
    code: 'KU/CC/DI/M',
  }, {
    id: '758258bc-ecc1-41b8-abca-f7b610822ffd',
    code: 'KU/CC/DI/O',
  }]
};

const resources = {
  ...jobLogEntriesResources,
  ...jobLogResources,
  locations,
};

const mutator = {
  resultCount: { replace: () => {} },
  resultOffset: { replace: () => {} },
};

const source = {
  records: () => resources.jobLogEntries.records,
  pending: () => false,
  totalCount: () => resources.jobLogEntries.other.totalRecords,
  fetchMore: noop,
  fetchOffset: noop,
};

const renderRecordsTable = () => {
  const component = (
    <BrowserRouter>
      <RecordsTable
        isEdifactType={false}
        resources={resources}
        mutator={mutator}
        source={source}
        resultCountIncrement={5}
        pageAmount={5}
        history={history}
        location="test location"
      />
    </BrowserRouter>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('RecordsTable component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderRecordsTable({});

    await runAxeTest({ rootNode: container });
  });

  it('should have proper columns', () => {
    const { getByText } = renderRecordsTable();
    /*
     * Get "Holdings" and "Error" labels by query selector instead of by "getByText" because there are
     * "Holdings" / "Error" column labels and "Holdings" / "Error" messages in cells on the page
     */
    const holdingsColumn = document.querySelector('#list-column-holdingsstatus div[class^="mclHeaderInner"] > div');
    const errorColumn = document.querySelector('#list-column-error div[class^="mclHeaderInner"] > div');

    expect(getByText('Record')).toBeDefined();
    expect(getByText('Title')).toBeDefined();
    expect(getByText('SRS MARC')).toBeDefined();
    expect(getByText('Instance')).toBeDefined();
    expect(holdingsColumn.innerHTML).toEqual('Holdings');
    expect(getByText('Item')).toBeDefined();
    expect(getByText('Authority')).toBeDefined();
    expect(getByText('Order')).toBeDefined();
    expect(getByText('Invoice')).toBeDefined();
    expect(errorColumn.innerHTML).toEqual('Error');
  });

  it('should render records', () => {
    const { getByText } = renderRecordsTable();

    expect(getByText('Test record 1')).toBeInTheDocument();
    expect(getByText('Test record 2')).toBeInTheDocument();
  });
});
