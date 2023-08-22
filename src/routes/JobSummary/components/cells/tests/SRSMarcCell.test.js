import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  translationsProperties,
} from '../../../../../../test/jest/helpers';

import { SRSMarcCell } from '../SRSMarcCell';

const renderSRSMarcCell = () => {
  const component = <SRSMarcCell sourceRecordActionStatus="CREATED" />;

  return renderWithIntl(component, translationsProperties);
};

describe('SRSMarcCell component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderSRSMarcCell();

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered', () => {
    const { getByText } = renderSRSMarcCell();

    expect(getByText('Created')).toBeInTheDocument();
  });
});
