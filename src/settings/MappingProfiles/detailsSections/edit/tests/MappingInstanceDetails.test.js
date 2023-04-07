import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { MappingInstanceDetails } from '../MappingInstanceDetails';
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

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.INSTANCE.type);

const {
  electronicAccess, // eslint-disable-line no-unused-vars
  statisticalCodeIds,
  administrativeNotes,
  parentInstances,
  childInstances,
  natureOfContentTermIds,
  ...defaultReferenceTables
} = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.INSTANCE.type).mappingFields);

const setReferenceTablesMockProp = jest.fn();
const getRepeatableFieldActionProp = jest.fn(() => '');
const okapiProp = {
  tenant: 'testTenant',
  token: 'token.for.test',
  url: 'https://folio-testing-okapi.dev.folio.org',
};

const renderMappingInstanceDetails = ({ referenceTables = defaultReferenceTables }) => {
  const component = () => (
    <MappingInstanceDetails
      initialFields={initialFieldsProp}
      referenceTables={referenceTables}
      setReferenceTables={setReferenceTablesMockProp}
      getRepeatableFieldAction={getRepeatableFieldActionProp}
      okapi={okapiProp}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('MappingInstanceDetails edit component', () => {
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
    const { container } = renderMappingInstanceDetails({});

    await runAxeTest({ rootNode: container });
  });

  it('should have correct sections', async () => {
    const {
      getByRole,
      findByRole,
    } = renderMappingInstanceDetails({});

    expect(await findByRole('button', { name: /administrative data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /title data/i })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /identifier/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /contributor/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', { name: /descriptive data/i })).toBeInTheDocument();
    expect(getByRole('button', { name: /instance notes/i })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /electronic access/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /subject/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /classification/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /instance relationship \(analytics and bound-with\)/i,
      expanded: true,
    })).toBeInTheDocument();
    expect(getByRole('button', {
      name: /related instances/i,
      expanded: true,
    })).toBeInTheDocument();
  });

  describe('"Statistical codes" field', () => {
    it('User can add statistical code info', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingInstanceDetails({ referenceTables: { statisticalCodeIds } });

      const button = await findByRole('button', { name: /add statistical code/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('statisticalCodeIds');
      expect(getByText('Statistical code')).toBeInTheDocument();
    });

    it('User can delete statistical code info', async () => {
      const { findByRole } = renderMappingInstanceDetails({ referenceTables: { statisticalCodeIds } });

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
      } = renderMappingInstanceDetails({ referenceTables: { administrativeNotes } });

      const button = await findByRole('button', { name: /add administrative note/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('administrativeNotes');
      expect(getByText('Administrative note')).toBeInTheDocument();
    });

    it('User can delete administrative note info', async () => {
      const { findByRole } = renderMappingInstanceDetails({ referenceTables: { administrativeNotes } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(administrativeNotes);
    });
  });

  describe('"Nature of content terms" field', () => {
    it('User can add nature of content term info', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingInstanceDetails({ referenceTables: { natureOfContentTermIds } });

      const button = await findByRole('button', { name: /add nature of content term/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('natureOfContentTermIds');
      expect(getByText('Nature of content term')).toBeInTheDocument();
    });

    it('User can delete nature of content term info', async () => {
      const { findByRole } = renderMappingInstanceDetails({ referenceTables: { natureOfContentTermIds } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(natureOfContentTermIds);
    });
  });

  describe('Parent instances" field', () => {
    it('User can add parent instance', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingInstanceDetails({ referenceTables: { parentInstances } });

      const button = await findByRole('button', { name: /add parent instance/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('parentInstances');
      expect(getByText('Parent instance')).toBeInTheDocument();
      expect(getByText('Type of relation')).toBeInTheDocument();
    });

    it('User can delete parent instance', async () => {
      const { findByRole } = renderMappingInstanceDetails({ referenceTables: { parentInstances } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(parentInstances);
    });
  });

  describe('Child instances" field', () => {
    it('User can add child instance', async () => {
      const {
        findByRole,
        getByText,
      } = renderMappingInstanceDetails({ referenceTables: { childInstances } });

      const button = await findByRole('button', { name: /add child instance/i });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('childInstances');
      expect(getByText('Child instance')).toBeInTheDocument();
      expect(getByText('Type of relation')).toBeInTheDocument();
    });

    it('User can delete child instance', async () => {
      const { findByRole } = renderMappingInstanceDetails({ referenceTables: { childInstances } });

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(childInstances);
    });
  });
});
