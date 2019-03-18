import React, {
  Component,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';

import { IntlConsumer } from '@folio/stripes/core';
import {
  Callout,
  Button,
  ConfirmationModal,
} from '@folio/stripes/components';
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

export class FileExtensions extends Component {
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
    restoreDefaultFileExtensions: {
      type: 'okapi',
      records: 'fileExtensions',
      path: 'data-import/fileExtensions/restore/default',
      fetch: false,
      throwErrors: false,
    },
  });

  static propTypes = {
    mutator: PropTypes.shape({
      records: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
        DELETE: PropTypes.func.isRequired,
      }).isRequired,
      restoreDefaultFileExtensions: PropTypes.shape({
        POST: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
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

  state = {
    isResetFileExtensionsModalOpen: false,
    areFileExtensionsResetting: false,
  };

  visibleColumns = [
    'extension',
    'importBlocked',
    'dataTypes',
    'updated',
    'updatedBy',
  ];

  columnWidths = {
    extension: 100,
    dataTypes: 150,
    updated: 150,
    updatedBy: 250,
  };

  transitionToParams = params => {
    const {
      location,
      history,
    } = this.props;

    const url = buildUrl(location, params);

    history.push(url);
  };

  createRecord = record => {
    const { mutator: { records } } = this.props;

    return records.POST(record)
      .catch(error => {
        this.showUpdateRecordErrorMessage(error, record);

        throw error;
      });
  };

  editRecord = record => {
    const { mutator: { records } } = this.props;

    return records.PUT(record)
      .catch(error => {
        this.showUpdateRecordErrorMessage(error, record, true);

        throw error;
      });
  };

  deleteRecord = async record => {
    const { mutator: { records } } = this.props;

    try {
      await records.DELETE(record);

      const { match: { path } } = this.props;

      this.transitionToParams({
        _path: `${path}/view`,
        layer: null,
      });
      this.showDeleteRecordSuccessfulMessage(record);
    } catch (error) {
      this.showDeleteRecordErrorMessage(record);
    }
  };

  showDeleteRecordSuccessfulMessage = record => {
    const message = (
      <FormattedMessage
        id="ui-data-import.settings.fileExtension.action.success"
        values={{
          extension: record.extension,
          action: (
            <strong>
              <FormattedMessage id="ui-data-import.deleted" />
            </strong>
          ),
        }}
      />
    );

    this.callout.sendCallout({ message });
  };

  showDeleteRecordErrorMessage = record => {
    const message = (
      <FormattedMessage
        id="ui-data-import.settings.fileExtension.action.error"
        values={{
          extension: record.extension,
          action: (
            <strong>
              <FormattedMessage id="ui-data-import.deleted" />
            </strong>
          ),
        }}
      />
    );

    this.callout.sendCallout({
      type: 'error',
      message,
    });
  };

  handleUpdateRecordSuccess = (record, dispatch, props) => {
    const { reset: resetForm } = props;

    resetForm();

    const { match: { path } } = this.props;

    this.transitionToParams({
      _path: `${path}/view/${record.id}`,
      layer: null,
    });
  };

  async showUpdateRecordErrorMessage(response, fileExtension, isEditMode = false) {
    const { extension } = fileExtension;
    const errorMsgIdEnding = await getXHRErrorMessage(response);

    const errorMsgId = errorMsgIdEnding
      ? `ui-data-import.validation.${errorMsgIdEnding}`
      : `ui-data-import.settings.fileExtension.${isEditMode ? 'edit' : 'create'}.error.network`;

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

  renderActionMenu = menu => (
    <Button
      data-test-restore-default-file-extensions-button
      buttonStyle="dropdownItem"
      onClick={() => this.handleRestoreDefaultFileExtensions(menu)}
    >
      <FormattedMessage id="ui-data-import.settings.fileExtensions.reset" />
    </Button>
  );

  handleRestoreDefaultFileExtensions = menu => {
    menu.onToggle();
    this.showRestoreDefaultFileExtensionsModal();
  };

  showRestoreDefaultFileExtensionsModal() {
    this.setState({ isResetFileExtensionsModalOpen: true });
  }

  hideResetFileExtensionsToDefaultsModal = () => {
    this.setState({
      isResetFileExtensionsModalOpen: false,
      areFileExtensionsResetting: false,
    });
  };

  restoreDefaultFileExtensions = async () => {
    const { areFileExtensionsResetting } = this.state;

    if (areFileExtensionsResetting) {
      return;
    }

    try {
      const {
        match: { path },
        mutator: { restoreDefaultFileExtensions },
      } = this.props;

      this.setState({ areFileExtensionsResetting: true });
      await restoreDefaultFileExtensions.POST({});

      this.transitionToParams({
        _path: `${path}/view`,
        layer: null,
      });

      this.hideResetFileExtensionsToDefaultsModal();
    } catch (error) {
      this.hideResetFileExtensionsToDefaultsModal();

      this.callout.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-data-import.settings.fileExtension.reset.error.network" />,
      });
    }
  };

  createFullWidthContainerRef = ref => { this.fullWidthContainer = ref; };

  createCalloutRef = ref => { this.callout = ref; };

  render() {
    const {
      resources,
      location: { search },
      mutator,
      label,
      showSingleResult,
    } = this.props;
    const { isResetFileExtensionsModalOpen } = this.state;

    const urlQuery = queryString.parse(search);
    const searchTerm = (urlQuery.query || '').trim();
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
                actionMenu={this.renderActionMenu}
                resultsFormatter={resultsFormatter(intl, searchTerm)}
                visibleColumns={this.visibleColumns}
                columnMapping={{
                  extension: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension.extension' }),
                  importBlocked: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension.blockImport' }),
                  dataTypes: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension.dataTypes' }),
                  updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
                  updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
                }}
                columnWidths={this.columnWidths}
                fullWidthContainer={this.fullWidthContainer}
                ViewRecordComponent={ViewFileExtension}
                EditRecordComponent={FileExtensionForm}
                newRecordInitialValues={newRecordInitialValues}
                showSingleResult={showSingleResult}
                onCreate={this.createRecord}
                onEdit={this.editRecord}
                onDelete={this.deleteRecord}
                handleCreateSuccess={this.handleUpdateRecordSuccess}
                handleEditSuccess={this.handleUpdateRecordSuccess}
              />
            </div>
            <div
              className={css.fullWidthContainer}
              ref={this.createFullWidthContainerRef}
            />
            <ConfirmationModal
              id="restore-default-file-extensions-modal"
              open={isResetFileExtensionsModalOpen}
              heading={<FormattedMessage id="ui-data-import.modal.fileExtensions.reset.header" />}
              message={<FormattedMessage id="ui-data-import.modal.fileExtensions.reset.message" />}
              confirmLabel={<FormattedMessage id="ui-data-import.modal.fileExtensions.reset.actionButton" />}
              cancelLabel={<FormattedMessage id="ui-data-import.cancel" />}
              onConfirm={this.restoreDefaultFileExtensions}
              onCancel={this.hideResetFileExtensionsToDefaultsModal}
            />
            <Callout ref={this.createCalloutRef} />
          </Fragment>
        )}
      </IntlConsumer>
    );
  }
}
