import React from 'react';
import { noop } from 'lodash';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import {
  fireEvent, screen,
} from '@testing-library/react';
import { RepeatableActionsField } from './RepeatableActionsField';
import {
  MAPPING_REPEATABLE_FIELD_ACTIONS, REPEATABLE_ACTIONS,
} from '../../utils';

import {
  renderWithReduxForm, translationsProperties,
} from '../../../test/jest/helpers';

const renderRepeatableActionsField = ({
  wrapperFieldName,
  disabled,
  legend,
  wrapperPlaceholder,
  repeatableFieldAction,
  repeatableFieldIndex,
  hasRepeatableFields,
  onRepeatableActionChange,
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
      onRepeatableActionChange={onRepeatableActionChange}
      actions={actions}
      actionToClearFields={actionToClearFields}
      subfieldsToClearPath={subfieldsToClearPath}
    >
      {props => childComponent(props)}
    </RepeatableActionsField>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

const RepeatableActionsFieldProps = {
  wrapperFieldName: '',
  legend: 'Repeatable Actions',
  disabled: false,
  wrapperPlaceholder: 'ui-data-import.settings.mappingProfiles.map.wrapper.repeatableActions',
  actions: MAPPING_REPEATABLE_FIELD_ACTIONS,
  actionToClearFields: REPEATABLE_ACTIONS.DELETE_EXISTING,
  subfieldsToClearPath: '',
  repeatableFieldIndex: 15,
  hasRepeatableFields: true,
  repeatableFieldAction: REPEATABLE_ACTIONS.EXTEND_EXISTING,
  onRepeatableActionChange: noop,
};

describe('RepeatableActionsField component', () => {
  test('should be rendered with child component', () => {
    const { getByText } = renderRepeatableActionsField({ ...RepeatableActionsFieldProps });

    screen.debug();
    expect(getByText('Repeatable field component'))
      .toBeDefined();
  });
  describe('when click on Select action, if selected action and clear action are equal', () => {
    test('Add button should be disabled', () => {
      const {
        container,
        getByText,
      } = renderRepeatableActionsField({ ...RepeatableActionsFieldProps });
      const select = container.querySelector('select');
      const button = getByText('+Add');

      fireEvent.change(select, { target: { value: 'DELETE_EXISTING' } });
      expect(button)
        .toBeDisabled();
    });
  });
});
