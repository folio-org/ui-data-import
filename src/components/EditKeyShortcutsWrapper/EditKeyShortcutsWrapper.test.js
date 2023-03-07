import React from 'react';
import { waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';

import {
  renderWithFinalForm,
  translationsProperties,
  saveShortcut,
} from '../../../test/jest/helpers';

import { EditKeyShortcutsWrapper } from './EditKeyShortcutsWrapper';

const {
  CommandList,
  defaultKeyboardShortcuts,
} = require('@folio/stripes/components');

const mockOnSubmitProp = jest.fn(() => Promise.resolve('test value'));

jest.mock('@folio/stripes/smart-components', () => ({ ...jest.requireActual('@folio/stripes/smart-components') }), { virtual: true });

const renderEditKeyShortcutsWrapper = ({ onSubmit }) => {
  const childElement = <span>Child element</span>;

  const component = () => (
    <CommandList commands={defaultKeyboardShortcuts}>
      <EditKeyShortcutsWrapper onSubmit={onSubmit}>
        {childElement}
      </EditKeyShortcutsWrapper>
    </CommandList>
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('EditKeyShortcutsWrapper component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderEditKeyShortcutsWrapper({ onSubmit: mockOnSubmitProp });
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should render children correctly', () => {
    const { getByText } = renderEditKeyShortcutsWrapper({ onSubmit: mockOnSubmitProp });

    expect(getByText('Child element')).toBeInTheDocument();
  });

  it('should call the assigned handler to (save) command', async () => {
    const { getByText } = renderEditKeyShortcutsWrapper({ onSubmit: mockOnSubmitProp });

    const childElement = getByText('Child element');

    childElement.focus();

    saveShortcut(childElement);

    await waitFor(() => expect(mockOnSubmitProp).toHaveBeenCalled());
  });
});
