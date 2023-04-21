import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../../../../../test/jest/__mock__';
import {
  renderWithIntl,
  renderWithReduxForm,
  translationsProperties,
} from '../../../../../../../test/jest/helpers';

import { RelatedInstances } from '../RelatedInstances';

global.fetch = jest.fn();

const renderRelatedInstances = () => {
  const component = () => <RelatedInstances />;

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('Instance "Related instances" edit component', () => {
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
      findByRole,
    } = renderRelatedInstances();
    const relatedInstacesTitle = await findByRole('button', { name: /related instances/i, expanded: true });

    expect(relatedInstacesTitle).toBeInTheDocument();

    await runAxeTest({ rootNode: container });
  });

  it('should render correct section', async () => {
    const { findByRole } = renderRelatedInstances();
    const relatedInstacesTitle = await findByRole('button', { name: /related instances/i, expanded: true });

    expect(relatedInstacesTitle).toBeInTheDocument();
  });
});
