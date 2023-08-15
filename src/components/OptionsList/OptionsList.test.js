import React from 'react';
import { fireEvent } from '@folio/jest-config-stripes/testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { OptionsList } from './OptionsList';

const onSelectMock = jest.fn(value => value);
const notEmptyOptionsListProps = {
  id: 'testId',
  label: 'testLabel',
  dataOptions: [{
    optionValue: 'value1',
    optionLabel: 'name1',
  }, {
    optionValue: '',
    optionLabel: 'name2',
  }],
  optionValue: 'optionValue',
  optionLabel: 'optionLabel',
  className: 'className',
  disabled: false,
  onSelect: onSelectMock,
};
const emptyOptionsListProps = {
  id: 'testId',
  label: 'test label',
  dataOptions: [],
  optionValue: 'test optionValue',
  optionLabel: 'test optionLabel',
  className: 'testClassName',
  disabled: false,
  onSelect: onSelectMock,
  emptyMessage: 'emptyMessage',
};

const renderOptionsList = ({
  id,
  label,
  dataOptions,
  optionValue,
  optionLabel,
  className,
  disabled,
  onSelect,
  emptyMessage,
}) => {
  const component = (
    <OptionsList
      id={id}
      label={label}
      dataOptions={dataOptions}
      optionValue={optionValue}
      optionLabel={optionLabel}
      className={className}
      disabled={disabled}
      onSelect={onSelect}
      emptyMessage={emptyMessage}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('OptionsList component', () => {
  afterAll(() => {
    onSelectMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderOptionsList(notEmptyOptionsListProps);

    await runAxeTest({ rootNode: container });
  });

  describe('when there are options', () => {
    it('should be rendered with options list', () => {
      const { getByText } = renderOptionsList(notEmptyOptionsListProps);

      expect(getByText('name1')).toBeDefined();
      expect(getByText('name2')).toBeDefined();
    });
  });

  describe('when there is no options', () => {
    it('should be rendered with an empty message', () => {
      const { getByText } = renderOptionsList(emptyOptionsListProps);

      expect(getByText('emptyMessage')).toBeDefined();
    });
  });

  it('shouldn`t be changed after clicking on the empty message', () => {
    const { queryByText } = renderOptionsList(emptyOptionsListProps);
    const button = queryByText('emptyMessage');
    const isPrevented = fireEvent.click(button);

    expect(isPrevented).toBe(false);
  });

  describe('when clicking on dropdown', () => {
    it('dropdown options should appear', () => {
      const { getByText } = renderOptionsList(notEmptyOptionsListProps);
      const dropdownButton = getByText('testLabel');

      expect(getByText('name1')).not.toBeVisible();

      fireEvent.click(dropdownButton);

      expect(getByText('name1')).toBeVisible();
    });

    describe('when clicking on open dropdown', () => {
      it('dropdown options should be hidden', () => {
        const { getByText } = renderOptionsList(notEmptyOptionsListProps);
        const dropdownButton = getByText('testLabel');

        expect(getByText('name1')).not.toBeVisible();

        fireEvent.click(dropdownButton);

        expect(getByText('name1')).toBeVisible();

        fireEvent.click(dropdownButton);

        expect(getByText('name1')).not.toBeVisible();
      });
    });
  });

  it('should be closed after clicking on element button with value and label', () => {
    const { getByText } = renderOptionsList(notEmptyOptionsListProps);

    fireEvent.click(getByText('name1'));

    expect(getByText('name1')).not.toBeVisible();
  });

  it('should be closed after clicking on element button only with label', () => {
    const { getByText } = renderOptionsList(notEmptyOptionsListProps);

    fireEvent.click(getByText('name2'));

    expect(getByText('name2')).not.toBeVisible();
  });
});
