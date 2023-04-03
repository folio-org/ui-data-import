import React from 'react';
import { fireEvent } from '@testing-library/react';

import {
  renderWithIntl,
  translationsProperties,
  renderWithFinalForm,
} from '../../../../../test/jest/helpers';
import '../../../../../test/jest/__mock__';

import { QualifierSection } from './QualifierSection';

const onChangeMock = jest.fn();
const qualifierSection = {
  repeatableIndex: 0,
  recordFieldType: 'incoming',
  isOpen: false,
  onChange: onChangeMock,
};
const openedQualifierSection = {
  repeatableIndex: 0,
  recordFieldType: 'incoming',
  isOpen: true,
  onChange: onChangeMock,
};

const renderQualifierSection = ({
  repeatableIndex,
  recordFieldType,
  isOpen,
  onChange,
}) => {
  const component = () => (
    <QualifierSection
      repeatableIndex={repeatableIndex}
      recordFieldType={recordFieldType}
      isOpen={isOpen}
      onChange={onChange}
    />
  );

  return renderWithIntl(renderWithFinalForm(component), translationsProperties);
};

describe('QualifierSection edit', () => {
  afterAll(() => {
    onChangeMock.mockClear();
  });

  it('should be rendered with closed section content', () => {
    const { container } = renderQualifierSection(qualifierSection);
    const sectionContent = container.querySelector('.content');

    expect(sectionContent).toBeNull();
  });

  describe('when clicking on the section checkbox', () => {
    it('section content should be expanded', () => {
      const { container } = renderQualifierSection(qualifierSection);
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
      } = renderQualifierSection(openedQualifierSection);
      const dropdown = container.querySelector('[name="profile.matchDetails[0].incomingMatchExpression.qualifier.qualifierType"]');
      const option1 = getByText('Begins with');
      const option2 = getByText('Ends with');
      const option3 = getByText('Contains');

      expect(dropdown).toBeDefined();
      expect(option1).toBeDefined();
      expect(option2).toBeDefined();
      expect(option3).toBeDefined();
    });
  });
});
