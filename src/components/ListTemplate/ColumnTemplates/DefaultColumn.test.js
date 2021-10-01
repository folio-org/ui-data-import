import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { DefaultColumn } from './DefaultColumn';

const renderDefaultColumn = ({
  value,
  iconKey,
  showLabelsAsHotLink,
  searchTerm,
}) => {
  const component = (
    <Router>
      <DefaultColumn
        value={value}
        iconKey={iconKey}
        showLabelsAsHotLink={showLabelsAsHotLink}
        searchTerm={searchTerm}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('DefaultColumn', () => {
  describe('when label is as a hot link', () => {
    it('hot link should be rendered', () => {
      const {
        container,
        getByText,
      } = renderDefaultColumn({
        value: 'test value',
        iconKey: 'jobProfiles',
        searchTerm: '',
        showLabelsAsHotLink: true,
      });
      const hotlink = container.querySelector('a.link');

      expect(hotlink).toBeDefined();
      expect(getByText('test value')).toBeDefined();
    });
  });

  describe('when label is not as a hot link', () => {
    it('app icon should be rendered', () => {
      const {
        container,
        getByText,
      } = renderDefaultColumn({
        value: 'test value',
        iconKey: 'jobProfiles',
        searchTerm: 'tester',
        showLabelsAsHotLink: false,
      });
      const appIcon = container.querySelector('span.appIcon');

      expect(appIcon).toBeDefined();
      expect(getByText('test value')).toBeDefined();
    });
  });

  describe('label has no value', () => {
    it('no value should be shown', () => {
      const { getByText } = renderDefaultColumn({ value: null });

      expect(getByText('-')).toBeDefined();
    });
  });

  describe('when label has no icon', () => {
    it('contanet of label should be rendered', () => {
      const { getByText } = renderDefaultColumn({ value: 'test value' });

      expect(getByText('test value')).toBeDefined();
    });
  });
});
