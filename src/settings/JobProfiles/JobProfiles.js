import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { flow } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';

import { ListView } from '../../components';
import { ViewJobProfile } from './ViewJobProfile';
import { CreateJobProfile } from './CreateJobProfile';
import { EditJobProfile } from './EditJobProfile';

import {
  getSortQuery,
  getSearchQuery,
  ENTITY_KEYS,
  FIND_ALL_CQL,
  OCLC_CREATE_INSTANCE_JOB_ID,
  OCLC_UPDATE_INSTANCE_JOB_ID,
  QUICKMARK_DERIVE_CREATE_BIB_JOB_ID,
  QUICKMARK_DERIVE_CREATE_HOLDINGS_JOB_ID,
  DEFAULT_CREATE_HOLDINGS_JOB_ID,
} from '../../utils';

// big numbers to get rid of infinite scroll
const INITIAL_RESULT_COUNT = 5000;
const RESULT_COUNT_INCREMENT = 5000;
const defaultSort = 'name';

export const jobProfilesShape = {
  INITIAL_RESULT_COUNT,
  RESULT_COUNT_INCREMENT,
  manifest: {
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: { sort: defaultSort } },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: ENTITY_KEYS.JOB_PROFILES,
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/jobProfiles',
      clientGeneratePk: false,
      throwErrors: true,
      params: (_q, _p, _r, _l) => {
        const sortMap = {
          name: 'name',
          tags: 'tags.tagList',
          updated: 'metadata.updatedDate',
          updatedBy: 'userInfo.lastName userInfo.firstName userInfo.userName',
          description: 'description',
        };
        const queryTemplate =
          '(name="%{query.query}*" OR tags.tagList="%{query.query}*" OR description="%{query.query}*")';
        const sort = _r?.query?.sort;
        const search = _r?.query?.query;
        const sortQuery = sort ? `sortBy ${getSortQuery(sortMap, sort)}` : '';
        const searchQuery = search ? `AND ${getSearchQuery(queryTemplate, search)}` : '';
        const query = `${FIND_ALL_CQL} ${searchQuery} ${sortQuery}`;

        return { query };
      },
    },
  },
  visibleColumns: ['name', 'description', 'tags', 'updated', 'updatedBy'],
  columnWidths: {
    name: '300px',
    tags: '150px',
    updated: '100px',
    updatedBy: '250px',
  },
  renderHeaders: (props) => {
    let headers = {
      name: <FormattedMessage id="ui-data-import.name" />,
      description: <FormattedMessage id="ui-data-import.description" />,
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

export const generateManifest = (
  chooseJobProfile = false,
  dataTypeQuery = '',
  hideDefaultProfiles = false,
  hideDefaultCreateHoldingProfile = false
) => ({
  initializedFilterConfig: { initialValue: false },
  query: { initialValue: {} },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  jobProfiles: {
    type: 'okapi',
    perRequest: RESULT_COUNT_INCREMENT,
    records: ENTITY_KEYS.JOB_PROFILES,
    recordsRequired: '%{resultCount}',
    path: 'data-import-profiles/jobProfiles',
    clientGeneratePk: false,
    throwErrors: false,
    params: (_q, _p, _r, _l) => {
      const findAll = chooseJobProfile && dataTypeQuery !== '' ? `dataType==${dataTypeQuery}` : FIND_ALL_CQL;
      const withoutDefaultProfiles = hideDefaultProfiles
        ? `AND id<>(${OCLC_CREATE_INSTANCE_JOB_ID} AND ${OCLC_UPDATE_INSTANCE_JOB_ID} AND ${QUICKMARK_DERIVE_CREATE_BIB_JOB_ID} AND ${QUICKMARK_DERIVE_CREATE_HOLDINGS_JOB_ID})`
        : '';
      const withoutDefaultCreateHoldingProfile = hideDefaultCreateHoldingProfile
        ? `AND id<>${DEFAULT_CREATE_HOLDINGS_JOB_ID}`
        : '';
      const queryTemplate = chooseJobProfile
        ? 'AND (name="%{query.query}*" OR tags.tagList="%{query.query}*" OR description="%{query.query}*")'
        : '(name="%{query.query}*" OR tags.tagList="%{query.query}*")';
      const sortMap = {
        name: 'name',
        tags: 'tags.tagList',
        updated: 'metadata.updatedDate',
        updatedBy: 'userInfo.lastName userInfo.firstName userInfo.userName',
      };

      if (chooseJobProfile) {
        sortMap.description = 'description';
      }

      const sort = _r?.query?.sort;
      const search = _r?.query?.query;
      const sortQuery = sort ? `sortBy ${getSortQuery(sortMap, sort)}` : '';
      const searchQuery = search ? `${chooseJobProfile ? '' : 'AND '}${getSearchQuery(queryTemplate, search)}` : '';
      const query = `${findAll} ${withoutDefaultProfiles} ${withoutDefaultCreateHoldingProfile} ${searchQuery} ${sortQuery}`;

      return { query };
    },
  },
});

// TODO: this code could possibly be rewritten when https://issues.folio.org/browse/STCON-86 is done
export const createJobProfiles = (
  chooseJobProfile = false,
  dataTypeQuery = '',
  hideDefaultProfiles = false,
  hideDefaultCreateHoldingProfile = false
) => {
  const visibleColumns = chooseJobProfile ? jobProfilesShape.visibleColumns : ['name', 'tags', 'updated', 'updatedBy'];
  const columnWidths = { name: '430px' };

  class JobProfiles extends Component {
    static manifest = Object.freeze(
      generateManifest(chooseJobProfile, dataTypeQuery, hideDefaultProfiles, hideDefaultCreateHoldingProfile)
    );

    static propTypes = {
      resources: PropTypes.object.isRequired,
      mutator: PropTypes.shape({
        jobProfiles: PropTypes.shape({
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
      detailProps: PropTypes.object,
      withNewRecordButton: PropTypes.bool,
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
      objectName: 'job-profiles',
      ENTITY_KEY: ENTITY_KEYS.JOB_PROFILES,
      withNewRecordButton: true,
      INITIAL_RESULT_COUNT,
      RESULT_COUNT_INCREMENT,
      actionMenuItems: ['addNew'],
      visibleColumns,
      columnWidths,
      ViewRecordComponent: ViewJobProfile,
      CreateRecordComponent: CreateJobProfile,
      EditRecordComponent: EditJobProfile,
      defaultSort,
    };

    renderHeaders = () => jobProfilesShape.renderHeaders(this.props);

    render() {
      const resultedProps = {
        ...this.props,
        renderHeaders: this.renderHeaders,
      };

      return <ListView {...resultedProps} />;
    }
  }

  return flow([() => stripesConnect(JobProfiles), withRouter])();
};
