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

import { DescriptiveData } from '../DescriptiveData';

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

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.INSTANCE.type);
const {
  publication,
  editions,
  physicalDescriptions,
  natureOfContentTermIds,
  languages,
  instanceFormatIds,
  publicationFrequency,
  publicationRange,
} = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.INSTANCE.type).mappingFields);

const setReferenceTablesMock = jest.fn();
const getRepeatableFieldActionMock = jest.fn(() => 'DELETE_INCOMING');
const okapi = buildOkapi();

const renderDescriptiveData = () => {
  const component = () => (
    <DescriptiveData
      publications={publication}
      editions={editions}
      physicalDescriptions={physicalDescriptions}
      natureOfContentTermIds={natureOfContentTermIds}
      languages={languages}
      instanceFormatIds={instanceFormatIds}
      publicationFrequency={publicationFrequency}
      publicationRange={publicationRange}
      initialFields={initialFieldsProp}
      setReferenceTables={setReferenceTablesMock}
      getRepeatableFieldAction={getRepeatableFieldActionMock}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Instance "Descriptive data" edit component', () => {
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
    } = renderDescriptiveData();
    const descriptiveDataTitle = await findByText('Descriptive data');

    expect(descriptiveDataTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByText } = renderDescriptiveData();
    const descriptiveDataTitle = await findByText('Descriptive data');

    expect(descriptiveDataTitle).toBeInTheDocument();
  });

  describe('"Nature of content terms" field', () => {
    it('User can add nature of content term info', async () => {
      const {
        findByRole,
        getByText,
      } = renderDescriptiveData();

      const addButton = await findByRole('button', { name: /add nature of content term/i });

      fireEvent.click(addButton);

      expect(onAdd).toHaveBeenCalledTimes(1);
      expect(onAdd.mock.calls[0][1]).toBe('natureOfContentTermIds');
      expect(getByText('Nature of content term')).toBeInTheDocument();
    });

    it('User can delete nature of content term info', async () => {
      const { findByRole } = renderDescriptiveData();

      const deleteButton = await findByRole('button', { name: /delete this item/i });

      fireEvent.click(deleteButton);

      expect(onRemove).toHaveBeenCalledTimes(1);
      expect(onRemove.mock.calls[0][1]).toEqual(natureOfContentTermIds);
    });
  });
});
