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

import { MappingInstanceDetails } from '../MappingInstanceDetails';
import {
  getInitialDetails,
  getInitialFields,
  getReferenceTables,
} from '../../../initialDetails';

jest.mock('../InstanceDetailsSections', () => ({
  AdministrativeData: () => <span>AdministrativeData</span>,
  TitleData: () => <span>TitleData</span>,
  Identifier: () => <span>Identifier</span>,
  Contributor: () => <span>Contributor</span>,
  DescriptiveData: () => <span>DescriptiveData</span>,
  InstanceNotes: () => <span>InstanceNotes</span>,
  ElectronicAccess: () => <span>ElectronicAccess</span>,
  Subject: () => <span>Subject</span>,
  Classification: () => <span>Classification</span>,
  InstanceRelationship: () => <span>InstanceRelationship</span>,
  RelatedInstances: () => <span>RelatedInstances</span>,
}));

global.fetch = jest.fn();

const initialFieldsProp = getInitialFields(FOLIO_RECORD_TYPES.INSTANCE.type);

const referenceTables = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.INSTANCE.type).mappingFields);

const setReferenceTablesMockProp = jest.fn();
const getRepeatableFieldActionProp = jest.fn(() => '');
const okapi = buildOkapi();

const renderMappingInstanceDetails = () => {
  const component = () => (
    <MappingInstanceDetails
      initialFields={initialFieldsProp}
      referenceTables={referenceTables}
      setReferenceTables={setReferenceTablesMockProp}
      getRepeatableFieldAction={getRepeatableFieldActionProp}
      okapi={okapi}
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

  afterAll(() => {
    global.fetch.mockClear();
    delete global.fetch;
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderMappingInstanceDetails();

    await runAxeTest({ rootNode: container });
  });

  it('should have correct sections', async () => {
    const { getByText } = renderMappingInstanceDetails();

    expect(getByText('AdministrativeData')).toBeInTheDocument();
    expect(getByText('TitleData')).toBeInTheDocument();
    expect(getByText('Identifier')).toBeInTheDocument();
    expect(getByText('Contributor')).toBeInTheDocument();
    expect(getByText('DescriptiveData')).toBeInTheDocument();
    expect(getByText('InstanceNotes')).toBeInTheDocument();
    expect(getByText('ElectronicAccess')).toBeInTheDocument();
    expect(getByText('Subject')).toBeInTheDocument();
    expect(getByText('Classification')).toBeInTheDocument();
    expect(getByText('InstanceRelationship')).toBeInTheDocument();
    expect(getByText('RelatedInstances')).toBeInTheDocument();
  });
});
