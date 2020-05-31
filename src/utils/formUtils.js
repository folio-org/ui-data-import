import React from 'react';
import {
  FormattedMessage,
  FormattedDate,
} from 'react-intl';

import {
  get,
  isEmpty,
} from 'lodash';

import * as validators from './formValidators';

/**
 * Retrieves and returns a list of form control validators based on the list of keys given
 *
 * @param {array} validation
 * @returns {Array|Uint8Array|BigInt64Array|*[]}
 */
export const getValidation = validation => validation.map(val => validators[val]);

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

  return get(entity, ['tags', 'tagList'], []);
};

/**
 * Formats Decorator Value according requirements
 *
 * @param {string} currentValue
 * @param {string} newValue
 * @param {boolean} isNeedToWrapInQuotes
 * @return {string} Decorated input value
 */
export const formatDecoratorValue = (currentValue, newValue, isNeedToWrapInQuotes) => {
  const decoratorValueRegExp = /"(\\.|[^"\\])*"/g;
  const decoratorDatepickerValueRegExp = /###TODAY###|"(\\.|[^"\\])*"/g;
  const pattern = isNeedToWrapInQuotes || currentValue.includes('###TODAY###') ? decoratorDatepickerValueRegExp : decoratorValueRegExp;
  const containTextForReplace = currentValue.match(pattern);
  const updatedValue = isNeedToWrapInQuotes ? `"${newValue}"` : `###${newValue}###`;

  return containTextForReplace ? `${currentValue.replace(containTextForReplace, updatedValue)}` : currentValue ? `${currentValue} ${updatedValue}` : updatedValue;
};
