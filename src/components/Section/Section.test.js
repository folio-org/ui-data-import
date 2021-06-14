import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { fireEvent } from '@testing-library/dom';
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
  rest: 'data-test-tester',
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

const renderSectionContainer = ({
  label, optional, children, isOpen, rest,
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
  it('should be rendered only with label', () => {
    const { getByText } = renderSectionContainer(sectionWithLabel);

    expect(getByText('test label')).toBeDefined();
  });
  it('should be rendered without headline', () => {
    const { container } = renderSectionContainer(sectionWithoutHeadline);
    const element = container.querySelector('h3');

    expect(element).toBeNull();
  });
  it('should be rendered without optional headline', () => {
    const { container } = renderSectionContainer(sectionWithChildElements);
    const element = container.querySelector('h3');

    expect(element).toBeNull();
  });
  it('should be rendered with data-test- attribute', () => {
    const { container } = renderSectionContainer(sectionWithLabelAndDataTestAttribute);
    const element = container.querySelector('[data-test-tester="true]');

    expect(element).toBeDefined();
  });
  it('should render only with child elements', () => {
    const { getByText } = renderSectionContainer(sectionWithChildElements);
    expect(getByText('child component')).toBeDefined();
  });
  it('should render with label and disabled checkbox', () => {
    const {
      getByText,
      getByRole,
    } = renderSectionContainer(sectionWithCheckboxAndLabel);
    const checkbox = getByRole('checkbox');
    const label = getByText('test label');

    expect(checkbox && label).toBeDefined();
  });
  it('show children by clicking checkbox', () => {
    const {
      getByText,
      getByRole,
    } = renderSectionContainer(sectionWithCheckboxAndLabel);
    const checkbox = getByRole('checkbox');

    fireEvent.click(checkbox);

    expect(getByText('child component')).toBeDefined();
  });
});
