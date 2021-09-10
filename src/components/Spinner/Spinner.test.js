import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { Spinner } from './Spinner';

jest.mock('@folio/stripes/components', () => ({
  ...jest.requireActual('@folio/stripes/components'),
  PaneHeader: ({ onClose }) => (
    <button
      type="button"
      onClick={onClose}
    >
      Close
    </button>
  ),
}));

const spinnerProps = { entity: { props: { onClose: () => {} } } };

const renderSpinner = ({ entity }) => {
  const component = <Spinner entity={entity} />;

  return renderWithIntl(component, translationsProperties);
};

describe('Spinner component', () => {
  it('should render preloader', () => {
    const { getByText } = renderSpinner(spinnerProps);

    expect(getByText('Loading')).toBeDefined();
  });

  it('should have preloader class', () => {
    const { container } = renderSpinner(spinnerProps);

    const preloaderClass = container.querySelector('.preloader');

    expect(preloaderClass).toBeInTheDocument();
  });

  describe('when clicking on header close button', () => {
    it('should close the pane', () => {
      const onClose = jest.fn();
      const { getByText } = renderSpinner({ entity: { props: { onClose } } });

      fireEvent.click(getByText('Close'));

      expect(onClose.mock.calls.length).toEqual(1);
    });
  });
});