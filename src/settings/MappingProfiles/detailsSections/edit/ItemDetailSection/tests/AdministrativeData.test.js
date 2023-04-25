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

import { AdministrativeData } from '../AdministrativeData';

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

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.ITEM.type);
const {
  formerIds,
  statisticalCodeIds,
  administrativeNotes,
} = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.ITEM.type).mappingFields);

const setReferenceTablesMock = jest.fn();
const getRepeatableFieldActionMock = jest.fn(() => 'DELETE_INCOMING');
const okapi = buildOkapi();

const renderAdministrativeData = ({
  formerIdsProp = [],
  statisticalCodeIdsProp = [],
  administrativeNotesProp = [],
}) => {
  const component = () => (
    <AdministrativeData
      formerIds={formerIdsProp}
      statisticalCodeIds={statisticalCodeIdsProp}
      administrativeNotes={administrativeNotesProp}
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMock}
      getRepeatableFieldAction={getRepeatableFieldActionMock}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Item "Administrative data" edit component', () => {
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
    } = renderAdministrativeData({
      administrativeNotesProp: administrativeNotes,
      statisticalCodeIdsProp: statisticalCodeIds,
    });
    const administrativeDataTitle = await findByText('Administrative data');

    expect(administrativeDataTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByText } = renderAdministrativeData({
      administrativeNotesProp: administrativeNotes,
      statisticalCodeIdsProp: statisticalCodeIds,
    });
    const administrativeDataTitle = await findByText('Administrative data');

    expect(administrativeDataTitle).toBeInTheDocument();
  });

  describe('"Statistical codes" field', () => {
    it('User can add statistical code info', async () => {
      const {
        findByRole,
        getByText,
      } = renderAdministrativeData({ statisticalCodeIdsProp: statisticalCodeIds });

      const addButton = await findByRole('button', { name: /add statistical code/i });

      fireEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('statisticalCodeIds');
      expect(getByText('Statistical code')).toBeInTheDocument();
    });

    it('User can delete statistical code info', async () => {
      const { findByRole } = renderAdministrativeData({ statisticalCodeIdsProp: statisticalCodeIds });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(statisticalCodeIds);
    });
  });

  describe('"Administrative notes" field', () => {
    it('User can add administrative note info', async () => {
      const {
        findByRole,
        getByText,
      } = renderAdministrativeData({ administrativeNotesProp: administrativeNotes });

      const addButton = await findByRole('button', { name: /add administrative note/i });

      fireEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('administrativeNotes');
      expect(getByText('Administrative note')).toBeInTheDocument();
    });

    it('User can delete administrative note info', async () => {
      const { findByRole } = renderAdministrativeData({ administrativeNotesProp: administrativeNotes });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(administrativeNotes);
    });
  });

  describe('"Former identifiers" field', () => {
    it('User can add former item identifier', async () => {
      const {
        findByRole,
        getByText,
      } = renderAdministrativeData({ formerIdsProp: formerIds });

      const addButton = await findByRole('button', { name: /add former identifier/i });
      fireEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('formerIds');
      expect(getByText('Former Identifier')).toBeInTheDocument();
    });

    it('User can delete former item identifier', async () => {
      const { findByRole } = renderAdministrativeData({ formerIdsProp: formerIds });

      const deleteButton = await findByRole('button', { name: /delete this item/i });
      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(formerIds);
    });
  });
});
