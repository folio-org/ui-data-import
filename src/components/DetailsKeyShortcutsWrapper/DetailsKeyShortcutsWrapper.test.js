import React from 'react';

import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';

import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { DetailsKeyShortcutsWrapper } from './DetailsKeyShortcutsWrapper';

const mockHistoryPush = jest.fn();

const detailsKeyShortcutsWrapperProps = {
  recordId: 'testId',
  history: { push: mockHistoryPush },
  location: {
    search: '',
    pathname: '',
  },
};

const renderDetailsKeyShortcutsWrapper = ({
  recordId,
  history,
  location,
}) => {
  const childElement = <input data-testid="childElement" />;

  const component = () => (
    <DetailsKeyShortcutsWrapper
      recordId={recordId}
      history={history}
      location={location}
    >
      <span>{childElement}</span>
    </DetailsKeyShortcutsWrapper>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('DetailsKeyShortcutsWrapper component', () => {
  it('should render children correctly', () => {
    const { getByTestId } = renderDetailsKeyShortcutsWrapper(detailsKeyShortcutsWrapperProps);

    expect(getByTestId('childElement')).toBeInTheDocument();
  });
  it('calls the correct handler when a key is pressed that matches the keyMap', () => {
    const { getByTestId } = renderDetailsKeyShortcutsWrapper(detailsKeyShortcutsWrapperProps);

    const inputElement = getByTestId('childElement');

    // inputElement.focus();

    fireEvent.focus(inputElement);

    fireEvent.keyDown(inputElement, {
      key: 'C',
      code: 'KeyC',
      altKey: true,
      // which: 67,
      // ctrlKey: true,
      // ctrlKey: true,
    });

    expect(mockHistoryPush).toHaveBeenCalled();
  });
});
