import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import {
  translationsProperties,
  renderWithFinalForm,
} from '../../../../../test/jest/helpers';

import { IncomingSectionStatic } from './IncomingSectionStatic';

const onTypeChangeMock = jest.fn(value => value);
const textIncomingSectionStatic = {
  repeatableIndex: 0,
  staticValueType: 'TEXT',
  onTypeChange: onTypeChangeMock,
};
const numberIncomingSectionStatic = {
  repeatableIndex: 0,
  staticValueType: 'NUMBER',
  onTypeChange: onTypeChangeMock,
};
const dateIncomingSectionStatic = {
  repeatableIndex: 0,
  staticValueType: 'EXACT_DATE',
  onTypeChange: onTypeChangeMock,
};
const dateRangeIncomingSectionStatic = {
  repeatableIndex: 0,
  staticValueType: 'DATE_RANGE',
  onTypeChange: onTypeChangeMock,
};
const renderIncomingSectionStatic = ({
  repeatableIndex,
  staticValueType,
  onTypeChange,
}) => {
  const component = () => (
    <IncomingSectionStatic
      repeatableIndex={repeatableIndex}
      staticValueType={staticValueType}
      onTypeChange={onTypeChange}
    />
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('IncomingSectionStatic edit', () => {
  afterAll(() => {
    onTypeChangeMock.mockClear();
  });

  it('should be rendered with TEXT value type', () => {
    const { getByLabelText } = renderIncomingSectionStatic(textIncomingSectionStatic);

    expect(getByLabelText('Text')).toBeDefined();
  });

  it('should be rendered with NUMBER value type', () => {
    const { getByLabelText } = renderIncomingSectionStatic(numberIncomingSectionStatic);

    expect(getByLabelText('Number')).toBeDefined();
  });

  it('should be rendered with EXACT_DATE value type', () => {
    const { getByLabelText } = renderIncomingSectionStatic(dateIncomingSectionStatic);

    expect(getByLabelText('Date')).toBeDefined();
  });

  it('should be rendered with DATE_RANGE value type', () => {
    const { getAllByLabelText } = renderIncomingSectionStatic(dateRangeIncomingSectionStatic);

    expect(getAllByLabelText('Date range')).toBeDefined();
  });

  describe('when input text to search', () => {
    it('input change its value', () => {
      const { container } = renderIncomingSectionStatic(dateRangeIncomingSectionStatic);
      const element = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.staticValueDetails.staticValueType"]');

      fireEvent.change(element, { target: { value: 'NUMBER' } });

      expect(element).toHaveValue('NUMBER');
    });
  });
});
