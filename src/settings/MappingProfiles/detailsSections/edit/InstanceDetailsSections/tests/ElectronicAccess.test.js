import React from 'react';
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

import {
  getInitialDetails,
  getReferenceTables,
} from '../../../../initialDetails';

jest.mock('../../../../../../components/AcceptedValuesField/AcceptedValuesField', () => ({
  ...jest.requireActual('../../../../../../components/AcceptedValuesField/AcceptedValuesField'),
  AcceptedValuesField: () => <span>AcceptedValuesField</span>,
}));

const { electronicAccess } = getReferenceTables(getInitialDetails(FOLIO_RECORD_TYPES.INSTANCE.type).mappingFields);

const okapi = buildOkapi();

const renderElectronicAccess = () => {
  const component = () => (
    <ElectronicAccess
      electronicAccess={electronicAccess}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Instance "Electronic access" edit component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderElectronicAccess();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct fields', async () => {
    const { getByText } = renderElectronicAccess();

    expect(getByText('Add electronic access')).toBeInTheDocument();
    expect(getByText(/uri/i)).toBeInTheDocument();
    expect(getByText(/link text/i)).toBeInTheDocument();
    expect(getByText(/materials specified/i)).toBeInTheDocument();
    expect(getByText(/url public note/i)).toBeInTheDocument();
  });
});
