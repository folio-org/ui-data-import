import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  isEqual,
  isEmpty,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import {
  fetchJsonSchema,
  getModuleVersion,
  handleAllRequests,
  getSearchQuery,
  getSortQuery,
  ENTITY_KEYS,
  INSTANCE_RESOURCE_PATHS,
  HOLDINGS_RESOURCE_PATHS,
  ITEM_RESOURCE_PATHS,
  INVOICE_RESOURCE_PATHS,
  ACQ_DATA_RESOURCE_PATHS,
  FIND_ALL_CQL,
  getIdentifierTypes,
} from '../../utils';
import { ListView } from '../../components';
import { ViewMatchProfile } from './ViewMatchProfile';
import { CreateMatchProfile } from './CreateMatchProfile';
import { EditMatchProfile } from './EditMatchProfile';

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
const defaultSort = 'name';

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
    query: { initialValue: { sort: defaultSort } },
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
        const query = `${props.filterParams?.manifest?.query || FIND_ALL_CQL} ${searchQuery} ${sortQuery}`;

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

    return headers;
  },
};

@stripesConnect
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
            0,
            null,
            false,
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
    showSingleResult: PropTypes.bool,
    objectName: PropTypes.string,
    ENTITY_KEY: PropTypes.string,
    ViewRecordComponent: PropTypes.func,
    CreateRecordComponent: PropTypes.func,
    EditRecordComponent: PropTypes.func,
    INITIAL_RESULT_COUNT: PropTypes.number,
    RESULT_COUNT_INCREMENT: PropTypes.number,
    actionMenuItems: PropTypes.arrayOf(PropTypes.string),
    visibleColumns: PropTypes.arrayOf(PropTypes.string),
    nonInteractiveHeaders: PropTypes.arrayOf(PropTypes.string),
    columnWidths: PropTypes.object,
    defaultSort: PropTypes.string,
  };

  static defaultProps = {
    showSingleResult: true,
    objectName: 'match-profiles',
    ENTITY_KEY: ENTITY_KEYS.MATCH_PROFILES,
    INITIAL_RESULT_COUNT,
    RESULT_COUNT_INCREMENT,
    actionMenuItems: ['addNew'],
    visibleColumns: matchProfilesShape.visibleColumns,
    columnWidths: { name: '430px' },
    ViewRecordComponent: ViewMatchProfile,
    CreateRecordComponent: CreateMatchProfile,
    EditRecordComponent: EditMatchProfile,
    defaultSort,
  };

  state = {
    INSTANCE: {},
    HOLDINGS: {},
    ITEM: {},
    ORDER: {},
    INVOICE: {},
    identifierTypes: [],
  };

  async componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.resources.modules, this.props.resources.modules)
      && !isEmpty(this.props.resources.modules.records)) {
      const {
        stripes,
        stripes: { okapi },
        resources: { modules: { records } },
      } = this.props;

      const inventoryModuleVersion = getModuleVersion(records, 'Inventory Storage Module');
      const ordersModuleVersion = getModuleVersion(records, 'Orders Business Logic Module');
      const invoiceModuleVersion = getModuleVersion(records, 'Invoice business logic module');

      const requestsToInstance = INSTANCE_RESOURCE_PATHS.map(path => fetchJsonSchema(path, inventoryModuleVersion, okapi));
      const requestsToHoldings = HOLDINGS_RESOURCE_PATHS.map(path => fetchJsonSchema(path, inventoryModuleVersion, okapi));
      const requestsToItem = ITEM_RESOURCE_PATHS.map(path => fetchJsonSchema(path, inventoryModuleVersion, okapi));
      const requestsToInvoice = INVOICE_RESOURCE_PATHS.map(path => fetchJsonSchema(path, invoiceModuleVersion, okapi));
      const requestToAcquisitionsData = ACQ_DATA_RESOURCE_PATHS.map(path => fetchJsonSchema(path, ordersModuleVersion, okapi));

      await handleAllRequests(requestsToInstance, 'INSTANCE', this.addToState);
      await handleAllRequests(requestsToHoldings, 'HOLDINGS', this.addToState);
      await handleAllRequests(requestToAcquisitionsData, 'HOLDINGS', this.addToState);
      await handleAllRequests(requestsToItem, 'ITEM', this.addToState);
      await handleAllRequests(requestToAcquisitionsData, 'INSTANCE', this.addToState);
      await handleAllRequests(requestToAcquisitionsData, 'ITEM', this.addToState);
      await handleAllRequests(requestsToInvoice, 'INVOICE', this.addToState);
      await getIdentifierTypes(stripes).then(identifierTypes => this.setState({ identifierTypes }));
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
