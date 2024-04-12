import React from 'react';
import {
  fireEvent,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { runAxeTest } from '@folio/stripes-testing';

import '../../../test/jest/__mock__';

import {
  renderWithIntl,
  translationsProperties,
  renderWithRedux,
  jobLogsData,
} from '../../../test/jest/helpers';

import { DataFetcherContext } from '../../components';
import { Home } from '../Home';
import * as utils from '../../utils';

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
  ErrorModal: jest.fn(({
    open,
    onClose,
  }) => (open ? (
    <div>
      <span>Information modal</span>
      <button
        type="button"
        id="confirmButton"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  ) : null)),
}));
jest.mock('../../utils', () => ({
  ...jest.requireActual('../../utils'),
  trimLeadNumbers: jest.fn(fileName => fileName),
  deleteJobExecutions: jest.fn(),
}));

const initialStore = {
  'folio-data-import_landing': {
    hrIds: [],
    selectedJob: null,
  }
};

const storeWithData = {
  'folio-data-import_landing': {
    hrIds: [2, 11],
    selectedJob: 2,
  }
};

const defaultContext = {
  hasLoaded: true,
  jobs: [],
  logs: jobLogsData,
};

const renderHome = (store = initialStore, context = defaultContext) => {
  const component = (
    <Router>
      <DataFetcherContext.Provider value={context}>
        <Home />
      </DataFetcherContext.Provider>
    </Router>
  );

  return renderWithIntl(renderWithRedux(component, store), translationsProperties);
};

describe('Home component', () => {
  let mockStorage = {};

  beforeAll(() => {
    global.Storage.prototype.setItem = jest.fn((key, value) => {
      mockStorage[key] = value;
    });
  });

  beforeEach(() => {
    mockStorage = {};
    utils.trimLeadNumbers.mockClear();
  });

  afterAll(() => {
    utils.deleteJobExecutions.mockClear();
    global.Storage.prototype.setItem.mockReset();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderHome(storeWithData);

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered', async () => {
    const { findByText } = renderHome();

    await waitFor(() => expect(findByText('Logs')).toBeDefined());
  });

  it('should have actions menu', async () => {
    const { findByText } = renderHome();

    await waitFor(() => expect(findByText('Actions')).toBeDefined());
  });

  describe('when selected logs', () => {
    it('should render sub-heading', async () => {
      const {
        getAllByLabelText,
        findByText,
      } = renderHome();

      fireEvent.click(getAllByLabelText('select item')[0]);

      await waitFor(() => expect(findByText('1 log selected')).toBeDefined());
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
      it('confirmation modal should disappear', async () => {
        utils.deleteJobExecutions.mockResolvedValue({ jobExecutionDetails: [{}] });

        const {
          getAllByLabelText,
          getByText,
          queryByText,
        } = renderHome();

        fireEvent.click(getAllByLabelText('select item')[0]);
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));
        fireEvent.click(getByText('Confirm'));

        await waitFor(() => expect(queryByText('Confirmation modal')).not.toBeInTheDocument());
      });

      it('all checkboxes should be disabled', async () => {
        utils.deleteJobExecutions.mockResolvedValue({ jobExecutionDetails: [{}] });

        const {
          getAllByLabelText,
          findAllByRole,
          getByText,
        } = renderHome();

        fireEvent.click(getAllByLabelText('select item')[0]);
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));
        fireEvent.click(getByText('Confirm'));

        const checkboxes = await findAllByRole('checkbox');

        checkboxes.forEach(checkbox => {
          expect(checkbox).toBeDisabled();
        });
      });

      it('and successful callout should be displayed', async () => {
        utils.deleteJobExecutions.mockResolvedValue({ jobExecutionDetails: [{}] });

        const {
          getAllByLabelText,
          getByText,
          queryByText,
        } = renderHome();

        fireEvent.click(getAllByLabelText('select item')[0]);
        fireEvent.click(getByText('Actions'));
        fireEvent.click(getByText('Delete selected logs'));
        fireEvent.click(getByText('Confirm'));

        await waitFor(() => expect(queryByText('1 data import logs have been successfully deleted.')).toBeDefined());
      });

      describe('when deleting logs failed', () => {
        it('should show callout with error message', async () => {
          utils.deleteJobExecutions.mockRejectedValueOnce('Cannot delete jobExecutions');

          const {
            getAllByLabelText,
            getByText,
            queryByText,
          } = renderHome();

          fireEvent.click(getAllByLabelText('select item')[0]);
          fireEvent.click(getByText('Actions'));
          fireEvent.click(getByText('Delete selected logs'));
          fireEvent.click(getByText('Confirm'));

          await waitFor(() => expect(queryByText('Server communication problem. Please try again')).toBeDefined());
        });
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

    describe('when cancelled job was uploaded', () => {
      it('notification modal should be shown', async () => {
        const {
          getByText,
          getAllByLabelText,
        } = renderHome(storeWithData);

        fireEvent.click(getAllByLabelText('select item')[0]);

        await waitFor(() => expect(getByText('Information modal')).toBeInTheDocument());
      });

      describe('when click close notification button', () => {
        it('notification modal should be hidden', async () => {
          const {
            getByText,
            getAllByLabelText,
            queryByText,
          } = renderHome(storeWithData);

          fireEvent.click(getAllByLabelText('select item')[0]);

          await waitFor(() => expect(getByText('Information modal')).toBeInTheDocument());
          fireEvent.click(getByText('Close'));

          await waitFor(() => expect(queryByText('Information modal')).toBeNull());
        });
      });
    });
  });

  describe('when split status is enabled', () => {
    it('should call the function to trim lead numbers in file names', () => {
      renderHome(storeWithData, { ...defaultContext, isSplitStatusEnabled: true });

      expect(utils.trimLeadNumbers).toHaveBeenCalledTimes(defaultContext.logs.length);
    });
  });
});
