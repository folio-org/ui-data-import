import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {
  get,
  isEqual,
  isEmpty,
  omit,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import {
  withCheckboxList,
  checkboxListShape,
  fetchJsonSchema,
  getModuleVersion,
  handleAllRequests,
  getSearchQuery,
  getSortQuery,
  ENTITY_KEYS,
  INSTANCE_RESOURCE_PATHS,
  HOLDINGS_RESOURCE_PATHS,
  ITEM_RESOURCE_PATHS,
  ORDER_RESOURCE_PATHS,
  NOTES_RESOURCE_PATHS,
  INVOICE_RESOURCE_PATHS,
  FIND_ALL_CQL,
  OCLC_MATCH_EXISTING_SRS_RECORD_ID,
  OCLC_MATCH_NO_SRS_RECORD_ID,
  ACQ_DATA_RESOURCE_PATHS,
} from '../../utils';
import {
  ListView,
  CheckboxHeader,
} from '../../components';
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
const sortMap = {
  name: 'name',
  match: 'existingRecordType field fieldMarc fieldNonMarc existingStaticValueType',
  tags: 'tags.tagList',
  updated: 'metadata.updatedDate',
  updatedBy: 'userInfo.firstName userInfo.lastName userInfo.userName',
};

const sectionInitialValues = {
  MARC_BIBLIOGRAPHIC: {
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
    staticValueDetails: null,
    dataValueType: 'VALUE_FROM_RECORD',
  },
  MARC_HOLDINGS: {
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
    staticValueDetails: null,
    dataValueType: 'VALUE_FROM_RECORD',
  },
  MARC_AUTHORITY: {
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
    staticValueDetails: null,
    dataValueType: 'VALUE_FROM_RECORD',
  },
  INSTANCE: {
    fields: [{
      label: 'field',
      value: '',
    }],
    dataValueType: 'VALUE_FROM_RECORD',
  },
  ITEM: {
    fields: [{
      label: 'field',
      value: '',
    }],
    dataValueType: 'VALUE_FROM_RECORD',
  },
  HOLDINGS: {
    fields: [{
      label: 'field',
      value: '',
    }],
    dataValueType: 'VALUE_FROM_RECORD',
  },
  ORDER: {
    fields: [{
      label: 'field',
      value: '',
    }],
    dataValueType: 'VALUE_FROM_RECORD',
  },
  INVOICE: {
    fields: [{
      label: 'field',
      value: '',
    }],
    dataValueType: 'VALUE_FROM_RECORD',
  },
  STATIC_VALUE: {
    fields: [],
    staticValueDetails: {
      staticValueType: 'TEXT',
      text: '',
      number: '',
      exactDate: '',
      fromDate: '',
      toDate: '',
    },
    dataValueType: 'STATIC_VALUE',
  },
};

export const getSectionInitialValues = recordType => sectionInitialValues[recordType];

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
      params: (_q, _p, _r, _l, props) => {
        const sort = _r?.query?.sort;
        const search = _r?.query?.query;
        const sortQuery = sort ? `sortBy ${getSortQuery(sortMap, sort)}` : '';
        const searchQuery = search ? `AND ${getSearchQuery(queryTemplate, search)}` : '';
        const withoutDefaultProfiles = `AND (id="" NOT id=="${OCLC_MATCH_EXISTING_SRS_RECORD_ID}") AND (id="" NOT id=="${OCLC_MATCH_NO_SRS_RECORD_ID}")`;
        const query = `${props.filterParams?.manifest?.query || FIND_ALL_CQL} ${withoutDefaultProfiles} ${searchQuery} ${sortQuery}`;

        return { query };
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
            FIND_ALL_CQL,
            queryTemplate,
            sortMap,
            [],
          ),
        },
        staticFallback: { params: {} },
      },
    },
    modules: {
      type: 'okapi',
      path: (queryParams, pathComponents, resourceData, logger, props) => {
        const { stripes: { okapi: { tenant } } } = props;

        return `_/proxy/tenants/${tenant}/modules`;
      },
      throwErrors: false,
      GET: { params: { full: true } },
    },
  });

  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      matchProfiles: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
    stripes: PropTypes.object.isRequired,
    location: PropTypes.oneOfType([
      PropTypes.shape({
        search: PropTypes.string.isRequired,
        pathname: PropTypes.string.isRequired,
      }).isRequired,
      PropTypes.string.isRequired,
    ]),
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
    columnWidths: { selected: '40px' },
    initialValues: {
      name: '',
      description: '',
      /* TODO: these values are hardcoded now and will need to be changed in future (https://issues.folio.org/browse/UIDATIMP-175) */
      incomingRecordType: 'MARC_BIBLIOGRAPHIC',
      matchDetails: [{
        incomingRecordType: 'MARC_BIBLIOGRAPHIC',
        incomingMatchExpression: getSectionInitialValues('MARC_BIBLIOGRAPHIC'),
        existingRecordType: 'INSTANCE',
        existingMatchExpression: getSectionInitialValues('INSTANCE'),
        matchCriterion: 'EXACTLY_MATCHES',
      }],
    },
    RecordView: ViewMatchProfile,
    RecordForm: MatchProfilesForm,
  };

  state = {
    INSTANCE: {},
    HOLDINGS: {},
    ITEM: {},
    ORDER: {},
    INVOICE: {},
  };

  async componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.resources.modules, this.props.resources.modules)
      && !isEmpty(this.props.resources.modules.records)) {
      const {
        stripes: { okapi },
        resources: { modules: { records } },
      } = this.props;

      const inventoryModuleVersion = getModuleVersion(records, 'Inventory Storage Module');
      const ordersModuleVersion = getModuleVersion(records, 'Orders Business Logic Module');
      const notesModuleVersion = getModuleVersion(records, 'Notes');
      const invoiceModuleVersion = getModuleVersion(records, 'Invoice business logic module');

      const requestsToInstance = INSTANCE_RESOURCE_PATHS.map(path => fetchJsonSchema(path, inventoryModuleVersion, okapi));
      const requestsToHoldings = HOLDINGS_RESOURCE_PATHS.map(path => fetchJsonSchema(path, inventoryModuleVersion, okapi));
      const requestsToItem = ITEM_RESOURCE_PATHS.map(path => fetchJsonSchema(path, inventoryModuleVersion, okapi));
      const requestToAcquisitionsData = ACQ_DATA_RESOURCE_PATHS.map(path => fetchJsonSchema(path, ordersModuleVersion, okapi));
      const requestsToOrder = ORDER_RESOURCE_PATHS.map(path => fetchJsonSchema(path, ordersModuleVersion, okapi));
      const requestsToNotes = NOTES_RESOURCE_PATHS.map(path => fetchJsonSchema(path, notesModuleVersion, okapi));
      const requestsToInvoice = INVOICE_RESOURCE_PATHS.map(path => fetchJsonSchema(path, invoiceModuleVersion, okapi));

      await handleAllRequests(requestsToInstance, 'INSTANCE', this.addToState);
      await handleAllRequests(requestsToHoldings, 'HOLDINGS', this.addToState);
      await handleAllRequests(requestsToItem, 'ITEM', this.addToState);
      await handleAllRequests(requestToAcquisitionsData, 'ITEM', this.addToState);
      await handleAllRequests(requestsToOrder, 'ORDER', this.addToState);
      await handleAllRequests(requestsToNotes, 'ORDER', this.addToState);
      await handleAllRequests(requestsToInvoice, 'INVOICE', this.addToState);
    }
  }

  addToState = (properties, stateKey) => {
    properties.forEach(item => {
      this.setState(state => ({
        [stateKey]: {
          ...state[stateKey],
          ...item,
        },
      }));
    });
  };

  renderHeaders = () => matchProfilesShape.renderHeaders(this.props);

  render() {
    const resultedProps = {
      ...this.props,
      renderHeaders: this.renderHeaders,
      detailProps: { jsonSchemas: { ...this.state } },
    };

    return <ListView {...resultedProps} />;
  }
}
