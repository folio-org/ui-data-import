import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { ProhibitionIcon } from './ProhibitionIcon';

const renderProhibitionIcon = ariaLabel => {
  const component = (
    <ProhibitionIcon
      ariaLabel={ariaLabel}
      fieldName="test-field-name"
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ProhibitionIcon component', () => {
  describe('when ariaLabel is passed', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderProhibitionIcon('test-aria-label');

      await runAxeTest({ rootNode: container });
    });

    it('then icon should be rendered with the custom ariaLabel', () => {
      const { container } = renderProhibitionIcon('test-aria-label');

      const element = container.querySelector('[aria-label="test-aria-label"]');

      expect(element).toBeDefined();
    });
  });

  describe('when ariaLabel is not passed', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderProhibitionIcon('test-aria-label');

      await runAxeTest({ rootNode: container });
    });

    it('then icon should be rendered with the default ariaLabel', () => {
      const { container } = renderProhibitionIcon();

      const element = container.querySelector('[aria-label="Cannot be mapped"]');

      expect(element).toBeDefined();
    });
  });
});
