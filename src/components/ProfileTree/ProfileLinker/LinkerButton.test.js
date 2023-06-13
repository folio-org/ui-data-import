import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../../test/jest/helpers';
import '../../../../test/jest/__mock__';

import { LinkerButton } from './LinkerButton';

const onClick = jest.fn();
const linkerButtonProps = {
  id: 'testId',
  entityKey: 'jobProfiles',
};

const renderLinkerButton = ({
  id,
  entityKey,
  searchLabel,
  className,
  isButtonDisabled,
  dataAttributes,
}) => {
  const component = (
    <div role="menu">
      <LinkerButton
        id={id}
        entityKey={entityKey}
        onClick={onClick}
        searchLabel={searchLabel}
        className={className}
        isButtonDisabled={isButtonDisabled}
        dataAttributes={dataAttributes}
      />
    </div>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('LinkerButton component', () => {
  afterEach(() => {
    onClick.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderLinkerButton(linkerButtonProps);

    await runAxeTest({ rootNode: container });
  });

  it('should be rendered with FormattedMessage title', () => {
    const { getByText } = renderLinkerButton(linkerButtonProps);

    expect(getByText('Job')).toBeDefined();
  });

  it('should be rendered with text type title', () => {
    const { getByText } = renderLinkerButton({
      ...linkerButtonProps,
      searchLabel: 'test label',
    });

    expect(getByText('test label')).toBeDefined();
  });

  it('should be rendered with node type title', () => {
    const { getByText } = renderLinkerButton({
      ...linkerButtonProps,
      searchLabel: <span>test label</span>,
    });

    expect(getByText('test label')).toBeDefined();
  });

  describe('when clicking on button', () => {
    it('should be called onClick function', () => {
      const { getByText } = renderLinkerButton({
        ...linkerButtonProps,
        searchLabel: <span>test label</span>,
      });

      fireEvent.click(getByText('test label'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
