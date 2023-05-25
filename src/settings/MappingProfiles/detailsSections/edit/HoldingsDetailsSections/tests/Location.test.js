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

import { STATUS_CODES } from '../../../../../../utils';

import { Location } from '../Location';

global.fetch = jest.fn();

const okapi = buildOkapi();

const renderLocation = () => {
  const component = () => (
    <Location
      setReferenceTables={noop}
      okapi={okapi}
    />
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Holdings "Location" edit component', () => {
  beforeAll(() => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: STATUS_CODES.OK,
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
    } = renderLocation();
    const locationTitle = await findByText('Location');

    expect(locationTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByText } = renderLocation();
    const locationTitle = await findByText('Location');

    expect(locationTitle).toBeInTheDocument();
  });
});
