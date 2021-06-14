import React from 'react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { Section } from './Section';
import { fireEvent } from '@testing-library/dom';

const childElement = (
    <div>
        <span>child component</span>
    </div>
);
const sectionWithLabel = {
    label: 'test label',
};
const sectionWithChildElements = {
    children: childElement
};
const sectionWithCheckboxAndLabel = {
    label: 'test label',
    optional: true,
    isOpen: false,
    children: [childElement]
};

const renderSectionContainer = ({ label, optional, children, isOpen }) => {
    const component = (
        <Section
            label={label}
            optional={optional}
            isOpen={isOpen}
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
    it('should render only with child elements', () => {
        const { getByText } = renderSectionContainer(sectionWithChildElements);
        
        expect(getByText('child component')).toBeDefined();
    });
    it('should render with label and disabled checkbox', () => {
        const { getByText, getByRole } = renderSectionContainer(sectionWithCheckboxAndLabel);
        const checkbox = getByRole('checkbox');
        const label = getByText('test label');

        expect(checkbox && label).toBeDefined();
    });
    it('show children by clicking checkbox', () => {
        const { getByText, getByRole } = renderSectionContainer(sectionWithCheckboxAndLabel);
        const checkbox = getByRole('checkbox');
        fireEvent.click(checkbox);

        expect(getByText('child component')).toBeDefined();
    });
});