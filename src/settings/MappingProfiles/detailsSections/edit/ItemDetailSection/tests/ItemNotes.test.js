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

import { ItemNotes } from '../ItemNotes';

import { STATUS_CODES } from '../../../../../../utils';
import {
  onAdd,
  onRemove,
} from '../../../utils';

import {
  getInitialFields,
  getInitialDetails,
  getReferenceTables,
} from '../../../../initialDetails';

global.fetch = jest.fn();

jest.mock('../../../utils', () => ({
  ...jest.requireActual('../../../utils'),
  onAdd: jest.fn(),
  onRemove: jest.fn(),
}));

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.ITEM.type);
const { notes } = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.ITEM.type).mappingFields);

const setReferenceTablesMock = jest.fn();
const getRepeatableFieldActionMock = jest.fn(() => 'DELETE_INCOMING');
const okapi = buildOkapi();

const renderItemNotes = () => {
  const component = () => (
    <ItemNotes
      notes={notes}
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMock}
      getRepeatableFieldAction={getRepeatableFieldActionMock}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Item "Item notes" edit component', () => {
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
      findByRole,
    } = renderItemNotes();
    const itemNotesTitle = await findByRole('button', { name: /item notes/i, expanded: true });

    expect(itemNotesTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByRole } = renderItemNotes();
    const itemNotesTitle = await findByRole('button', { name: /item notes/i, expanded: true });

    expect(itemNotesTitle).toBeInTheDocument();
  });

  describe('"Item notes" field', () => {
    it('User can add item note', async () => {
      const {
        findByRole,
        getByRole,
      } = renderItemNotes();

      const button = await findByRole('button', { name: /add item note/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('notes');
      expect(getByRole('textbox', { name: 'Note type' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Note' })).toBeInTheDocument();
      expect(getByRole('combobox', { name: 'Staff only' })).toBeInTheDocument();
    });

    it('User can delete "notes" field', async () => {
      const { findByRole } = renderItemNotes();

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });
});
