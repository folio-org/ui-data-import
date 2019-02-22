import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { IntlConsumer } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';
import {
  makeQueryFunction,
  buildUrl,
} from '@folio/stripes/smart-components';

import {
  FileExtensionForm,
  SearchAndSort,
} from '../../components';
import { ViewFileExtension } from './ViewFileExtension';
import { resultsFormatter } from './resultsFormatter';
import { getXHRErrorMessage } from '../../utils';

import css from './FileExtensions.css';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class FileExtensions extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    query: {
      initialValue: {},
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
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
            '(extension="%{query.query}*")',
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
  });

  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    label: PropTypes.node.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
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

  transitionToParams = params => {
    const {
      location,
      history,
    } = this.props;

    const url = buildUrl(location, params);

    history.push(url);
  };

  createRecord = async record => {
    const { mutator: { records } } = this.props;

    try {
      const { match: { path } } = this.props;

      const newRecord = await records.POST(record);

      this.transitionToParams({
        _path: `${path}/view/${newRecord.id}`,
        layer: null,
      });

      return newRecord;
    } catch (error) {
      this.showCreateRecordErrorMessage(error, record);

      return error;
    }
  };

  async showCreateRecordErrorMessage(response, fileExtension) {
    const { extension } = fileExtension;
    const errorMsgIdEnding = await getXHRErrorMessage(response);

    const errorMsgId = errorMsgIdEnding
      ? `ui-data-import.validation.${errorMsgIdEnding}`
      : 'ui-data-import.error.network';

    const errorMessage = (
      <FormattedMessage
        id={errorMsgId}
        values={{ value: extension }}
      />
    );

    this.callout.sendCallout({
      type: 'error',
      message: errorMessage,
    });
  }

  createCalloutRef = ref => {
    this.callout = ref;
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
                defaultSort="extension"
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
                newRecordInitialValues={newRecordInitialValues}
                showSingleResult={showSingleResult}
                onCreate={this.createRecord}
              />
            </div>
            <div
              className={css.newRecordContainer}
              ref={this.createNewRecordContainerRef}
            />
            <Callout ref={this.createCalloutRef} />
          </Fragment>
        )}
      </IntlConsumer>
    );
  }
}

export { FileExtensions };
