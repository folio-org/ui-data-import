import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { ReceivingHistory } from '../ReceivingHistory';

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
  'receivingHistory.entries': receivingHistoryEntries
} = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.HOLDINGS.type).mappingFields);

const setReferenceTablesMock = jest.fn();
const getRepeatableFieldActionMock = jest.fn(() => 'DELETE_INCOMING');

const renderReceivingHistory = () => {
  const component = () => (
    <ReceivingHistory
      receivingHistory={receivingHistoryEntries}
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMock}
      getRepeatableFieldAction={getRepeatableFieldActionMock}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Holdings "Receiving history" edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
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
    } = renderReceivingHistory();
    const receivingHistoryTitle = await findByText('Receiving history');

    expect(receivingHistoryTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByText } = renderReceivingHistory();
    const receivingHistoryTitle = await findByText('Receiving history');

    expect(receivingHistoryTitle).toBeInTheDocument();
  });

  describe('"Receiving history" field', () => {
    it('User can add history note', async () => {
      const {
        findByRole,
        getByText,
      } = renderReceivingHistory();

      const button = await findByRole('button', { name: 'Add receiving history note' });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('receivingHistory.entries');
      expect(getByText('Public display')).toBeInTheDocument();
      expect(getByText('Enumeration')).toBeInTheDocument();
      expect(getByText('Chronology')).toBeInTheDocument();
    });

    it('User can delete history note', async () => {
      const { findByRole } = renderReceivingHistory();

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(receivingHistoryEntries);
    });
  });
});
