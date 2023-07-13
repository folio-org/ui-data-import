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

import { LoanAndAvailability } from '../LoanAndAvailability';

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
const { circulationNotes } = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.ITEM.type).mappingFields);

const setReferenceTablesMock = jest.fn();
const getRepeatableFieldActionMock = jest.fn(() => 'DELETE_INCOMING');
const okapi = buildOkapi();

const renderLoanAndAvailability = () => {
  const component = () => (
    <LoanAndAvailability
      circulationNotes={circulationNotes}
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMock}
      getRepeatableFieldAction={getRepeatableFieldActionMock}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Item "Loan and availability" edit component', () => {
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
    } = renderLoanAndAvailability();
    const loanAndAvailabilityTitle = await findByRole('button', { name: /loan and availability/i, expanded: true });

    expect(loanAndAvailabilityTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByRole } = renderLoanAndAvailability();
    const loanAndAvailabilityTitle = await findByRole('button', { name: /loan and availability/i, expanded: true });

    expect(loanAndAvailabilityTitle).toBeInTheDocument();
  });

  describe('"Check in / Check out notes" field', () => {
    it('User can add "check in / check out" notes', async () => {
      const {
        findByRole,
        getByRole,
      } = renderLoanAndAvailability();

      const button = await findByRole('button', { name: 'Add check in / check out note' });

      fireEvent.click(button);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('circulationNotes');
      expect(getByRole('textbox', { name: /note type/i })).toBeInTheDocument();
      expect(getByRole('textbox', { name: 'Note' })).toBeInTheDocument();
      expect(getByRole('combobox', { name: /staff only/i })).toBeInTheDocument();
    });

    it('User can delete checkin / checkout field', async () => {
      const { findByRole } = renderLoanAndAvailability();

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
    });
  });
});
