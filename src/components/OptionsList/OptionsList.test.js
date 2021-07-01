import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { OptionsList } from './OptionsList';

const func = text => text;
const notEmptyOptionsList = {
  id: 'testId',
  label: 'testLabel',
  dataOptions: [{
    optionValue: 'value1',
    optionLabel: 'name1',
  },
  {
    optionValue: '',
    optionLabel: 'name2',
  }],
  optionValue: 'optionValue',
  optionLabel: 'optionLabel',
  className: 'className',
  disabled: false,
  onSelect : func,
};
const emptyOptionsList = {
  id: 'testId',
  label: 'test label',
  dataOptions: [],
  optionValue: 'test optionValue',
  optionLabel: 'test optionLabel',
  className: 'testClassName',
  disabled: false,
  onSelect : func,
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

describe('OptionsList', () => {
  it('should be rendered with option list', () => {
    const { getByText } = renderOptionsList(notEmptyOptionsList);

    expect(getByText('name1')).toBeDefined();
  });

  it('should be rendered with an empty message', () => {
    const { getByText } = renderOptionsList(emptyOptionsList);

    expect(getByText('emptyMessage')).toBeDefined();
  });

  it('shouldn`t be changed after clicking on the empty message', () => {
    const { queryByText } = renderOptionsList(emptyOptionsList);
    const button = queryByText('emptyMessage');

    expect(button).toBeDefined();

    fireEvent.click(button);

    expect(button).toBeDefined();
  });

  it('should be shown and then hidden by clicking on dropdown', () => {
    const { getByText } = renderOptionsList(notEmptyOptionsList);
    const dropdownButton = getByText('testLabel');

    expect(getByText('name1')).not.toBeVisible();

    fireEvent.click(dropdownButton);

    expect(getByText('name1')).toBeVisible();

    fireEvent.click(dropdownButton);

    expect(getByText('name1')).not.toBeVisible();
  });

  it('should be closed after clicking on element button with value and label', () => {
    const { getByText } = renderOptionsList(notEmptyOptionsList);

    fireEvent.click(getByText('name1'));

    expect(getByText('name1')).not.toBeVisible();
  });

  it('should be closed after clicking on element button only with label', () => {
    const { getByText } = renderOptionsList(notEmptyOptionsList);

    fireEvent.click(getByText('name2'));

    expect(getByText('name2')).not.toBeVisible();
  });
});
