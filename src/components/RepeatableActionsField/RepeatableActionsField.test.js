import React from 'react';
import { fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';

import {
  MAPPING_REPEATABLE_FIELD_ACTIONS,
  REPEATABLE_ACTIONS,
} from '../../utils';

import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { RepeatableActionsField } from './RepeatableActionsField';

const onRepeatableActionChangeMock = jest.fn();

const repeatableActionsFieldProps = {
  wrapperFieldName: 'testName',
  legend: 'Repeatable Actions',
  disabled: false,
  wrapperPlaceholder: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions',
  actions: MAPPING_REPEATABLE_FIELD_ACTIONS,
  actionToClearFields: REPEATABLE_ACTIONS.DELETE_EXISTING,
  subfieldsToClearPath: '',
  repeatableFieldIndex: 15,
  hasRepeatableFields: true,
  repeatableFieldAction: REPEATABLE_ACTIONS.EXTEND_EXISTING,
};

const renderRepeatableActionsField = ({
  wrapperFieldName,
  disabled,
  legend,
  wrapperPlaceholder,
  repeatableFieldAction,
  repeatableFieldIndex,
  hasRepeatableFields,
  actions,
  actionToClearFields,
  subfieldsToClearPath,
}) => {
  const childComponent = canAdd => {
    return (
      <div>
        <span>Repeatable field component</span>
        <button
          type="button"
          disabled={!canAdd}
        >
          +Add
        </button>
      </div>
    );
  };

  const component = () => (
    <RepeatableActionsField
      legend={legend}
      wrapperFieldName={wrapperFieldName}
      disabled={disabled}
      wrapperPlaceholder={wrapperPlaceholder}
      repeatableFieldAction={repeatableFieldAction}
      repeatableFieldIndex={repeatableFieldIndex}
      hasRepeatableFields={hasRepeatableFields}
      onRepeatableActionChange={onRepeatableActionChangeMock}
      actions={actions}
      actionToClearFields={actionToClearFields}
      subfieldsToClearPath={subfieldsToClearPath}
      recordType="INSTANCE"
    >
      {props => childComponent(props)}
    </RepeatableActionsField>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('RepeatableActionsField component', () => {
  afterEach(() => {
    onRepeatableActionChangeMock.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderRepeatableActionsField(repeatableActionsFieldProps);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should be rendered with child component', () => {
    const { getByText } = renderRepeatableActionsField(repeatableActionsFieldProps);

    expect(getByText('Repeatable field component')).toBeDefined();
  });

  describe('when click on Select action', () => {
    describe('if selected action and clear action are equal', () => {
      it('Add button should be disabled', () => {
        const {
          container,
          getByText,
        } = renderRepeatableActionsField(repeatableActionsFieldProps);

        const selectRepeatableAction = container.querySelector('select');
        const addFieldButton = getByText('+Add');

        fireEvent.change(selectRepeatableAction, { target: { value: 'DELETE_EXISTING' } });
        expect(addFieldButton).toBeDisabled();
      });
    });
  });

  describe('when select default value', () => {
    it('function for changing value should be called', () => {
      const { container } = renderRepeatableActionsField(repeatableActionsFieldProps);
      const selectElement = container.querySelector('[name="testName"]');

      fireEvent.change(selectElement, { target: { value: 'Select action' } });

      expect(onRepeatableActionChangeMock).toHaveBeenCalled();
    });
  });
});
