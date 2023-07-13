import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { HoldingsDetails } from '../HoldingsDetails';

import { STATUS_CODES } from '../../../../../../utils';
import {
  onAdd,
  onRemove,
} from '../../../utils';

import {
  getInitialDetails,
  getInitialFields,
  getReferenceTables,
} from '../../../../initialDetails';

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  onAdd: jest.fn(),
  onRemove: jest.fn(),
}));

global.fetch = jest.fn();

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.HOLDINGS.type);
const {
  holdingsStatements,
  holdingsStatementsForSupplements,
  holdingsStatementsForIndexes,
} = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.HOLDINGS.type).mappingFields);

const setReferenceTablesMock = jest.fn();
const getRepeatableFieldActionMock = jest.fn(() => 'DELETE_INCOMING');
const okapi = buildOkapi();

const renderHoldingsDetails = ({
  holdingsStatementsProp = [],
  holdingsStatementsForSupplementsProp = [],
  holdingsStatementsForIndexesProp = [],
}) => {
  const component = () => (
    <HoldingsDetails
      holdingsStatements={holdingsStatementsProp}
      holdingsStatementsForSupplements={holdingsStatementsForSupplementsProp}
      holdingsStatementsForIndexes={holdingsStatementsForIndexesProp}
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMock}
      getRepeatableFieldAction={getRepeatableFieldActionMock}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Holdings "Holdings details" edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: STATUS_CODES.OK,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    setReferenceTablesMock.mockClear();
    getRepeatableFieldActionMock.mockClear();
    onAdd.mockClear();
    onRemove.mockClear();
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const {
      container,
      findByText,
    } = renderHoldingsDetails({
      holdingsStatementsProp: holdingsStatements,
      holdingsStatementsForSupplementsProp: holdingsStatementsForSupplements,
      holdingsStatementsForIndexesProp: holdingsStatementsForIndexes,
    });
    const holdingsDetailsTitle = await findByText('Holdings details');

    expect(holdingsDetailsTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByText } = renderHoldingsDetails({
      holdingsStatementsProp: holdingsStatements,
      holdingsStatementsForSupplementsProp: holdingsStatementsForSupplements,
      holdingsStatementsForIndexesProp: holdingsStatementsForIndexes,
    });
    const holdingsDetailsTitle = await findByText('Holdings details');

    expect(holdingsDetailsTitle).toBeInTheDocument();
  });

  describe('"Holdings statements" field', () => {
    it('User can add holdings statement', async () => {
      const {
        findByRole,
        getByText,
      } = renderHoldingsDetails({ holdingsStatementsProp: holdingsStatements });

      const addButton = await findByRole('button', { name: 'Add holdings statement' });

      fireEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('holdingsStatements');
      expect(getByText('Holdings statement')).toBeInTheDocument();
      expect(getByText('Statement public note')).toBeInTheDocument();
      expect(getByText('Statement staff note')).toBeInTheDocument();
    });

    it('User can delete holdings statements', async () => {
      const { findByRole } = renderHoldingsDetails({ holdingsStatementsProp: holdingsStatements });

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
      } = renderHoldingsDetails({ holdingsStatementsForSupplementsProp: holdingsStatementsForSupplements });

      const addButton = await findByRole('button', { name: 'Add holdings statement for supplement' });

      fireEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('holdingsStatementsForSupplements');
      expect(getByText('Holdings statement')).toBeInTheDocument();
      expect(getByText('Statement public note')).toBeInTheDocument();
      expect(getByText('Statement staff note')).toBeInTheDocument();
    });

    it('User can delete holdings statement for supplements', async () => {
      const { findByRole } = renderHoldingsDetails({ holdingsStatementsForSupplementsProp: holdingsStatementsForSupplements });

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
      } = renderHoldingsDetails({ holdingsStatementsForIndexesProp: holdingsStatementsForIndexes });

      const addButton = await findByRole('button', { name: 'Add holdings statement for indexes' });

      fireEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('holdingsStatementsForIndexes');
      expect(getByText('Holdings statement')).toBeInTheDocument();
      expect(getByText('Statement public note')).toBeInTheDocument();
      expect(getByText('Statement staff note')).toBeInTheDocument();
    });

    it('User can delete holdings statement for indexes', async () => {
      const { findByRole } = renderHoldingsDetails({ holdingsStatementsForIndexesProp: holdingsStatementsForIndexes });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(holdingsStatementsForIndexes);
    });
  });
});
