import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import { waitFor } from '@testing-library/react';

import { buildResources } from '@folio/stripes-data-transfer-components/test/helpers';

import { noop } from 'lodash';

import '../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import {
  renderWithReduxForm, translationsProperties,
} from '../../../test/jest/helpers';

import { MARCFieldProtection } from './MARCFieldProtection';

const resources = buildResources({
  resourceName: 'values',
  records: [{
    id: '2d706874-8a10-4d3e-a190-33c301d157e3',
    field: '001',
    indicator1: '',
    indicator2: '',
    subfield: '',
    data: '*',
    source: 'SYSTEM',
    override: false,
    metadata: {
      createdDate: '2020-08-13T14:44:00.000+00:00',
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdByUsername: 'System',
      updatedDate: '2020-08-13T14:44:00.000+00:00',
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedByUsername: 'System',
    },
  }, {
    id: '82d0b904-f8b0-4cc2-b238-7d8cddef7b7e',
    field: '999',
    indicator1: 'f',
    indicator2: 'f',
    subfield: '*',
    data: '*',
    source: 'SYSTEM',
    override: false,
    metadata: {
      createdDate: '2020-08-13T14:44:00.000+00:00',
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdByUsername: 'System',
      updatedDate: '2020-08-13T14:44:00.000+00:00',
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedByUsername: 'System',
    },
  }, {
    id: '82d0b904-f8b0-4cc2-b238-7d8cddef7b7e',
    field: '*',
    indicator1: '/',
    indicator2: '/',
    subfield: '*',
    data: '',
    source: 'SYSTEM',
    override: false,
    metadata: {
      createdDate: '2020-08-13T14:44:00.000+00:00',
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdByUsername: 'System',
      updatedDate: '2020-08-13T14:44:00.000+00:00',
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedByUsername: 'System',
    },
  },
  ],
});

const stripesDefaultProps = {
  okapi: { url: 'https://folio-testing-okapi.dev.folio.org' },
  logger: { log: noop },
  connect: Component => props => (
    <Component
      {...props}
      mutator={{}}
      resources={resources}
      hasPerm={noop}
    />
  ),
};

const renderMarcFieldProtection = () => {
  const stripes = Object.assign(stripesDefaultProps, {});
  const component = () => (
    <Router>
      <MARCFieldProtection stripes={stripes} />
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('MARCFieldProtection component', () => {
  it('Render the component as wrapped component with connect method', () => {
    waitFor(() => expect(renderMarcFieldProtection()).toBeDefined());
  });

  it('Check if data is rendered correctly', () => {
    const { getByText } = renderMarcFieldProtection();

    waitFor(() => expect(getByText('001')).toBeDefined());
  });
});
