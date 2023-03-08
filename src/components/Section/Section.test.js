import React from 'react';
import { fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { Section } from './Section';

const childElement = (
  <div>
    <span>child component</span>
  </div>
);
const sectionWithLabel = {
  label: 'test label',
  optional: false,
};
const sectionWithLabelAndDataTestAttribute = {
  label: 'test label',
  'data-test-tester': true,
};
const sectionWithChildElements = {
  children: childElement,
  optional: true,
};
const sectionWithoutHeadline = {
  children: childElement,
  optional: false,
};
const sectionWithCheckboxAndLabel = {
  label: 'test label',
  optional: true,
  isOpen: false,
  children: [childElement],
};

const renderSection = ({
  label,
  optional,
  children,
  isOpen,
  rest,
}) => {
  const component = (
    <Section
      label={label}
      optional={optional}
      isOpen={isOpen}
      {...rest}
    >
      {children}
    </Section>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('Section', () => {
  describe('when label is provided', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderSection(sectionWithLabel);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should be rendered only with label', () => {
      const { getByText } = renderSection(sectionWithLabel);

      expect(getByText('test label')).toBeDefined();
    });
  });

  describe('when headline is not provided', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderSection(sectionWithoutHeadline);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should be rendered without headline', () => {
      const { container } = renderSection(sectionWithoutHeadline);
      const headlineElement = container.querySelector('h3');

      expect(headlineElement).toBeNull();
    });
  });

  describe('when only child elemnt is provided', () => {
    it('should be rendered with no axe errors', async () => {
      const { container } = renderSection(sectionWithChildElements);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('should be rendered only with child elements', () => {
      const { getByText } = renderSection(sectionWithChildElements);

      expect(getByText('child component')).toBeDefined();
    });

    it('should be rendered without optional headline', () => {
      const { container } = renderSection(sectionWithChildElements);
      const headlineElement = container.querySelector('h3');

      expect(headlineElement).toBeNull();
    });
  });

  it('should be rendered with data-test- attribute', () => {
    const { container } = renderSection(sectionWithLabelAndDataTestAttribute);
    const dataTestAttribute = container.querySelector('[data-test-tester="true]');

    expect(dataTestAttribute).toBeDefined();
  });

  it('should be rendered with label and disabled checkbox', () => {
    const {
      getByText,
      getByRole,
    } = renderSection(sectionWithCheckboxAndLabel);
    const checkbox = getByRole('checkbox');
    const label = getByText('test label');

    expect(checkbox && label).toBeDefined();
  });

  it('show children by clicking checkbox', () => {
    const {
      queryByText,
      getByRole,
    } = renderSection(sectionWithCheckboxAndLabel);
    const checkbox = getByRole('checkbox');

    expect(queryByText('child component')).toBeNull();

    fireEvent.click(checkbox);

    expect(queryByText('child component')).toBeDefined();
  });
});
