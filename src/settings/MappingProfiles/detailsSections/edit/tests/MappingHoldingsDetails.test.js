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
import {
  getInitialDetails,
  getInitialFields,
  getReferenceTables,
} from '../../../initialDetails';
import { FOLIO_RECORD_TYPES } from '../../../../../components';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  onAdd: jest.fn(),
  onRemove: jest.fn(),
}));

global.fetch = jest.fn();

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.HOLDINGS.type);
const {
  formerIds,
  statisticalCodeIds,
  administrativeNotes,
  holdingsStatements,
  holdingsStatementsForSupplements,
  holdingsStatementsForIndexes,
  notes,
  'receivingHistory.entries': receivingHistoryEntries,
  electronicAccess,
} = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.HOLDINGS.type).mappingFields);

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

  describe('Administrative notes field', () => {
    it('User can add administrative note info', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingHoldingsDetails({ referenceTables: { administrativeNotes } });

      const button = await findByRole('button', { name: /add administrative note/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('administrativeNotes');
      expect(getByText('Administrative note')).toBeInTheDocument();
    });

    it('User can delete administrative note info', async () => {
      const { findByRole } = renderMappingHoldingsDetails({ referenceTables: { administrativeNotes } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(administrativeNotes);
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
