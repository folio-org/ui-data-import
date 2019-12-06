import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {
  get,
  omit,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import {
  withCheckboxList,
  checkboxListShape,
} from '../../utils';
import { ENTITY_KEYS } from '../../utils/constants';
import {
  INSTANCE_SCHEMA,
  HOLDINGS_SCHEMA,
  ITEM_SCHEMA,
  ORDER_SCHEMA,
  INVOICE_SCHEMA,
} from '../../utils/resources';
import { ListView } from '../../components';
import { CheckboxHeader } from '../../components/ListTemplate/HeaderTemplates';
import { ViewMatchProfile } from './ViewMatchProfile';
import { MatchProfilesForm } from './MatchProfilesForm';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const queryTemplate = `(
  name="%{query.query}*" OR
  existingRecordType="%{query.query}*" OR
  field="%{query.query}*" OR
  fieldMarc="%{query.query}*" OR
  fieldNonMarc="%{query.query}*" OR
  existingStaticValueType="%{query.query}*" OR
  tags.tagList="%{query.query}*"
)`;

export const matchProfilesShape = {
  INITIAL_RESULT_COUNT,
  RESULT_COUNT_INCREMENT,
  manifest: {
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: ENTITY_KEYS.MATCH_PROFILES,
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/matchProfiles',
      clientGeneratePk: false,
      throwErrors: true,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(name="%{query.query}*" OR tags.tagList="%{query.query}*")',
            {
              name: 'name',
              tags: 'tags.tagList',
              updated: 'metadata.updatedDate',
              updatedBy: 'userInfo.firstName userInfo.lastName userInfo.userName',
            },
            [],
          ),
        },
        staticFallback: { params: {} },
      },
    },
  },
  visibleColumns: [
    'name',
    'match',
    'tags',
    'updated',
    'updatedBy',
  ],
  columnWidths: {
    isChecked: '35px',
    name: '300px',
    tags: '150px',
    updated: '100px',
    updatedBy: '250px',
  },
  renderHeaders: props => {
    let headers = {
      name: <FormattedMessage id="ui-data-import.name" />,
      match: <FormattedMessage id="ui-data-import.match" />,
      tags: <FormattedMessage id="ui-data-import.tags" />,
      updated: <FormattedMessage id="ui-data-import.updated" />,
      updatedBy: <FormattedMessage id="ui-data-import.updatedBy" />,
    };

    if (props && props.unlink) {
      headers = {
        unlink: <FormattedMessage id="ui-data-import.unlink" />,
        ...headers,
      };
    }

    if (props && props.checkboxList) {
      const {
        checkboxList: {
          isAllSelected,
          handleSelectAllCheckbox,
        },
      } = props;

      headers = {
        ...headers,
        selected: (
          <CheckboxHeader
            checked={isAllSelected}
            onChange={handleSelectAllCheckbox}
          />
        ),
      };
    }

    return headers;
  },
};

const mapStateToProps = state => {
  const {
    hasLoaded = false,
    records: [record = {}] = [],
  } = get(state, 'folio_data_import_match_profile', {});
  const selectedRecord = {
    hasLoaded,
    record: omit(record, 'metadata', 'userInfo'),
  };

  return { selectedRecord };
};

@withCheckboxList
@stripesConnect
@connect(mapStateToProps)
export class MatchProfiles extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    matchProfiles: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: 'matchProfiles',
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/matchProfiles',
      clientGeneratePk: false,
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            queryTemplate,
            {
              name: 'name',
              match: 'existingRecordType field fieldMarc fieldNonMarc existingStaticValueType',
              tags: 'tags.tagList',
              updated: 'metadata.updatedDate',
              updatedBy: 'userInfo.firstName userInfo.lastName userInfo.userName',
            },
            [],
          ),
        },
        staticFallback: { params: {} },
      },
    },
    instanceSchema: INSTANCE_SCHEMA.INSTANCE,
    holdingsSchema: HOLDINGS_SCHEMA.HOLDINGS,
    itemSchema: ITEM_SCHEMA.ITEM,
    poPurchaseOrderSchema: ORDER_SCHEMA.PURCHASE_ORDER,
    poRenewalSchema: ORDER_SCHEMA.RENEWAL,
    poLineSchema: ORDER_SCHEMA.PO_LINE,
    poDetailsSchema: ORDER_SCHEMA.DETAILS,
    poContributorSchema: ORDER_SCHEMA.CONTRIBUTOR,
    poReceivingHistorySchema: ORDER_SCHEMA.RECEIVING_HISTORY,
    poCostSchema: ORDER_SCHEMA.COST_DETAILS,
    poFundDistributionSchema: ORDER_SCHEMA.FUND_DISTRIBUTION,
    poLocationSchema: ORDER_SCHEMA.LOCATION,
    poPhysicalResourceSchema: ORDER_SCHEMA.PHYSICAL,
    poEResourceSchema: ORDER_SCHEMA.E_RESOURCE,
    poVendorSchema: ORDER_SCHEMA.VENDOR,
    invoiceSchema: INVOICE_SCHEMA.INVOICE,
    invoiceAdjustmentsSchema: INVOICE_SCHEMA.ADJUSTMENTS,
    invoiceDocumentMetadataSchema: INVOICE_SCHEMA.DOCUMENT_METADATA,
    invoiceLineSchema: INVOICE_SCHEMA.INVOICE_LINE,
    invoiceFundDistributionSchema: INVOICE_SCHEMA.FUND_DISTRIBUTION,
  });

  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      matchProfiles: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    label: PropTypes.node.isRequired,
    selectedRecord: PropTypes.object.isRequired,
    checkboxList: checkboxListShape.isRequired,
    setList: PropTypes.func.isRequired,
    showSingleResult: PropTypes.bool,
    objectName: PropTypes.string,
    ENTITY_KEY: PropTypes.string,
    RecordView: PropTypes.func,
    RecordForm: PropTypes.func,
    INITIAL_RESULT_COUNT: PropTypes.number,
    RESULT_COUNT_INCREMENT: PropTypes.number,
    actionMenuItems: PropTypes.arrayOf(PropTypes.string),
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
    columnWidths: PropTypes.object,
    initialValues: PropTypes.object,
  };

  static defaultProps = {
    showSingleResult: true,
    objectName: 'match-profiles',
    ENTITY_KEY: ENTITY_KEYS.MATCH_PROFILES,
    INITIAL_RESULT_COUNT,
    RESULT_COUNT_INCREMENT,
    actionMenuItems: [
      'addNew',
      'exportSelected',
      'selectAll',
      'deselectAll',
    ],
    visibleColumns: ['selected', ...matchProfilesShape.visibleColumns],
    columnWidths: { selected: 40 },
    initialValues: {
      name: '',
      description: '',
      /* TODO: these values are hardcoded now and will need to be changed in future (https://issues.folio.org/browse/UIDATIMP-175) */
      incomingRecordType: 'MARC',
      existingRecordType: 'HOLDINGS',
      matchDetails: [{
        incomingRecordType: 'MARC',
        existingRecordType: 'HOLDINGS',
        incomingMatchExpression: {
          fields: [{
            label: 'field',
            value: '',
          }, {
            label: 'indicator1',
            value: '',
          }, {
            label: 'indicator2',
            value: '',
          }, {
            label: 'recordSubfield',
            value: '',
          }],
          dataValueType: 'VALUE_FROM_RECORD',
        },
        existingMatchExpression: {
          fields: [{
            label: 'field',
            value: '',
          }],
          dataValueType: 'VALUE_FROM_RECORD',
        },
        matchCriterion: 'EXACTLY_MATCHES',
      }],
    },
    RecordView: ViewMatchProfile,
    RecordForm: MatchProfilesForm,
  };

  renderHeaders = () => matchProfilesShape.renderHeaders(this.props);

  render() {
    const resultedProps = {
      ...this.props,
      renderHeaders: this.renderHeaders,
    };

    return <ListView {...resultedProps} />;
  }
}
