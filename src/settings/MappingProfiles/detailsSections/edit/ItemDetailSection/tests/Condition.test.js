import React from 'react';
import { noop } from 'lodash';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../../test/jest/__mock__';

import {
  buildOkapi,
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { Condition } from '../Condition';

global.fetch = jest.fn();

const okapi = buildOkapi();

const renderCondition = () => {
  const component = () => (
    <Condition
      setReferenceTables={noop}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Item "Condition" edit component', () => {
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
    const {
      container,
      findByText,
    } = renderCondition();
    const conditionTitle = await findByText('Condition');

    expect(conditionTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByText } = renderCondition();
    const conditionTitle = await findByText('Condition');

    expect(conditionTitle).toBeInTheDocument();
  });
});
