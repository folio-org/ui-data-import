import React from 'react';
import { fireEvent } from '@testing-library/react';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import '../../../../../test/jest/__mock__';
import {
  translationsProperties,
  renderWithFinalForm,
} from '../../../../../test/jest/helpers';

import { QualifierPartSection } from './QualifierPartSection';

const onChangeMock = jest.fn(value => value);
const qualifierPartSection = {
  repeatableIndex: 0,
  recordFieldType: 'incoming',
  isOpen: false,
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

  it('should be rendered with closed additional content', () => {
    const { container } = renderQualifierPartSection(qualifierPartSection);
    const additionalContent = container.querySelector('.content');

    expect(additionalContent).toBeNull();
  });

  describe('when click on checkbox', () => {
    it('additional content should be opened', () => {
      const { container } = renderQualifierPartSection(qualifierPartSection);
      const element = container.querySelector('input[type="checkbox"]');

      fireEvent.click(element);

      const additionalContent = container.querySelector('.content');

      expect(additionalContent).toBeDefined();
    });
  });
});
