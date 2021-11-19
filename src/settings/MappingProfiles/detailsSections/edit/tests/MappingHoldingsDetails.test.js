import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingHoldingsDetails } from '../MappingHoldingsDetails';
import {
  onAdd,
  onRemove,
} from '../../utils';
import { getInitialFields } from '../../../initialDetails';
import { FOLIO_RECORD_TYPES } from '../../../../../components';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  onAdd: jest.fn(),
  onRemove: jest.fn(),
}));

global.fetch = jest.fn();

const formerIds = [{
  fields: [{
    enabled: true,
    name: 'formerId',
    path: 'holdings.formerIds[]',
    value: '',
  }],
  order: 0,
  path: 'holdings.formerIds[]',
}];

const statisticalCodeIds = [{
  fields: [{
    acceptedValues: { testId: 'testValue' },
    enabled: true,
    name: 'statisticalCodeId',
    path: 'holdings.statisticalCodeIds[]',
    value: '',
  }],
  order: 0,
  path: 'holdings.statisticalCodeIds[]',
}];

const holdingsStatements = [{
  fields: [{
    enabled: true,
    name: 'statement',
    path: 'holdings.holdingsStatements[].statement',
    value: '',
  }, {
    enabled: true,
    name: 'note',
    path: 'holdings.holdingsStatements[].note',
    value: '',
  }, {
    enabled: true,
    name: 'staffNote',
    path: 'holdings.holdingsStatements[].staffNote',
    value: '',
  }],
  order: 0,
  path: 'holdings.holdingsStatements[]',
}];

const holdingsStatementsForSupplements = [{
  fields: [{
    enabled: true,
    name: 'statement',
    path: 'holdings.holdingsStatementsForSupplements[].statement',
    value: '',
  }, {
    enabled: true,
    name: 'note',
    path: 'holdings.holdingsStatementsForSupplements[].note',
    value: '',
  }, {
    enabled: true,
    name: 'staffNote',
    path: 'holdings.holdingsStatementsForSupplements[].staffNote',
    value: '',
  }],
  order: 0,
  path: 'holdings.holdingsStatementsForSupplements[]',
}];

const holdingsStatementsForIndexes = [{
  fields: [{
    enabled: true,
    name: 'statement',
    path: 'holdings.holdingsStatementsForIndexes[].statement',
    value: '',
  }, {
    enabled: true,
    name: 'note',
    path: 'holdings.holdingsStatementsForIndexes[].note',
    value: '',
  }, {
    enabled: true,
    name: 'staffNote',
    path: 'holdings.holdingsStatementsForIndexes[].staffNote',
    value: '',
  }],
  order: 0,
  path: 'holdings.holdingsStatementsForIndexes[]',
}];

const notes = [{
  fields: [{
    acceptedValues: {},
    enabled: true,
    name: 'noteType',
    path: 'holdings.notes[].holdingsNoteTypeId',
    value: '',
  }, {
    enabled: true,
    name: 'note',
    path: 'holdings.notes[].note',
    value: '',
  }, {
    enabled: true,
    name: 'staffOnly',
    path: 'holdings.notes[].staffOnly',
    value: null,
  }],
  order: 0,
  path: 'holdings.notes[]',
}];

const receivingHistoryEntries = [{
  fields: [{
    enabled: true,
    name: 'publicDisplay',
    path: 'holdings.receivingHistory.entries[].publicDisplay',
    value: null,
  }, {
    enabled: true,
    name: 'enumeration',
    path: 'holdings.receivingHistory.entries[].enumeration',
    value: '',
  }, {
    enabled: true,
    name: 'chronology',
    path: 'holdings.receivingHistory.entries[].chronology',
    value: '',
  }],
  order: 0,
  path: 'holdings.receivingHistory.entries[]',
}];

const electronicAccess = [{
  fields: [{
    acceptedValues: {},
    enabled: true,
    name: 'relationshipId',
    path: 'holdings.electronicAccess[].relationshipId',
    value: '',
  }, {
    enabled: true,
    name: 'uri',
    path: 'holdings.electronicAccess[].uri',
    value: '',
  }, {
    enabled: true,
    name: 'linkText',
    path: 'holdings.electronicAccess[].linkText',
    value: '',
  }, {
    enabled: true,
    name: 'materialsSpecification',
    path: 'holdings.electronicAccess[].materialsSpecification',
    value: '',
  }, {
    enabled: true,
    name: 'publicNote',
    path: 'holdings.electronicAccess[].publicNote',
    value: '',
  }],
  order: 0,
  path: 'holdings.electronicAccess[]',
}];

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.HOLDINGS.type);
const referenceTablesProp = {};
const setReferenceTablesMockProp = jest.fn();
const getRepeatableFieldActionProp = jest.fn(() => 'DELETE_INCOMING');
const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderMappingHoldingsDetails = ({ referenceTables }) => {
  const component = () => (
    <MappingHoldingsDetails
      initialFields={initialFieldsProp}
      referenceTables={referenceTables || referenceTablesProp}
      setReferenceTables={setReferenceTablesMockProp}
      getRepeatableFieldAction={getRepeatableFieldActionProp}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('<MappingHoldingsDetails>', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    global.fetch.mockClear();
    onAdd.mockClear();
    onRemove.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('should have correct sections', async () => {
    const {
      findByRole,
      getByRole,
    } = renderMappingHoldingsDetails({});

    expect(await findByRole('button', { name: /administrative data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /location/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /holdings details/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /holdings notes/i })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /electronic access/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /receiving history/i,
      expanded: true,
    })).toBeInTheDocument();
  });

  describe('"Former holdings" field', () => {
    it('User can add former holdings identifier', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingHoldingsDetails({ referenceTables: { formerIds } });

      const button = await findByRole('button', { name: /add former holdings identifier/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('formerIds');
      expect(getByText('Former holdings ID')).toBeInTheDocument();
    });

    it('User can delete former holdings identifier', async () => {
      const { findByRole } = renderMappingHoldingsDetails({ referenceTables: { formerIds } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(formerIds);
    });
  });

  describe('"Statistical codes" field', () => {
    it('User can add statistical code info', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingHoldingsDetails({ referenceTables: { statisticalCodeIds } });

      const button = await findByRole('button', { name: /add statistical code/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('statisticalCodeIds');
      expect(getByText('Statistical code')).toBeInTheDocument();
    });

    it('User can delete statistical code info', async () => {
      const { findByRole } = renderMappingHoldingsDetails({ referenceTables: { statisticalCodeIds } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(statisticalCodeIds);
    });
  });

  describe('"Holdings statements" field', () => {
    it('User can add holdings statement', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingHoldingsDetails({ referenceTables: { holdingsStatements } });

      const button = await findByRole('button', { name: 'Add holdings statement' });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('holdingsStatements');
      expect(getByText('Holdings statement')).toBeInTheDocument();
      expect(getByText('Statement public note')).toBeInTheDocument();
      expect(getByText('Statement staff note')).toBeInTheDocument();
    });

    it('User can delete holdings statements', async () => {
      const { findByRole } = renderMappingHoldingsDetails({ referenceTables: { holdingsStatements } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(holdingsStatements);
    });
  });

  describe('"Holdings statements for supplements" field', () => {
    it('User can add holdings statement for supplements', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingHoldingsDetails({ referenceTables: { holdingsStatementsForSupplements } });

      const button = await findByRole('button', { name: 'Add holdings statement for supplement' });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('holdingsStatementsForSupplements');
      expect(getByText('Holdings statement')).toBeInTheDocument();
      expect(getByText('Statement public note')).toBeInTheDocument();
      expect(getByText('Statement staff note')).toBeInTheDocument();
    });

    it('User can delete holdings statement for supplements', async () => {
      const { findByRole } = renderMappingHoldingsDetails({ referenceTables: { holdingsStatementsForSupplements } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(holdingsStatementsForSupplements);
    });
  });

  describe('"Holdings statements for indexes" field', () => {
    it('User can add holdings statement for indexes', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingHoldingsDetails({ referenceTables: { holdingsStatementsForIndexes } });

      const button = await findByRole('button', { name: 'Add holdings statement for indexes' });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('holdingsStatementsForIndexes');
      expect(getByText('Holdings statement')).toBeInTheDocument();
      expect(getByText('Statement public note')).toBeInTheDocument();
      expect(getByText('Statement staff note')).toBeInTheDocument();
    });

    it('User can delete holdings statement for indexes', async () => {
      const { findByRole } = renderMappingHoldingsDetails({ referenceTables: { holdingsStatementsForIndexes } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(holdingsStatementsForIndexes);
    });
  });

  describe('"Holdings notes" field', () => {
    it('User can add holdings note', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingHoldingsDetails({ referenceTables: { notes } });

      const button = await findByRole('button', { name: 'Add holdings note' });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('notes');
      expect(getByText('Note type')).toBeInTheDocument();
      expect(getByText('Note')).toBeInTheDocument();
      expect(getByText('Staff only')).toBeInTheDocument();
    });

    it('User can delete holdings note', async () => {
      const { findByRole } = renderMappingHoldingsDetails({ referenceTables: { notes } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(notes);
    });
  });

  describe('"Electronic access" field', () => {
    it('User can electronic access info', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingHoldingsDetails({ referenceTables: { electronicAccess } });

      const button = await findByRole('button', { name: 'Add electronic access' });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('electronicAccess');
      expect(getByText('Relationship')).toBeInTheDocument();
      expect(getByText('URI')).toBeInTheDocument();
      expect(getByText('Link text')).toBeInTheDocument();
      expect(getByText('Materials specified')).toBeInTheDocument();
      expect(getByText('URL public note')).toBeInTheDocument();
    });

    it('User can delete electronic access info', async () => {
      const { findByRole } = renderMappingHoldingsDetails({ referenceTables: { electronicAccess } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(electronicAccess);
    });
  });

  describe('"Receiving history" field', () => {
    it('User can add history note', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingHoldingsDetails({ referenceTables: { 'receivingHistory.entries': receivingHistoryEntries } });

      const button = await findByRole('button', { name: 'Add receiving history note' });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('receivingHistory.entries');
      expect(getByText('Public display')).toBeInTheDocument();
      expect(getByText('Enumeration')).toBeInTheDocument();
      expect(getByText('Chronology')).toBeInTheDocument();
    });

    it('User can delete history note', async () => {
      const { findByRole } = renderMappingHoldingsDetails({ referenceTables: { 'receivingHistory.entries': receivingHistoryEntries } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(receivingHistoryEntries);
    });
  });
});
