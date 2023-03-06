import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { WithTranslation } from './WithTranslation';

expect.extend(toHaveNoViolations);

const childrenWithLabel = label => <span>{label}</span>;

const renderWithTranslation = ({
  wrapperLabel,
  children = childrenWithLabel,
}) => {
  const component = (
    <WithTranslation wrapperLabel={wrapperLabel}>
      {children}
    </WithTranslation>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('WithTranslation component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderWithTranslation({ wrapperLabel: 'ui-data-import.meta.title' });
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  describe('when wrapper label prop is translation id', () => {
    it('should render formatted message', () => {
      const { getByText } = renderWithTranslation({ wrapperLabel: 'ui-data-import.meta.title' });

      expect(getByText('Data import')).toBeDefined();
    });
  });

  describe('when wrapper label prop is not translation id', () => {
    it('should render the label explicitly', () => {
      const { getByText } = renderWithTranslation({ wrapperLabel: 'Data import' });

      expect(getByText('Data import')).toBeDefined();
    });
  });

  describe('when wrapper label prop is FormattedMessage component', () => {
    it('should render the formatted message', () => {
      const { getByText } = renderWithTranslation({ wrapperLabel: <FormattedMessage id="ui-data-import.meta.title" /> });

      expect(getByText('Data import')).toBeDefined();
    });
  });
});
