import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { IntlConsumer } from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';

import SearchAndSort from '../../components/SearchAndSort';
import ViewFileExtension from './ViewFileExtension';
import resultsFormatter from './resultsFormatter';

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
              'Username': 'username',
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

  columnWidths = { updated: 150 };

  render() {
    const {
      resources,
      mutator,
      label,
      showSingleResult,
    } = this.props;

    return (
      <Fragment>
        <IntlConsumer>
          {intl => (
            <SearchAndSort
              objectName="logs"
              parentResources={resources}
              parentMutator={mutator}
              initialResultCount={INITIAL_RESULT_COUNT}
              resultCountIncrement={RESULT_COUNT_INCREMENT}
              searchLabelKey="ui-data-import.settings.fileExtensions"
              resultCountMessageKey="ui-data-import.settings.fileExtensionsCount"
              resultsLabel={label}
              resultsFormatter={resultsFormatter(intl)}
              visibleColumns={this.visibleColumns}
              columnMapping={{
                extension: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension' }),
                importBlocked: intl.formatMessage({ id: 'ui-data-import.settings.importBlocked' }),
                dataTypes: intl.formatMessage({ id: 'ui-data-import.settings.dataTypes' }),
                updated: intl.formatMessage({ id: 'ui-data-import.settings.updated' }),
                updatedBy: intl.formatMessage({ id: 'ui-data-import.settings.updatedBy' }),
              }}
              columnWidths={this.columnWidths}
              ViewRecordComponent={ViewFileExtension}
              showSingleResult={showSingleResult}
            />
          )}
        </IntlConsumer>
      </Fragment>
    );
  }
}

export default FileExtensions;
