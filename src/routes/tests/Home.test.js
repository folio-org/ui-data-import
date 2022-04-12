import React from 'react';
import { fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { DataFetcherContext } from '../../components';
import { Home } from '../Home';
import { jobsLogs } from '../../../test/bigtest/mocks';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  ConfirmationModal: jest.fn(({
    open,
    onCancel,
    onConfirm,
  }) => (open ? (
    <div>
      <span>Confirmation modal</span>
      <button
        type="button"
        onClick={onCancel}
      >
        Cancel
      </button>
      <button
        type="button"
        id="confirmButton"
        onClick={onConfirm}
      >
        Confirm
      </button>
    </div>
  ) : null)),
}));

const defaultContext = {
  hasLoaded: true,
  jobs: [],
  logs: jobsLogs,
};

const renderHome = (context = defaultContext) => {
  const component = (
    <Router>
      <DataFetcherContext.Provider value={context}>
        <Home />
      </DataFetcherContext.Provider>
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Home component', () => {
  it('should be rendered', () => {
    const { getByText } = renderHome();

    expect(getByText('Logs')).toBeDefined();
  });

  it('should have actions menu', () => {
    const { getByText } = renderHome();

    expect(getByText('Actions')).toBeDefined();
  });

  describe('when selected logs', () => {
    it('should render sub-heading', async () => {
      const {
        getAllByLabelText,
        getByText,
      } = renderHome();

      fireEvent.click(getAllByLabelText('select item')[0]);

      expect(getByText('1 log selected')).toBeDefined();
    });
  });

  describe('when deleting selected logs', () => {
    it('confirmation modal should appear', () => {
      const {
        getAllByLabelText,
        getByText,
      } = renderHome();

      fireEvent.click(getAllByLabelText('select item')[0]);
      fireEvent.click(getByText('Actions'));
      fireEvent.click(getByText('Delete selected logs'));

      expect(getByText('Confirmation modal')).toBeDefined();
    });

    describe('when confirm deleting logs', () => {
      it('confirmation modal should disappear', () => {
        const {
          getAllByLabelText,
          getByText,
          queryByText,
        } = renderHome();

        fireEvent.click(getAllByLabelText('select item')[0]);
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));
        fireEvent.click(getByText('Confirm'));

        expect(queryByText('Confirmation modal')).toBeNull();
      });
    });

    describe('when cancel deleting logs', () => {
      it('confirmation modal should disappear', () => {
        const {
          getAllByLabelText,
          getByText,
          queryByText,
        } = renderHome();

        fireEvent.click(getAllByLabelText('select item')[0]);
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));
        fireEvent.click(getByText('Cancel'));

        expect(queryByText('Confirmation modal')).toBeNull();
      });
    });
  });
});