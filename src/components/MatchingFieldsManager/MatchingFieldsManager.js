import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import {
  fieldCategoriesConfig,
  fieldsConfig,
  HTML_LANG_DIRECTIONS,
  MARC_FIELD_CONSTITUENT,
} from '../../utils';

@injectIntl
@stripesConnect
export class MatchingFieldsManager extends Component {
  static manifest = Object.freeze({
    identifierTypes: {
      type: 'okapi',
      records: 'identifierTypes',
      path: 'identifier-types?limit=1000&query=cql.allRecords=1 sortby name',
    },
  });

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
      PropTypes.func,
    ]).isRequired,
    resources: PropTypes.shape({ identifierTypes: PropTypes.shape({ records: PropTypes.arrayOf(PropTypes.object).isRequired }) }).isRequired,
    intl: PropTypes.object.isRequired,
  };

  /* shouldComponentUpdate(nextProps) {
    const { resources: { identifierTypes: { records } } } = this.props;
    const { resources: { identifierTypes: { records: nextRecords } } } = nextProps;

    console.log('records', this.props);
    console.log('nextRecords', nextProps);
    // return true;
    console.log('-------- check', records.length !== nextRecords.length && records.length === 0);

    return records.length !== nextRecords.length && records.length !== 0;
  } */

  matchFields = (resources, recordType) => {
    return fieldsConfig.filter(field => field.recordType
      && field.recordType === recordType
      && get(resources, field.id));
  };

  getCategory = field => fieldCategoriesConfig.find(category => category.id === field.categoryId);

  getFieldFromResources = (fieldFromConfig, fields) => {
    const { resources } = this.props;
    const {
      recordsName,
      fieldToSend,
      fieldToDisplay,
    } = fieldFromConfig.fromResources;

    const records = resources[recordsName]?.records || [];
    const fieldValue = fields[fields.length - 1].value;

    return records.find(record => record[fieldToSend] === fieldValue)?.[fieldToDisplay];
  };

  getField = (fields, recordType) => {
    const { intl: { formatMessage } } = this.props;

    if (!fields.length || !recordType) {
      return {};
    }

    const fieldValue = fields.find(field => field.label === MARC_FIELD_CONSTITUENT.FIELD)?.value;
    const fieldFromConfig = fieldsConfig.find(item => item.value === fieldValue);

    if (fieldFromConfig?.fromResources) {
      const fieldFromResources = this.getFieldFromResources(fieldFromConfig, fields);

      return {
        fieldFromConfig,
        fieldLabel: fieldFromResources || undefined,
      };
    }

    const fieldLabel = fieldFromConfig ? formatMessage({ id: fieldFromConfig.label }) : undefined;

    return {
      fieldFromConfig,
      fieldLabel,
    };
  };

  getFieldMatched = (fields, recordType) => {
    const isMarcRecord = recordType.toLowerCase().includes('marc');

    if (isMarcRecord) {
      const fieldsMatched = fields.map(item => item.value || '');

      if (document.dir === HTML_LANG_DIRECTIONS.RIGHT_TO_LEFT) {
        fieldsMatched.reverse();
      }

      return fieldsMatched.join('.');
    }

    const { fieldLabel } = this.getField(fields, recordType);

    return fieldLabel;
  };

  getFieldMatchedWithCategory = (fields, recordType) => {
    const { intl: { formatMessage } } = this.props;
    const {
      fieldFromConfig,
      fieldLabel,
    } = this.getField(fields, recordType);

    if (!fieldFromConfig) {
      return undefined;
    }

    const category = this.getCategory(fieldFromConfig);
    const categoryLabel = category ? formatMessage({ id: category.label }) : '';

    return `${categoryLabel}: ${fieldLabel}`;
  };

  getDropdownOptionsFromResources = (record, categoryLabel) => {
    const { resources } = this.props;
    const {
      recordsName,
      fieldToDisplay,
      fieldToSend,
    } = record.fromResources;

    const recordsFromResource = resources[recordsName]?.records;

    return recordsFromResource.map(item => ({
      id: record.id,
      value: item[fieldToSend],
      label: `${categoryLabel}: ${item[fieldToDisplay]}`,
    }));
  };

  getDropdownOptions = records => {
    const { intl: { formatMessage } } = this.props;
    const options = [];

    records.forEach(record => {
      const category = this.getCategory(record);
      const categoryLabel = category ? formatMessage({ id: category.label }) : '';

      if (record.fromResources) {
        const optionsFromResources = this.getDropdownOptionsFromResources(record, categoryLabel);

        options.push(...optionsFromResources);
      } else {
        const fieldLabel = formatMessage({ id: record.label });

        options.push({
          id: record.id,
          value: record.value,
          label: `${categoryLabel}: ${fieldLabel}`,
        });
      }
    });

    return options;
  };

  render() {
    const contextData = {
      matchFields: this.matchFields,
      getFieldMatched: this.getFieldMatched,
      getFieldMatchedWithCategory: this.getFieldMatchedWithCategory,
      getDropdownOptions: this.getDropdownOptions,
    };

    return this.props.children(contextData);
  }
}
