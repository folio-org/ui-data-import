import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingItemDetails } from '../MappingItemDetails';
import {
  onAdd,
  onRemove,
} from '../../utils';
import {
  getInitialDetails,
  getInitialFields,
  getReferenceTables,
} from '../../../initialDetails';

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  onAdd: jest.fn(),
  onRemove: jest.fn(),
}));

global.fetch = jest.fn();

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.ITEM.type);

const {
  formerIds,
  statisticalCodeIds,
  administrativeNotes,
  yearCaption,
  notes,
  circulationNotes,
  electronicAccess,
} = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.ITEM.type).mappingFields);

const referenceTablesProp = {};
const setReferenceTablesMockProp = jest.fn();
const getRepeatableFieldActionProp = jest.fn(() => '');

const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderMappingItemDetails = ({ referenceTables }) => {
  const component = () => (
    <MappingItemDetails
      initialFields={initialFieldsProp}
      referenceTables={referenceTables || referenceTablesProp}
      setReferenceTables={setReferenceTablesMockProp}
      getRepeatableFieldAction={getRepeatableFieldActionProp}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('<MappingItemDetails>', () => {
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

  it('should be rendered with no axe errors', async () => {
    const { container } = renderMappingItemDetails({});

    await runAxeTest({ rootNode: container });
  });

  it('should have correct sections', async () => {
    const {
      findByRole,
      getByRole,
    } = renderMappingItemDetails({});

    expect(await findByRole('button', { name: /administrative data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /enumeration data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /item data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /condition/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /item notes/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /loan and availability/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /location/i })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /electronic access/i,
      expanded: true,
    })).toBeInTheDocument();
  });

  describe('"Former holdings" field', () => {
    it('User can add former identifier', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingItemDetails({ referenceTables: { formerIds } });

      const button = await findByRole('button', { name: /add former identifier/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('formerIds');
      expect(getByText('Former Identifier')).toBeInTheDocument();
    });

    it('User can delete former identifier', async () => {
      const { findByRole } = renderMappingItemDetails({ referenceTables: { formerIds } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('"Statistical codes" field', () => {
    it('User can add statistical code info', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingItemDetails({ referenceTables: { statisticalCodeIds } });

      const button = await findByRole('button', { name: /add statistical code/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('statisticalCodeIds');
      expect(getByText('Statistical code')).toBeInTheDocument();
    });

    it('User can delete statistical code info', async () => {
      const { findByRole } = renderMappingItemDetails({ referenceTables: { statisticalCodeIds } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('Administrative notes field', () => {
    it('User can add administrative note info', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingItemDetails({ referenceTables: { administrativeNotes } });

      const button = await findByRole('button', { name: /add administrative note/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('administrativeNotes');
      expect(getByText('Administrative note')).toBeInTheDocument();
    });

    it('User can delete administrative note info', async () => {
      const { findByRole } = renderMappingItemDetails({ referenceTables: { administrativeNotes } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(administrativeNotes);
    });
  });

  describe('"Year caption" field', () => {
    it('User can add "year, caption" field', async () => {
      const {
        findByRole,
        getByRole,
      } = renderMappingItemDetails({ referenceTables: { yearCaption } });

      const button = await findByRole('button', { name: /add year, caption/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('yearCaption');
      expect(getByRole('textbox', { name: /year, caption/i })).toBeInTheDocument();
    });

    it('User can delete "year, caption" field', async () => {
      const { findByRole } = renderMappingItemDetails({ referenceTables: { yearCaption } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('"Item notes" field', () => {
    it('User can add item note', async () => {
      const {
        findByRole,
        getByRole,
      } = renderMappingItemDetails({ referenceTables: { notes } });

      const button = await findByRole('button', { name: /add item note/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('notes');
      expect(getByRole('textbox', { name: 'Note type' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Note' })).toBeInTheDocument();
      expect(getByRole('combobox', { name: 'Staff only' })).toBeInTheDocument();
    });

    it('User can delete "notes" field', async () => {
      const { findByRole } = renderMappingItemDetails({ referenceTables: { notes } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('"Check in / Check out notes" field', () => {
    it('User can add "check in / check out" notes', async () => {
      const {
        findByRole,
        getByRole,
      } = renderMappingItemDetails({ referenceTables: { circulationNotes } });

      const button = await findByRole('button', { name: 'Add check in / check out note' });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('circulationNotes');
      expect(getByRole('textbox', { name: /note type/i })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Note' })).toBeInTheDocument();
      expect(getByRole('combobox', { name: /staff only/i })).toBeInTheDocument();
    });

    it('User can delete checkin / checkout field', async () => {
      const { findByRole } = renderMappingItemDetails({ referenceTables: { circulationNotes } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('"Electronic access" field', () => {
    it('User can add electronic access field', async () => {
      const {
        findByRole,
        getByRole,
      } = renderMappingItemDetails({ referenceTables: { electronicAccess } });

      const button = await findByRole('button', { name: 'Add electronic access' });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('electronicAccess');
      expect(getByRole('textbox', { name: 'Relationship' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'URI' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Link text' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Materials specified' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'URL public note' })).toBeInTheDocument();
    });

    it('User can delete electronic field', async () => {
      const { findByRole } = renderMappingItemDetails({ referenceTables: { electronicAccess } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });
});
