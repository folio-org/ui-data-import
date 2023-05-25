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

import { ElectronicAccess } from '../ElectronicAccess';

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
const { electronicAccess } = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.HOLDINGS.type).mappingFields);

const setReferenceTablesMock = jest.fn();
const getRepeatableFieldActionMock = jest.fn(() => 'DELETE_INCOMING');
const okapi = buildOkapi();

const renderElectronicAccess = () => {
  const component = () => (
    <ElectronicAccess
      electronicAccess={electronicAccess}
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMock}
      getRepeatableFieldAction={getRepeatableFieldActionMock}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Holdings "Electronic access" edit component', () => {
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
    } = renderElectronicAccess();
    const electronicAccessTitle = await findByText('Electronic access');

    expect(electronicAccessTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByText } = renderElectronicAccess();
    const electronicAccessTitle = await findByText('Electronic access');

    expect(electronicAccessTitle).toBeInTheDocument();
  });

  describe('"Electronic access" field', () => {
    it('User can electronic access info', async () => {
      const {
        findByRole,
        getByText,
      } = renderElectronicAccess();

      const addButton = await findByRole('button', { name: 'Add electronic access' });

      fireEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('electronicAccess');
      expect(getByText('Relationship')).toBeInTheDocument();
      expect(getByText('URI')).toBeInTheDocument();
      expect(getByText('Link text')).toBeInTheDocument();
      expect(getByText('Materials specified')).toBeInTheDocument();
      expect(getByText('URL public note')).toBeInTheDocument();
    });

    it('User can delete electronic access info', async () => {
      const { findByRole } = renderElectronicAccess();

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(electronicAccess);
    });
  });
});
