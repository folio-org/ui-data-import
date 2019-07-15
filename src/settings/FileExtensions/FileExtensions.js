import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
import { ListView } from '../../components/ListView';
import { ViewFileExtension } from './ViewFileExtension';
import { FileExtensionForm } from './FileExtensionForm';

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

@withCheckboxList
@stripesConnect
@connect(mapStateToProps)
export class FileExtensions extends Component {
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
              updatedBy: 'userInfo.firstName userInfo.lastName userInfo.userName',
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
    location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    selectedRecord: PropTypes.object.isRequired,
    checkboxList: checkboxListShape.isRequired,
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
    objectName: 'file-extensions',
    ENTITY_KEY: ENTITY_KEYS.FILE_EXTENSIONS,
    INITIAL_RESULT_COUNT,
    RESULT_COUNT_INCREMENT,
    actionMenuItems: ['restoreDefaults'],
    visibleColumns: [
      'extension',
      'importBlocked',
      'dataTypes',
      'updated',
      'updatedBy',
    ],
    columnWidths: {
      extension: 100,
      dataTypes: 150,
      updated: 150,
      updatedBy: 250,
    },
    initialValues: {
      importBlocked: false,
      description: '',
      extension: '',
      dataTypes: [],
    },
    RecordView: ViewFileExtension,
    RecordForm: FileExtensionForm,
  };

  renderHeaders = intl => ({
    extension: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension.extension' }),
    importBlocked: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension.blockImport' }),
    dataTypes: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension.dataTypes' }),
    updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
    updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
  });

  render() {
    const resultedProps = {
      ...this.props,
      renderHeaders: this.renderHeaders,
    };

    return <ListView {...resultedProps} />;
  }
}
