import React from 'react';

import { fireEvent } from '@testing-library/react';

import { noop } from 'lodash';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';

import {
  MAPPING_REPEATABLE_FIELD_ACTIONS, REPEATABLE_ACTIONS,
} from '../../utils';

import {
  renderWithReduxForm, translationsProperties,
} from '../../../test/jest/helpers';

import { RepeatableActionsField } from './RepeatableActionsField';

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

const repeatableActionsFieldProps = {
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
});
