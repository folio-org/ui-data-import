import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import {
  translationsProperties,
  renderWithFinalForm,
} from '../../../../../test/jest/helpers';

import { MARCFieldSection } from './MARCFieldSection';

const marcFieldSection = {
  repeatableIndex: 0,
  recordFieldSectionLabel: 'Test',
  recordFieldType: 'incoming',
};

const renderMARCFieldSection = ({
  repeatableIndex,
  recordFieldSectionLabel,
  recordFieldType,
}) => {
  const component = () => (
    <MARCFieldSection
      repeatableIndex={repeatableIndex}
      recordFieldSectionLabel={recordFieldSectionLabel}
      recordFieldType={recordFieldType}
    />
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('MARCFieldSection edit', () => {
  it('should be rendered with fields', () => {
    const {
      container,
      getByText,
    } = renderMARCFieldSection(marcFieldSection);

    expect(getByText('Test')).toBeDefined();
    expect(container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[0].value"]')).toBeDefined();
    expect(container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[1].value"]')).toBeDefined();
    expect(container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[2].value"]')).toBeDefined();
    expect(container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[3].value"]')).toBeDefined();
  });

  describe('when input text to search', () => {
    it('field input change its value', () => {
      const { container } = renderMARCFieldSection(marcFieldSection);
      const element = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[0].value"]');

      expect(element).toHaveValue('');

      fireEvent.change(element, { target: { value: 'NUMBER' } });

      expect(element).toHaveValue('NUMBER');
    });

    it('In. 1 input change its value', () => {
      const { container } = renderMARCFieldSection(marcFieldSection);
      const element = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[1].value"]');

      expect(element).toHaveValue('');

      fireEvent.change(element, { target: { value: 'NUMBER' } });

      expect(element).toHaveValue('NUMBER');
    });

    it('In. 2 input change its value', () => {
      const { container } = renderMARCFieldSection(marcFieldSection);
      const element = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[2].value"]');

      expect(element).toHaveValue('');

      fireEvent.change(element, { target: { value: 'NUMBER' } });

      expect(element).toHaveValue('NUMBER');
    });

    it('Subfield input change its value', () => {
      const { container } = renderMARCFieldSection(marcFieldSection);
      const element = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[3].value"]');

      expect(element).toHaveValue('');

      fireEvent.change(element, { target: { value: 'NUMBER' } });

      expect(element).toHaveValue('NUMBER');
    });
  });
});
