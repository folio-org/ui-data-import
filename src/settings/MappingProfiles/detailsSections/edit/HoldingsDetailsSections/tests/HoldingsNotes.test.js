import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { HoldingsNotes } from '../HoldingsNotes';

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
const { notes } = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.HOLDINGS.type).mappingFields);

const setReferenceTablesMock = jest.fn();
const getRepeatableFieldActionMock = jest.fn(() => 'DELETE_INCOMING');
const okapi = buildOkapi();

const renderHoldingsNotes = () => {
  const component = () => (
    <HoldingsNotes
      notes={notes}
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMock}
      getRepeatableFieldAction={getRepeatableFieldActionMock}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Holdings "Holdings notes" edit component', () => {
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
    } = renderHoldingsNotes();
    const holdingsNotesTitle = await findByText('Holdings notes');

    expect(holdingsNotesTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByText } = renderHoldingsNotes();
    const holdingsNotesTitle = await findByText('Holdings notes');

    expect(holdingsNotesTitle).toBeInTheDocument();
  });

  describe('"Holdings notes" field', () => {
    it('User can add holdings note', async () => {
      const {
        findByRole,
        getByText,
      } = renderHoldingsNotes();

      const addButton = await findByRole('button', { name: 'Add holdings note' });

      fireEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('notes');
      expect(getByText('Note type')).toBeInTheDocument();
      expect(getByText('Note')).toBeInTheDocument();
      expect(getByText('Staff only')).toBeInTheDocument();
    });

    it('User can delete holdings note', async () => {
      const { findByRole } = renderHoldingsNotes();

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(notes);
    });
  });
});
