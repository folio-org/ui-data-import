import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../../../test/jest/__mock__';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingItemDetails } from '../MappingItemDetails';

global.fetch = jest.fn();

const formerIds = [{
  fields: [{
    enabled: true,
    name: 'formerId',
    path: 'item.formerIds[]',
    value: '',
  }],
  order: 0,
  path: 'item.formerIds[]',
}];

const statisticalCodeIds = [{
  fields: [{
    acceptedValues: {},
    enabled: true,
    name: 'statisticalCodeId',
    path: 'item.statisticalCodeIds[]',
    value: '',
  }],
  order: 0,
  path: 'item.statisticalCodeIds[]',
}];

const yearCaption = [{
  fields: [{
    enabled: true,
    name: 'yearCaption',
    path: 'item.yearCaption[]',
    value: '',
  }],
  order: 0,
  path: 'item.yearCaption[]',
}];

const notes = [{
  fields: [{
    acceptedValues: {},
    enabled: true,
    name: 'itemNoteTypeId',
    path: 'item.notes[].itemNoteTypeId',
    value: '',
  }, {
    enabled: true,
    name: 'note',
    path: 'item.notes[].note',
    value: '',
  }, {
    enabled: true,
    name: 'staffOnly',
    path: 'item.notes[].staffOnly',
    value: null,
  }],
  order: 0,
  path: 'item.notes[]',
}];

const circulationNotes = [{
  fields: [{
    enabled: true,
    name: 'noteType',
    path: 'item.circulationNotes[].noteType',
    value: '',
  }, {
    enabled: true,
    name: 'note',
    path: 'item.circulationNotes[].note',
    value: '',
  }, {
    enabled: true,
    name: 'staffOnly',
    path: 'item.circulationNotes[].staffOnly',
    value: null,
  }],
  order: 0,
  path: 'item.circulationNotes[]',
}];

const electronicAccess = [{
  fields: [{
    acceptedValues: {},
    enabled: true,
    name: 'relationshipId',
    path: 'item.electronicAccess[].relationshipId',
    value: '',
  }, {
    enabled: true,
    name: 'uri',
    path: 'item.electronicAccess[].uri',
    value: '',
  }, {
    enabled: true,
    name: 'linkText',
    path: 'item.electronicAccess[].linkText',
    value: '',
  }, {
    enabled: true,
    name: 'materialsSpecification',
    path: 'item.electronicAccess[].materialsSpecification',
    value: '',
  }, {
    enabled: true,
    name: 'publicNote',
    path: 'item.electronicAccess[].publicNote',
    value: '',
  }],
  order: 0,
  path: 'item.electronicAccess[]',
}];

const initialFieldsProp = {
  circulationNotes: circulationNotes[0],
  electronicAccess: electronicAccess[0],
  formerIds: formerIds[0],
  notes: notes[0],
  statisticalCodeIds: statisticalCodeIds[0],
  yearCaption: yearCaption[0],
};
const referenceTablesProp = {};
const setReferenceTablesMockProp = jest.fn();
const getRepeatableFieldActionProp = jest.fn(() => 'DELETE_INCOMING');
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
    setReferenceTablesMockProp.mockClear();
  });

  afterAll(() => {
    delete global.fetch;
  });

  it('should have correct sections', async () => {
    const {
      findByRole,
      getByRole,
    } = renderMappingItemDetails({});

    expect(await findByRole('button', { name: /administrative data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /item data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /enumeration data/i })).toBeInTheDocument();
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

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
      expect(getByText('Former Identifier')).toBeInTheDocument();
    });

    it('User can delete former identifier', async () => {
      const { findByRole } = renderMappingItemDetails({ referenceTables: { formerIds } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
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

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
      expect(getByText('Statistical code')).toBeInTheDocument();
    });

    it('User can delete statistical code info', async () => {
      const { findByRole } = renderMappingItemDetails({ referenceTables: { statisticalCodeIds } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
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

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
      expect(getByRole('textbox', { name: /year, caption/i })).toBeInTheDocument();
    });

    it('User can delete "year, caption" field', async () => {
      const { findByRole } = renderMappingItemDetails({ referenceTables: { yearCaption } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
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

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
      expect(getByRole('textbox', { name: 'Note type' })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Note' })).toBeInTheDocument();
      expect(getByRole('combobox', { name: 'Staff only' })).toBeInTheDocument();
    });

    it('User can delete "year, caption" field', async () => {
      const { findByRole } = renderMappingItemDetails({ referenceTables: { notes } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
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

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
      expect(getByRole('textbox', { name: /note type/i })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Note' })).toBeInTheDocument();
      expect(getByRole('combobox', { name: /staff only/i })).toBeInTheDocument();
    });

    it('User can delete checkin / checkout field', async () => {
      const { findByRole } = renderMappingItemDetails({ referenceTables: { circulationNotes } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
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

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
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

      expect(setReferenceTablesMockProp).toHaveBeenCalled();
    });
  });
});
