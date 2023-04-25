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

import { MappingHoldingsDetails } from '../MappingHoldingsDetails';
import {
  onAdd,
  onRemove,
} from '../../utils';
import { getInitialFields } from '../../../initialDetails';

jest.mock('../HoldingsDetailsSections', () => ({
  AdministrativeData: () => <span>AdministrativeData</span>,
  Location: () => <span>Location</span>,
  HoldingsDetails: () => <span>HoldingsDetails</span>,
  HoldingsNotes: () => <span>HoldingsNotes</span>,
  ElectronicAccess: () => <span>ElectronicAccess</span>,
  ReceivingHistory: () => <span>ReceivingHistory</span>,
}));

jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  onAdd: jest.fn(),
  onRemove: jest.fn(),
}));

global.fetch = jest.fn();

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.HOLDINGS.type);

const referenceTablesProp = {};
const setReferenceTablesMockProp = jest.fn();
const getRepeatableFieldActionProp = jest.fn(() => 'DELETE_INCOMING');
const okapi = buildOkapi();

const renderMappingHoldingsDetails = ({ referenceTables }) => {
  const component = () => (
    <MappingHoldingsDetails
      initialFields={initialFieldsProp}
      referenceTables={referenceTables || referenceTablesProp}
      setReferenceTables={setReferenceTablesMockProp}
      getRepeatableFieldAction={getRepeatableFieldActionProp}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('MappingHoldingsDetails edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
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
    const { container } = renderMappingHoldingsDetails({});

    await runAxeTest({ rootNode: container });
  });

  it('should have correct sections', async () => {
    const { getByText } = renderMappingHoldingsDetails({});

    expect(getByText('AdministrativeData')).toBeInTheDocument();
    expect(getByText('Location')).toBeInTheDocument();
    expect(getByText('HoldingsDetails')).toBeInTheDocument();
    expect(getByText('HoldingsNotes')).toBeInTheDocument();
    expect(getByText('ElectronicAccess')).toBeInTheDocument();
    expect(getByText('ReceivingHistory')).toBeInTheDocument();
  });
});
