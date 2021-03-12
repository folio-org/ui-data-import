import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  get,
  isEmpty,
  isEqual,
} from 'lodash';

import { FormattedDate } from '@folio/stripes/components';

/**
 * Augments given param name with augment value using augment key as a splitter
 *
 * @param {string} param Param name
 * @param {string} splitter Param augmentation key
 * @param {string|number} augment Param augmentation value
 * @returns {string}
 */
export const augmentParam = (param, splitter, augment) => (param ? param.split(splitter).join(augment) : param);

/**
 * Finds out whether the given param is <FormattedMessage> node
 *
 * @param {string|Node} lbl
 * @returns {boolean}
 */
export const isFormattedMessage = lbl => React.isValidElement(lbl);

/**
 * Finds out whether the given param is <FormattedMessage> translation id
 *
 * @param {string|Node} lbl
 * @returns {boolean}
 */
export const isTranslationId = lbl => lbl && lbl.includes('ui-');

/**
 * Finds and returns localized option value from the dataOptions array given
 *
 * @param {array} options dataOptions list
 * @param {string} label option label
 * @param {string} sectionNamespace
 * @returns {undefined|string|Node}
 */
export const getOptionLabel = (options, label, sectionNamespace) => {
  const option = options.find(item => item.value === label);

  if (isEmpty(option)) {
    return undefined;
  }

  const isFMessage = isFormattedMessage(option.label);
  const isTranId = isTranslationId(option.label);

  if (isFMessage || (!isFMessage && !isTranId)) {
    return option.label;
  }

  const actualLabel = !isFMessage ? augmentParam(option.label, '**ns**', sectionNamespace) : option.label;

  return !isFormattedMessage ? <FormattedMessage id={actualLabel} /> : actualLabel;
};

/**
 * Formats and localizes given date with intl <FormattedDate> component
 *
 * @param {string} dataType
 * @param {string|number} value
 * @returns {string|Node}
 */
export const checkDate = (dataType, value) => {
  const isDate = dataType === 'date';

  return isDate ? <FormattedDate value={value} /> : value;
};

/**
 * Retrieves and wraps the profile entity with custom wrapper
 *
 * @param {object} props
 * @returns {{addedRelations: [], profile: object, id: string, deletedRelations: []}}
 */
export const getEntity = props => {
  const entity = get(props, ['resources', 'entities', 'records', 0], {});

  return {
    id: entity.id,
    profile: entity,
    addedRelations: [],
    deletedRelations: [],
  };
};

/**
 * Retrieves and returns tags list from the custom wrapped entity
 *
 * @param {object} props
 * @returns {*}
 */
export const getEntityTags = props => {
  const entity = props.getEntity(props);

  return get(entity, ['profile', 'tags', 'tagList'], []);
};

/**
 * Formats Decorator Value according requirements
 *
 * @param {string} currentValue
 * @param {string} newValue
 * @param {RegExp} pattern
 * @param {boolean} isNeedToWrapInQuotes
 * @param {boolean} isMultiSelection
 * @return {string} Decorated input value
 */
export const formatDecoratorValue = (currentValue, newValue, pattern, isNeedToWrapInQuotes, isMultiSelection = false) => {
  const updatedValue = isNeedToWrapInQuotes ? `"${newValue}"` : newValue;

  if (!currentValue) {
    return updatedValue;
  }
  const containTextForReplace = currentValue.match(pattern);
  const containUpdatedValueInCurrent = currentValue.includes(updatedValue);

  if (!isMultiSelection && containTextForReplace) {
    return `${currentValue.replace(containTextForReplace.toString(), updatedValue)}`;
  }

  if (isMultiSelection && containUpdatedValueInCurrent) {
    return currentValue;
  }

  return `${currentValue} ${updatedValue}`;
};

/**
 * Composes and runs array of validation function
 *
 * @param {...function} validatorFns
 * @returns {undefined|object|string|Node}
 */
export const composeValidators = (...validatorFns) => value => validatorFns
  .reduce((error, validator) => error || validator(value), undefined);

/**
 * Check whether the initial field value is equal to the current field value
 * in the final-form field
 *
 * @param {string|undefined} initialValue
 * @param {string|undefined} currentValue
 * @returns {boolean}
 */
export const isFieldPristine = (initialValue, currentValue) => {
  if (isEmpty(initialValue) && isEmpty(currentValue)) return true;

  return isEqual(initialValue, currentValue);
};

export const handleProfileSave = (handleSubmit, resetForm, transitionToParams, path) => async event => {
  const record = await handleSubmit(event);

  if (record) {
    resetForm();
    transitionToParams({
      _path: `${path}/view/${record.id}`,
      layer: null,
    });
  }
};
