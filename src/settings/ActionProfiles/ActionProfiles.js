import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import { ListView } from '../../components';
import { ViewActionProfile } from './ViewActionProfile';
import { CreateActionProfile } from './CreateActionProfile';
import { EditActionProfile } from './EditActionProfile';

import {
  getSortQuery,
  getSearchQuery,
  ENTITY_KEYS,
  FIND_ALL_CQL,
  OCLC_CREATE_INSTANCE_ACTION_ID,
  OCLC_UPDATE_INSTANCE_ACTION_ID,
  OCLC_CREATE_MARC_BIB_ACTION_ID,
  QUICKMARK_DERIVE_CREATE_BIB_ACTION_ID,
  QUICKMARK_DERIVE_CREATE_HOLDINGS_ACTION_ID,
} from '../../utils';

// big numbers to get rid of infinite scroll
const INITIAL_RESULT_COUNT = 5000;
const RESULT_COUNT_INCREMENT = 5000;
const queryTemplate = `(
  name="%{query.query}*" OR
  action="%{query.query}*" OR
  folioRecord="%{query.query}*" OR
  tags.tagList="%{query.query}*"
)`;
const sortMap = {
  name: 'name',
  action: 'action folioRecord',
  tags: 'tags.tagList',
  updated: 'metadata.updatedDate',
  updatedBy: 'userInfo.lastName userInfo.firstName userInfo.userName',
};
const defaultSort = 'name';

export const actionProfilesShape = {
  INITIAL_RESULT_COUNT,
  RESULT_COUNT_INCREMENT,
  manifest: {
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: { sort: defaultSort } },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: ENTITY_KEYS.ACTION_PROFILES,
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/actionProfiles',
      clientGeneratePk: false,
      throwErrors: true,
      params: (_q, _p, _r, _l) => {
        const sort = _r?.query?.sort;
        const search = _r?.query?.query;
        const sortQuery = sort ? `sortBy ${getSortQuery(sortMap, sort)}` : '';
        const searchQuery = search ? `AND ${getSearchQuery(queryTemplate, search)}` : '';

        const withoutDefaultProfiles = `AND id<>(${OCLC_CREATE_INSTANCE_ACTION_ID} AND ${OCLC_UPDATE_INSTANCE_ACTION_ID} AND ${OCLC_CREATE_MARC_BIB_ACTION_ID} AND ${QUICKMARK_DERIVE_CREATE_BIB_ACTION_ID} AND ${QUICKMARK_DERIVE_CREATE_HOLDINGS_ACTION_ID})`;
        const query = `${FIND_ALL_CQL} ${withoutDefaultProfiles} ${searchQuery} ${sortQuery}`;

        return { query };
      },
    },
  },
  visibleColumns: [
    'name',
    'action',
    'tags',
    'updated',
    'updatedBy',
  ],
  columnWidths: {
    name: '300px',
    action: '200px',
    tags: '150px',
    updated: '100px',
    updatedBy: '250px',
  },

  renderHeaders: props => {
    let headers = {
      name: <FormattedMessage id="ui-data-import.name" />,
      action: <FormattedMessage id="ui-data-import.action" />,
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
export class ActionProfiles extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    actionProfiles: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: 'actionProfiles',
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/actionProfiles',
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
  });

  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      actionProfiles: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
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
    objectName: 'action-profiles',
    ENTITY_KEY: ENTITY_KEYS.ACTION_PROFILES,
    INITIAL_RESULT_COUNT,
    RESULT_COUNT_INCREMENT,
    actionMenuItems: ['addNew'],
    visibleColumns: actionProfilesShape.visibleColumns,
    columnWidths: { name: '430px' },
    ViewRecordComponent: ViewActionProfile,
    CreateRecordComponent: CreateActionProfile,
    EditRecordComponent: EditActionProfile,
    defaultSort,
  };

  renderHeaders = () => actionProfilesShape.renderHeaders(this.props);

  render() {
    const resultedProps = {
      ...this.props,
      renderHeaders: this.renderHeaders,
    };

    return <ListView {...resultedProps} />;
  }
}
