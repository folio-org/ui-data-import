import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';

import { createMemoryHistory } from 'history';

import {
  renderWithIntl,
  buildStripes,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { DataImportSettings } from '../DataImportSettings';

const history = createMemoryHistory();

const stripesProp = buildStripes();
const additionalProps = {
  actAs: 'settings',
  history,
  location: {
    hash: '',
    key: 'testKey',
    pathname: '/settings/data-import',
    search: '',
    state: undefined,
  },
  match: {
    isExact: true,
    params: {},
    path: '/settings/data-import',
    url: '/settings/data-import',
  },
  showSettings: true,
};

const renderDataImportSettings = () => {
  const component = (
    <Router>
      <DataImportSettings
        {...additionalProps}
        stripes={stripesProp}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('<DataImportSettings>', () => {
  it('renders correct heading', () => {
    const { getByText } = renderDataImportSettings();

    expect(getByText('Data import')).toBeInTheDocument();
  });

  it('has correct section', () => {
    const { getByText } = renderDataImportSettings();

    expect(getByText('Profiles')).toBeInTheDocument();
    expect(getByText('Other')).toBeInTheDocument();
  });

  describe('"Profiles" section', () => {
    it('has correct links', () => {
      const { getByRole } = renderDataImportSettings();

      expect(getByRole('link', { name: /job profiles/i })).toBeInTheDocument();
      expect(getByRole('link', { name: /match profiles/i })).toBeInTheDocument();
      expect(getByRole('link', { name: /action profiles/i })).toBeInTheDocument();
      expect(getByRole('link', { name: /field mapping profiles/i })).toBeInTheDocument();
    });

    it('has "info" button', () => {
      const { getByRole } = renderDataImportSettings();

      expect(getByRole('button', { name: /info/i })).toBeInTheDocument();
    });

    it('upon clicking "info" button, Info pop-up appears', async () => {
      const {
        getByRole,
        getByText,
      } = renderDataImportSettings();

      const infoButton = getByRole('button', { name: /info/i });

      fireEvent.click(infoButton);

      await waitFor(() => expect(getByText('Learn more')).toBeInTheDocument());
    });
  });

  describe('"Other" section', () => {
    it('has correct links', () => {
      const { getByRole } = renderDataImportSettings();

      expect(getByRole('link', { name: /file extensions/i })).toBeInTheDocument();
      expect(getByRole('link', { name: /marc field protection/i })).toBeInTheDocument();
    });
  });
});
