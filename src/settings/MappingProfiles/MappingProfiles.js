import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import { ListView } from '../../components';
import { ViewMappingProfile } from './ViewMappingProfile';
import { CreateMappingProfile } from './CreateMappingProfile';
import { EditMappingProfile } from './EditMappingProfile';

import {
  getSortQuery,
  getSearchQuery,
  marcFieldProtectionSettingsShape,
  OCLC_CREATE_INSTANCE_MAPPING_ID,
  OCLC_UPDATE_INSTANCE_MAPPING_ID,
  OCLC_CREATE_MARC_BIB_MAPPING_ID,
  QUICKMARK_DERIVE_CREATE_BIB_MAPPING_ID,
  QUICKMARK_DERIVE_CREATE_HOLDINGS_MAPPING_ID,
  ENTITY_KEYS,
  FIND_ALL_CQL,
} from '../../utils';

// big numbers to get rid of infinite scroll
const INITIAL_RESULT_COUNT = 5000;
const RESULT_COUNT_INCREMENT = 5000;
const queryTemplate = `(
  name="%{query.query}*" OR
  existingRecordType="%{query.query}*" OR
  tags.tagList="%{query.query}*"
)`;
const sortMap = {
  name: 'name',
  folioRecord: 'existingRecordType',
  tags: 'tags.tagList',
  updated: 'metadata.updatedDate',
  updatedBy: 'userInfo.lastName userInfo.firstName userInfo.userName',
};
const defaultSort = 'name';

export const mappingProfilesShape = {
  INITIAL_RESULT_COUNT,
  RESULT_COUNT_INCREMENT,
  manifest: {
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: { sort: defaultSort } },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: ENTITY_KEYS.MAPPING_PROFILES,
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/mappingProfiles',
      clientGeneratePk: false,
      throwErrors: true,
      params: (_q, _p, _r, _l) => {
        const sort = _r?.query?.sort;
        const search = _r?.query?.query;
        const filterByRecordType = _r?.query?.filterByRecordType;
        const sortQuery = sort ? `sortBy ${getSortQuery(sortMap, sort)}` : '';
        const searchQuery = search ? `AND ${getSearchQuery(queryTemplate, search)}` : '';
        const filterByRecordTypeQuery = filterByRecordType ? `AND existingRecordType="${filterByRecordType}"` : '';

        const withoutDefaultProfiles = `AND id<>(${OCLC_CREATE_INSTANCE_MAPPING_ID} AND ${OCLC_UPDATE_INSTANCE_MAPPING_ID} AND ${OCLC_CREATE_MARC_BIB_MAPPING_ID} AND ${QUICKMARK_DERIVE_CREATE_BIB_MAPPING_ID} AND ${QUICKMARK_DERIVE_CREATE_HOLDINGS_MAPPING_ID})`;
        const query = `${FIND_ALL_CQL} ${filterByRecordTypeQuery} ${withoutDefaultProfiles} ${searchQuery} ${sortQuery}`;

        return { query };
      },
    },
  },
  visibleColumns: [
    'name',
    'folioRecord',
    'tags',
    'updated',
    'updatedBy',
  ],
  columnWidths: {
    name: '300px',
    folioRecord: '150px',
    tags: '150px',
    updated: '100px',
    updatedBy: '250px',
  },
  renderHeaders: props => {
    let headers = {
      name: <FormattedMessage id="ui-data-import.name" />,
      folioRecord: <FormattedMessage id="ui-data-import.folioRecordType" />,
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

class MappingProfilesComponent extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    mappingProfiles: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: 'mappingProfiles',
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/mappingProfiles',
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
    marcFieldProtectionSettings: {
      type: 'okapi',
      path: 'field-protection-settings/marc',
      records: 'marcFieldProtectionSettings',
      throwErrors: false,
      GET: { path: 'field-protection-settings/marc?query=source=USER&limit=1000' },
    },
  });

  static propTypes = {
    resources: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      mappingProfiles: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
      }).isRequired,
      marcFieldProtectionSettings: PropTypes.shape({ records: PropTypes.arrayOf(marcFieldProtectionSettingsShape) }).isRequired,
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
    isFullScreen: PropTypes.bool,
    defaultSort: PropTypes.string,
  };

  static defaultProps = {
    showSingleResult: true,
    objectName: 'mapping-profiles',
    ENTITY_KEY: ENTITY_KEYS.MAPPING_PROFILES,
    INITIAL_RESULT_COUNT,
    RESULT_COUNT_INCREMENT,
    actionMenuItems: ['addNew'],
    visibleColumns: mappingProfilesShape.visibleColumns,
    columnWidths: { name: '430px' },
    isFullScreen: true,
    ViewRecordComponent: ViewMappingProfile,
    CreateRecordComponent: CreateMappingProfile,
    EditRecordComponent: EditMappingProfile,
    defaultSort,
  };

  renderHeaders = () => mappingProfilesShape.renderHeaders(this.props);

  render() {
    const resultedProps = {
      ...this.props,
      renderHeaders: this.renderHeaders,
    };

    return <ListView {...resultedProps} />;
  }
}

export const MappingProfiles = stripesConnect(MappingProfilesComponent);
