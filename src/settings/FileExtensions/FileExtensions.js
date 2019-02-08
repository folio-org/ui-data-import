import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { IntlConsumer } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import SearchAndSort from '../../components/SearchAndSort';
import ViewFileExtension from './ViewFileExtension';
import resultsFormatter from './resultsFormatter';
import FileExtensionForm from './FileExtensionForm';

import css from './FileExtensions.css';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class FileExtensions extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: { sort: 'Extension' },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: 'fileExtensions',
      recordsRequired: '%{resultCount}',
      path: 'metadata-provider/fileExtension',
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '(extension="%{query.query}*")',
            {
              'Extension': 'extension',
              'Block import': 'importBlocked',
              'Updated': 'metadata.updatedDate',
              'Data type(s)': 'dataTypes',
              'Updated by': 'userInfo.firstName userInfo.lastName userInfo.userName',
            },
            [],
          ),
        },
        staticFallback: { params: {} },
      },
    },
  });

  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    label: PropTypes.node.isRequired,
    showSingleResult: PropTypes.bool,
  };

  static defaultProps = { showSingleResult: true };

  visibleColumns = [
    'extension',
    'importBlocked',
    'dataTypes',
    'updated',
    'updatedBy',
  ];

  columnWidths = {
    updated: 150,
    updatedBy: 250,
  };

  createNewRecordContainerRef = ref => { this.newRecordContainer = ref; };

  createRecord = record => {
    // eslint-disable-next-line no-console
    console.log(record);

    // TODO: this will be handled in UIDATIMP-79
  };

  render() {
    const {
      resources,
      mutator,
      label,
      showSingleResult,
    } = this.props;

    const newRecordInitialValues = {
      importBlocked: false,
      description: '',
      extension: '',
      dataTypes: [],
    };

    return (
      <IntlConsumer>
        {intl => (
          <Fragment>
            <div
              className={css.fileExtensionContainer}
              data-test-file-extensions
            >
              <SearchAndSort
                objectName="file-extensions"
                parentResources={resources}
                parentMutator={mutator}
                initialResultCount={INITIAL_RESULT_COUNT}
                resultCountIncrement={RESULT_COUNT_INCREMENT}
                searchLabelKey="ui-data-import.settings.fileExtensions.title"
                resultCountMessageKey="ui-data-import.settings.fileExtensions.count"
                resultsLabel={label}
                resultsFormatter={resultsFormatter(intl)}
                visibleColumns={this.visibleColumns}
                columnMapping={{
                  extension: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension.extension' }),
                  importBlocked: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension.blockImport' }),
                  dataTypes: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension.dataTypes' }),
                  updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
                  updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
                }}
                columnWidths={this.columnWidths}
                newRecordContainer={this.newRecordContainer}
                ViewRecordComponent={ViewFileExtension}
                EditRecordComponent={FileExtensionForm}
                onCreate={this.createRecord}
                newRecordInitialValues={newRecordInitialValues}
                showSingleResult={showSingleResult}
              />
            </div>
            <div
              className={css.newRecordContainer}
              ref={this.createNewRecordContainerRef}
            />
          </Fragment>
        )}
      </IntlConsumer>
    );
  }
}

export default FileExtensions;
