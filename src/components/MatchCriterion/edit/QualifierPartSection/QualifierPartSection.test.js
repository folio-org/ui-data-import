import React from 'react';
import { fireEvent } from '@testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
  renderWithFinalForm,
} from '../../../../../test/jest/helpers';
import '../../../../../test/jest/__mock__';

import { QualifierPartSection } from './QualifierPartSection';

const onChangeMock = jest.fn();
const qualifierPartSection = {
  repeatableIndex: 0,
  recordFieldType: 'incoming',
  isOpen: false,
  onChange: onChangeMock,
};
const openedQualifierPartSection = {
  repeatableIndex: 0,
  recordFieldType: 'incoming',
  isOpen: true,
  onChange: onChangeMock,
};

const renderQualifierPartSection = ({
  repeatableIndex,
  recordFieldType,
  isOpen,
  onChange,
}) => {
  const component = () => (
    <QualifierPartSection
      repeatableIndex={repeatableIndex}
      recordFieldType={recordFieldType}
      isOpen={isOpen}
      onChange={onChange}
    />
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('QualifierPartSection edit', () => {
  afterAll(() => {
    onChangeMock.mockClear();
  });

  it('should have a correct title', () => {
    const { getByText } = renderQualifierPartSection(qualifierPartSection);

    expect(getByText('Only compare part of the value')).toBeDefined();
  });

  it('should be closed when section is unchecked', () => {
    const { container } = renderQualifierPartSection(qualifierPartSection);
    const sectionContent = container.querySelector('.content');

    expect(sectionContent).toBeNull();
  });

  describe('when clicking on the section checkbox', () => {
    it('section content should be expanded', () => {
      const { container } = renderQualifierPartSection(qualifierPartSection);
      const openCheckbox = container.querySelector('input[type="checkbox"]');

      fireEvent.click(openCheckbox);

      const sectionContent = container.querySelector('.content');

      expect(sectionContent).toBeDefined();
    });
  });

  describe('Qualifier part section content', () => {
    it('should have a dropdown with correct options', () => {
      const {
        container,
        getByText,
      } = renderQualifierPartSection(openedQualifierPartSection);
      const dropdown = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.qualifier.comparisonPart"]');
      const option1 = getByText('Numerics only');
      const option2 = getByText('Alphanumerics only');

      expect(dropdown).toBeDefined();
      expect(option1).toBeDefined();
      expect(option2).toBeDefined();
    });
  });
});
