import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import {
  translationsProperties,
  renderWithFinalForm,
} from '../../../../../test/jest/helpers';

import { QualifierSection } from './QualifierSection';

const onChangeMock = jest.fn(text => text);
const qualifierSection = {
  repeatableIndex: 0,
  recordFieldType: 'incoming',
  isOpen: false,
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

  it('should be rendered with closed additional content', () => {
    const { container } = renderQualifierSection(qualifierSection);
    const additionalContent = container.querySelector('.content');

    expect(additionalContent).toBeNull();
  });

  describe('when click on checkbox', () => {
    it('additional content should be opened', () => {
      const { container } = renderQualifierSection(qualifierSection);
      const element = container.querySelector('input[type="checkbox"]');

      fireEvent.click(element);

      const additionalContent = container.querySelector('.content');

      expect(additionalContent).toBeDefined();
    });
  });
});
