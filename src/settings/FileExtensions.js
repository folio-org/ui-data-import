import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { makeQueryFunction } from '@folio/stripes/smart-components';
import packageInfo from '../../package';
import FileExtensionItem from './FileExtensionItem';
import SearchAndSort from '../components/SearchAndSort';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

const filters = [];

class FileExtensions extends Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {},
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      perRequest: 10,
      records: 'fileExtensions',
      recordsRequired: '%{resultCount}',
      path: 'metadata-provider/fileExtension',
      throwErrors: false,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '',
            {
              'Extension': 'extension',
              'Block import': 'importBlocked',
              'Updated': 'metadata.updatedDate',
              'Data type(s)': 'dataTypes',
              'Username': 'username',
            },
            filters,
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
    browseOnly: PropTypes.bool,
  };

  static defaultProps = {
    showSingleResult: true,
    browseOnly: false,
  };

  constructor(props) {
    super(props);

    const { intl: { formatMessage } } = this.props;

    this.columnMapping = {
      extension: formatMessage({ id: 'ui-data-import.settings.fileExtension' }),
      importBlocked: formatMessage({ id: 'ui-data-import.settings.importBlocked' }),
      dataTypes: formatMessage({ id: 'ui-data-import.settings.dataTypes' }),
      updated: formatMessage({ id: 'ui-data-import.settings.updated' }),
      updatedBy: formatMessage({ id: 'ui-data-import.settings.updatedBy' }),
    };

    this.visibleColumns = [
      'extension',
      'importBlocked',
      'dataTypes',
      'updated',
      'updatedBy',
    ];

    this.resultsFormatter = {
      importBlocked: item => {
        const { importBlocked } = item;

        return `${importBlocked ? 'Block' : 'Allow'} import`;
      },
      dataTypes: item => {
        const { dataTypes } = item;

        const res = dataTypes.map(type => {
          return type !== 'Delimited' ? type.toUpperCase() : type;
        });

        return res.length > 0 ? res.join(', ') : '-';
      },
      updated: item => {
        const { metadata: { updatedDate } } = item;
        const { intl: { formatTime } } = this.props;

        return formatTime(updatedDate, {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric',
        });
      },
      updatedBy: item => {
        const { metadata: { updatedByUsername } } = item;

        if (updatedByUsername === 'System') {
          return updatedByUsername.toUpperCase();
        }

        return '';
      },
    };
  }

  render() {
    const {
      resources,
      mutator,
      browseOnly,
      showSingleResult,
    } = this.props;

    return (
      <Fragment>
        <SearchAndSort
          browseOnly={browseOnly}
          objectName="logs"
          parentResources={resources}
          parentMutator={mutator}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          resultsFormatter={this.resultsFormatter}
          visibleColumns={this.visibleColumns}
          columnMapping={this.columnMapping}
          viewRecordComponent={FileExtensionItem}
          packageInfo={packageInfo}
          viewRecordPerms="settings.data-import.enabled"
          showSingleResult={showSingleResult}
        />
      </Fragment>
    );
  }
}

export default injectIntl(FileExtensions);
