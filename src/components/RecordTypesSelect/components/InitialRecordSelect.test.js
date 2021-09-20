import React from 'react';
import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { InitialRecordSelect } from './InitialRecordSelect';

const renderInitialRecordSelect = () => {
  const component = (
    <InitialRecordSelect
      onItemSelect={noop}
      id="testId"
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('InitialRecordSelect', () => {
  it('heading should be rendered', () => {
    const { getByText } = renderInitialRecordSelect();
    const heading = getByText('Which type of existing record would you like to compare to the incoming MARC record?');

    expect(heading).toBeDefined();
  });
});