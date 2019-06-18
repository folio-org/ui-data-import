import React, {
  Component,
  Fragment,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import {
  get,
  omit,
} from 'lodash';

import {
  IntlConsumer,
  stripesConnect,
} from '@folio/stripes/core';
import {
  Callout,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  makeQueryFunction,
  buildUrl,
} from '@folio/stripes/smart-components';

import { trimSearchTerm } from '../../utils';
import { ENTITY_KEYS } from '../../utils/constants';
import {
  ActionMenu,
  listTemplate,
  SearchAndSort,
  FileExtensionForm,
} from '../../components';
import { ViewFileExtension } from './ViewFileExtension';
import {
  createDeleteCallout,
  createUpdateRecordErrorMessage,
  SettingPage,
} from '../SettingPage';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;
const finishedResourceName = 'fileExtensions';

const mapStateToProps = state => {
  const {
    hasLoaded = false,
    records: [record = {}] = [],
  } = get(state, 'folio_data_import_file_extension', {});
  const selectedFileExtension = {
    hasLoaded,
    record: omit(record, 'metadata', 'userInfo'),
  };

  return { selectedFileExtension };
};

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
      fileExtensions: PropTypes.shape({
        POST: PropTypes.func.isRequired,
        PUT: PropTypes.func.isRequired,
        DELETE: PropTypes.func.isRequired,
      }).isRequired,
      restoreDefaultFileExtensions: PropTypes.shape({ POST: PropTypes.func.isRequired }).isRequired,
    }).isRequired,
    resources: PropTypes.object.isRequired,
    label: PropTypes.node.isRequired,
    location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
    history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
    match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
    selectedFileExtension: PropTypes.object.isRequired,
    showSingleResult: PropTypes.bool,
  };

  static defaultProps = { showSingleResult: true };

  state = {
    isResetFileExtensionsModalOpen: false,
    areFileExtensionsResetting: false,
  };

  calloutRef = createRef();

  fullWidthContainerRef = createRef();

  entityKey = ENTITY_KEYS.JOB_PROFILES;

  actionMenuItems = [
    'restoreDefault',
  ];

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

 defaultNewRecordInitialValues = {
   importBlocked: false,
   description: '',
   extension: '',
   dataTypes: [],
 };

  transitionToParams = params => {
    const {
      location,
      history,
    } = this.props;

    const url = buildUrl(location, params);

    history.push(url);
  };

  renderActionMenu = menu => (
    <ActionMenu
      entity={this}
      menu={menu}
    />
  );

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

      const message = (
        <FormattedMessage
          id="ui-data-import.settings.fileExtension.reset.error.network"
          values={{ description: <FormattedMessage id="ui-data-import.communicationProblem" /> }}
        />
      );

      this.calloutRef.current.sendCallout({
        type: 'error',
        message,
      });
    }
  };

  getDeleteRecordSuccessfulMessage(record) {
    return (
      <FormattedMessage
        id="ui-data-import.settings.fileExtension.action.success"
        values={{
          extension: record.extension,
          action: (
            <FormattedMessage
              id="ui-data-import.deleted"
              tagName="strong"
            />
          ),
        }}
      />
    );
  }

  getDeleteRecordErrorMessage(record) {
    return (
      <FormattedMessage
        id="ui-data-import.settings.fileExtension.action.error"
        values={{
          extension: record.extension,
          action: (
            <FormattedMessage
              id="ui-data-import.deleted"
              tagName="strong"
            />
          ),
        }}
      />
    );
  }

  getRecordName(record) {
    return record.extension;
  }

  onUpdateRecordError = createUpdateRecordErrorMessage({
    getRecordName: this.getRecordName,
    calloutRef: this.calloutRef,
  });

  onDeleteSuccess = createDeleteCallout({
    getMessage: this.getDeleteRecordSuccessfulMessage,
    calloutRef: this.calloutRef,
  });

  onDeleteError = createDeleteCallout({
    getMessage: this.getDeleteRecordErrorMessage,
    calloutRef: this.calloutRef,
    type: 'error',
  });

  render() {
    const {
      resources,
      location,
      history,
      match,
      mutator,
      label,
      showSingleResult,
      selectedFileExtension,
    } = this.props;
    const { isResetFileExtensionsModalOpen } = this.state;

    const urlQuery = queryString.parse(location.search);
    const searchTerm = trimSearchTerm(urlQuery.query);

    return (
      <IntlConsumer>
        {intl => (
          <Fragment>
            <SettingPage
              finishedResourceName={finishedResourceName}
              mutator={mutator}
              location={location}
              history={history}
              match={match}
              onUpdateRecordError={this.onUpdateRecordError}
              onDeleteSuccess={this.onDeleteSuccess}
              onDeleteError={this.onDeleteError}
            >
              {props => (
                <SearchAndSort
                  objectName="file-extensions"
                  finishedResourceName={finishedResourceName}
                  parentResources={resources}
                  parentMutator={mutator}
                  initialResultCount={INITIAL_RESULT_COUNT}
                  resultCountIncrement={RESULT_COUNT_INCREMENT}
                  searchLabelKey="ui-data-import.settings.fileExtensions.title"
                  resultCountMessageKey="ui-data-import.settings.fileExtensions.count"
                  resultsLabel={label}
                  defaultSort="extension"
                  actionMenu={this.renderActionMenu}
                  resultsFormatter={listTemplate({
                    intl,
                    searchTerm,
                  })}
                  visibleColumns={this.visibleColumns}
                  columnMapping={{
                    extension: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension.extension' }),
                    importBlocked: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension.blockImport' }),
                    dataTypes: intl.formatMessage({ id: 'ui-data-import.settings.fileExtension.dataTypes' }),
                    updated: intl.formatMessage({ id: 'ui-data-import.updated' }),
                    updatedBy: intl.formatMessage({ id: 'ui-data-import.updatedBy' }),
                  }}
                  columnWidths={this.columnWidths}
                  ViewRecordComponent={ViewFileExtension}
                  EditRecordComponent={FileExtensionForm}
                  newRecordInitialValues={this.defaultNewRecordInitialValues}
                  editRecordInitialValues={selectedFileExtension.record}
                  editRecordInitialValuesAreLoaded={selectedFileExtension.hasLoaded}
                  showSingleResult={showSingleResult}
                  {...props}
                />
              )}
            </SettingPage>
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
            <Callout ref={this.calloutRef} />
          </Fragment>
        )}
      </IntlConsumer>
    );
  }
}
