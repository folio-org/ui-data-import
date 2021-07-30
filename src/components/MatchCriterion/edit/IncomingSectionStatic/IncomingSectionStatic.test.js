import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import {
  translationsProperties,
  renderWithFinalForm,
} from '../../../../../test/jest/helpers';

import { IncomingSectionStatic } from './IncomingSectionStatic';

const onTypeChangeMock = jest.fn().mockImplementation(text => text);
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
  afterEach(() => {
    onTypeChangeMock.mockClear();
  });

  describe('dropdown with static values', () => {
    it('sholud be rendered', () => {
      const { container } = renderIncomingSectionStatic(textIncomingSectionStatic);
      const dropdown = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.staticValueDetails.staticValueType"]');

      expect(dropdown).toBeDefined();
    });

    it('should contain Text option', () => {
      const { getByLabelText } = renderIncomingSectionStatic(textIncomingSectionStatic);

      expect(getByLabelText('Text')).toBeDefined();
    });

    it('should contain Number option', () => {
      const { getByLabelText } = renderIncomingSectionStatic(numberIncomingSectionStatic);

      expect(getByLabelText('Number')).toBeDefined();
    });

    it('should contain Date option', () => {
      const { getByLabelText } = renderIncomingSectionStatic(dateIncomingSectionStatic);

      expect(getByLabelText('Date')).toBeDefined();
    });

    it('should contain Date range option', () => {
      const { getAllByLabelText } = renderIncomingSectionStatic(dateRangeIncomingSectionStatic);

      expect(getAllByLabelText('Date range')).toBeDefined();
    });
  });

  describe('when picking an option', () => {
    it('input should change its type', () => {
      const { container } = renderIncomingSectionStatic(dateIncomingSectionStatic);
      const staticValueContainer = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.staticValueDetails.staticValueType"]');

      fireEvent.change(staticValueContainer, { target: { value: 'TEXT' } });

      expect(staticValueContainer).toHaveValue('TEXT');
    });
  });
});
