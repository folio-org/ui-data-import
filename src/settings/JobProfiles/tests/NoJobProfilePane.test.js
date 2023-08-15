import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { createMemoryHistory } from 'history';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { NoJobProfilePane } from '../ViewJobProfile';

const history = createMemoryHistory();
history.go = jest.fn();

const onCloseMock = jest.fn();

const renderNoJobProfilePane = () => {
  const component = (
    <Router>
      <NoJobProfilePane
        history={history}
        onClose={onCloseMock}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('NoJobProfilePane component', () => {
  afterEach(() => {
    history.go.mockClear();
    onCloseMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderNoJobProfilePane();

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered', () => {
    const { getByText } = renderNoJobProfilePane();

    expect(getByText('Job profile deleted')).toBeInTheDocument();
    expect(getByText('Not available - this job profile has been deleted')).toBeInTheDocument();
    expect(getByText('Return to previous screen')).toBeInTheDocument();
  });

  describe('when click close button', () => {
    it('function to close pane should be called', () => {
      const { container } = renderNoJobProfilePane();
      const closeButton = container.querySelector('.paneHeaderCloseIcon');
      fireEvent.click(closeButton);

      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  describe('when click "Return to previous screen" button', () => {
    it('function to return to the previous page should be called', () => {
      const { getByText } = renderNoJobProfilePane();
      const returnButton = getByText('Return to previous screen');
      fireEvent.click(returnButton);

      expect(history.go).toHaveBeenCalled();
    });
  });
});
