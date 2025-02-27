import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {
  flow,
  get,
  omit,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import { ListView } from '../../components';
import { ViewFileExtension } from './ViewFileExtension';
import { CreateFileExtension } from './CreateFileExtension';
import { EditFileExtension } from './EditFileExtension';

import {
  withCheckboxList,
  checkboxListShape,
  ENTITY_KEYS,
} from '../../utils';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const mapStateToProps = state => {
  const {
    hasLoaded = false,
    records: [record = {}] = [],
  } = get(state, 'folio_data_import_file_extension', {});
  const selectedRecord = {
    hasLoaded,
    record: omit(record, 'metadata', 'userInfo'),
  };

  return { selectedRecord };
};

class FileExtensionsComponent extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    fileExtensions: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: 'fileExtensions',
      recordsRequired: '%{resultCount}',
      path: 'data-import/fileExtensions',
      clientGeneratePk: false,
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(extension="%{query.query}*" or dataTypes="%{query.query}*")',
            {
              extension: 'extension',
              importBlocked: 'importBlocked',
              updated: 'metadata.updatedDate',
              dataTypes: 'dataTypes',
              updatedBy: 'userInfo.lastName userInfo.firstName userInfo.userName',
            },
            [],
          ),
        },
        staticFallback: { params: {} },
      },
    },
    restoreDefaults: {
      type: 'okapi',
      records: 'fileExtensions',
      path: 'data-import/fileExtensions/restore/default',
      fetch: false,
      throwErrors: false,
    },
  });

  static propTypes = {
    mutator: PropTypes.shape({
      fileExtensions: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
        DELETE: PropTypes.func.isRequired,
      }).isRequired,
      restoreDefaults: PropTypes.shape({ POST: PropTypes.func.isRequired }).isRequired,
    }).isRequired,
    resources: PropTypes.object.isRequired,
    label: PropTypes.node.isRequired,
    location: PropTypes.oneOfType([
      PropTypes.shape({
        search: PropTypes.string.isRequired,
        pathname: PropTypes.string.isRequired,
      }).isRequired,
      PropTypes.string.isRequired,
    ]),
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    selectedRecord: PropTypes.object.isRequired,
    checkboxList: checkboxListShape.isRequired,
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
    columnWidths: PropTypes.object,
    defaultSort: PropTypes.string,
  };

  static defaultProps = {
    showSingleResult: true,
    objectName: 'file-extensions',
    ENTITY_KEY: ENTITY_KEYS.FILE_EXTENSIONS,
    INITIAL_RESULT_COUNT,
    RESULT_COUNT_INCREMENT,
    actionMenuItems: [
      'addNew',
      'restoreDefaults',
    ],
    visibleColumns: [
      'extension',
      'importBlocked',
      'dataTypes',
      'updated',
      'updatedBy',
    ],
    columnWidths: {},
    defaultSort: 'extension',
    ViewRecordComponent: ViewFileExtension,
    CreateRecordComponent: CreateFileExtension,
    EditRecordComponent: EditFileExtension,
  };

  renderHeaders = () => ({
    extension: <FormattedMessage id="ui-data-import.settings.fileExtension.extension" />,
    importBlocked: <FormattedMessage id="ui-data-import.settings.fileExtension.blockImport" />,
    dataTypes: <FormattedMessage id="ui-data-import.settings.fileExtension.dataTypes" />,
    updated: <FormattedMessage id="ui-data-import.updated" />,
    updatedBy: <FormattedMessage id="ui-data-import.updatedBy" />,
  });

  render() {
    const resultedProps = {
      ...this.props,
      renderHeaders: this.renderHeaders,
    };

    return <ListView {...resultedProps} />;
  }
}

export const FileExtensions = flow([
  () => withCheckboxList()(FileExtensionsComponent),
  stripesConnect,
  connect(mapStateToProps),
])();
