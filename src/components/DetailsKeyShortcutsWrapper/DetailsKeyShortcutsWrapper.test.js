import React from 'react';
import { fireEvent } from '@testing-library/react';
import { createMemoryHistory } from 'history';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import {
  CommandList,
  defaultKeyboardShortcuts,
} from '@folio/stripes/components';

import '../../../test/jest/__mock__';

import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { DetailsKeyShortcutsWrapper } from './DetailsKeyShortcutsWrapper';

const history = createMemoryHistory();

history.push = jest.fn();

const detailsKeyShortcutsWrapperProps = {
  recordId: 'testId',
  location: {
    search: '',
    pathname: '',
  },
};

const renderDetailsKeyShortcutsWrapper = ({
  recordId,
  location,
}) => {
  const childElement = <input data-testid="childElement" />;

  const component = () => (
    <CommandList commands={defaultKeyboardShortcuts}>
      <DetailsKeyShortcutsWrapper
        recordId={recordId}
        history={history}
        location={location}
      >
        <span>{childElement}</span>
      </DetailsKeyShortcutsWrapper>
    </CommandList>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('DetailsKeyShortcutsWrapper component', () => {
  afterEach(() => {
    history.push.mockClear();
  });

  it('should render children correctly', () => {
    const { getByTestId } = renderDetailsKeyShortcutsWrapper(detailsKeyShortcutsWrapperProps);

    expect(getByTestId('childElement')).toBeInTheDocument();
  });

  it('calls the correct handler when a key is pressed that matches the keyMap', () => {
    const { getByTestId } = renderDetailsKeyShortcutsWrapper(detailsKeyShortcutsWrapperProps);

    const childElement = getByTestId('childElement');

    childElement.focus();

    // TODO: move all those events to a separate test/jest/helpers/shortcuts.js file
    fireEvent.keyDown(childElement, {
      key: 'Ctrl',
      code: 'CtrlLeft',
      which: 17,
      keyCode: 17,
    });
    fireEvent.keyDown(childElement, {
      key: 'Alt',
      code: 'AltLeft',
      which: 18,
      keyCode: 18,
      ctrlKey: true,
    });
    fireEvent.keyDown(childElement, {
      key: 'e',
      keyCode: 69,
      which: 69,
      altKey: true,
      ctrlKey: true,
    });

    expect(history.push).toHaveBeenCalled();
  });
});
