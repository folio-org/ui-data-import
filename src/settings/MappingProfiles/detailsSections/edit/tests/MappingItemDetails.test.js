import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';

import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { STATUS_CODES } from '../../../../../utils';
import { MappingItemDetails } from '../MappingItemDetails';
import {
  onAdd,
  onRemove,
} from '../../utils';
import { getInitialFields } from '../../../initialDetails';

jest.mock('../ItemDetailSection', () => ({
  AdministrativeData: () => <span>AdministrativeData</span>,
  ItemData: () => <span>ItemData</span>,
  EnumerationData: () => <span>EnumerationData</span>,
  Condition: () => <span>Condition</span>,
  ItemNotes: () => <span>ItemNotes</span>,
  LoanAndAvailability: () => <span>LoanAndAvailability</span>,
  Location: () => <span>Location</span>,
  ElectronicAccess: () => <span>ElectronicAccess</span>,
}));

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  onAdd: jest.fn(),
  onRemove: jest.fn(),
}));

global.fetch = jest.fn();

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.ITEM.type);

const setReferenceTablesMockProp = jest.fn();
const getRepeatableFieldActionProp = jest.fn(() => '');

const okapi = buildOkapi();

const renderMappingItemDetails = () => {
  const component = () => (
    <MappingItemDetails
      initialFields={initialFieldsProp}
      referenceTables={{}}
      setReferenceTables={setReferenceTablesMockProp}
      getRepeatableFieldAction={getRepeatableFieldActionProp}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('MappingItemDetails edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: STATUS_CODES.OK,
      json: async () => ({}),
    });
  });

  afterEach(() => {
    onAdd.mockClear();
    onRemove.mockClear();
  });

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderMappingItemDetails();

    await runAxeTest({ rootNode: container });
  });

  it('should have correct sections', async () => {
    const { getByText } = renderMappingItemDetails();

    expect(getByText('AdministrativeData')).toBeInTheDocument();
    expect(getByText('ItemData')).toBeInTheDocument();
    expect(getByText('EnumerationData')).toBeInTheDocument();
    expect(getByText('Condition')).toBeInTheDocument();
    expect(getByText('ItemNotes')).toBeInTheDocument();
    expect(getByText('LoanAndAvailability')).toBeInTheDocument();
    expect(getByText('Location')).toBeInTheDocument();
    expect(getByText('ElectronicAccess')).toBeInTheDocument();
  });
});
