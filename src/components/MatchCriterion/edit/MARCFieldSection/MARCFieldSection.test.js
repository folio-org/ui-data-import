import React from 'react';
import { fireEvent } from '@testing-library/react';
import { runAxeTest } from '@folio/stripes-testing';

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

describe('MARCFieldSection edit component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderMARCFieldSection(marcFieldSection);

    await runAxeTest({ rootNode: container });
  });

  it('should render a correct section title', () => {
    const { getByText } = renderMARCFieldSection(marcFieldSection);

    expect(getByText('Test')).toBeDefined();
  });

  it('should render Field field', () => {
    const { container } = renderMARCFieldSection(marcFieldSection);
    const fieldContainer = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[0].value"]');

    expect(fieldContainer).toBeDefined();
  });

  it('should render In. 1 field', () => {
    const { container } = renderMARCFieldSection(marcFieldSection);
    const fieldContainer = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[1].value"]');

    expect(fieldContainer).toBeDefined();
  });

  it('should render In. 2 field', () => {
    const { container } = renderMARCFieldSection(marcFieldSection);
    const fieldContainer = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[2].value"]');

    expect(fieldContainer).toBeDefined();
  });

  it('should render Subfield field', () => {
    const { container } = renderMARCFieldSection(marcFieldSection);
    const fieldContainer = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[3].value"]');

    expect(fieldContainer).toBeDefined();
  });

  describe('when input text to a field', () => {
    it('field input change its value', () => {
      const { container } = renderMARCFieldSection(marcFieldSection);
      const containerField = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[0].value"]');

      expect(containerField).toHaveValue('');

      fireEvent.change(containerField, { target: { value: '999' } });

      expect(containerField).toHaveValue('999');
    });

    it('In. 1 input change its value', () => {
      const { container } = renderMARCFieldSection(marcFieldSection);
      const containerIn1 = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[1].value"]');

      expect(containerIn1).toHaveValue('');

      fireEvent.change(containerIn1, { target: { value: 'test' } });

      expect(containerIn1).toHaveValue('test');
    });

    it('In. 2 input change its value', () => {
      const { container } = renderMARCFieldSection(marcFieldSection);
      const containerIn2 = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[2].value"]');

      expect(containerIn2).toHaveValue('');

      fireEvent.change(containerIn2, { target: { value: 'test' } });

      expect(containerIn2).toHaveValue('test');
    });

    it('Subfield input change its value', () => {
      const { container } = renderMARCFieldSection(marcFieldSection);
      const containerSubfield = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.fields[3].value"]');

      expect(containerSubfield).toHaveValue('');

      fireEvent.change(containerSubfield, { target: { value: 'test' } });

      expect(containerSubfield).toHaveValue('test');
    });
  });
});
