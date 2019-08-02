import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  TitleManager,
  stripesConnect,
} from '@folio/stripes/core';
import {
  Pane,
  Headline,
  Row,
  Col,
  KeyValue,
  ConfirmationModal,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import {
  LAYER_TYPES,
  ENTITY_KEYS,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
} from '../../utils/constants';
import { createLayerURL } from '../../utils';
import {
  ActionMenu,
  EndOfItem,
  Spinner,
} from '../../components';
import { LastMenu } from '../../components/ActionMenu/ItemTemplates/LastMenu';

import sharedCss from '../../shared.css';

@stripesConnect
export class ViewFileExtension extends Component {
  static manifest = Object.freeze({
    fileExtension: {
      type: 'okapi',
      path: 'data-import/fileExtensions/:{id}',
      throwErrors: false,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      fileExtension: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(
          PropTypes.shape({
            extension: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            importBlocked: PropTypes.bool.isRequired,
            dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
            metadata: PropTypes.shape({
              createdByUserId: PropTypes.string.isRequired,
              updatedByUserId: PropTypes.string.isRequired,
            }).isRequired,
          }),
        ),
      }),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({ // eslint-disable-line object-curly-newline
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    paneId: PropTypes.string, // eslint-disable-line
    ENTITY_KEY: PropTypes.string, // eslint-disable-line
    actionMenuItems: PropTypes.arrayOf(PropTypes.string), // eslint-disable-line
  };

  static defaultProps = {
    paneId: 'pane-file-extension-details',
    ENTITY_KEY: ENTITY_KEYS.FILE_EXTENSIONS,
    actionMenuItems: [
      'edit',
      'delete',
    ],
  };

  state = {
    showDeleteConfirmation: false,
    deletingInProgress: false,
  };

  get fileExtensionData() {
    const { resources } = this.props;

    const fileExtension = resources.fileExtension || {};
    const [record] = fileExtension.records || [];

    return {
      hasLoaded: fileExtension.hasLoaded,
      record,
    };
  }

  showDeleteConfirmation = () => {
    this.setState({ showDeleteConfirmation: true });
  };

  hideDeleteConfirmation = () => {
    this.setState({
      showDeleteConfirmation: false,
      deletingInProgress: false,
    });
  };

  handleDeleteExtension = record => {
    const { onDelete } = this.props;
    const { deletingInProgress } = this.state;

    if (deletingInProgress) {
      return;
    }

    this.setState({ deletingInProgress: true }, async () => {
      await onDelete(record);
      this.hideDeleteConfirmation();
    });
  };

  renderActionMenu = menu => (
    <ActionMenu
      entity={this}
      menu={menu}
    />
  );

  renderLastMenu = record => (
    <LastMenu
      caption="ui-data-import.edit"
      location={createLayerURL(this.props.location, LAYER_TYPES.EDIT)}
      style={{ visibility: !record ? 'hidden' : 'visible' }}
      dataAttributes={{ 'data-test-edit-item-button': '' }}
    />
  );

  renderFileExtension(record) {
    const { onClose } = this.props;
    const { showDeleteConfirmation } = this.state;

    return (
      <Pane
        id="pane-file-extension-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={record.extension}
        paneSub={<FormattedMessage id="ui-data-import.settings.fileExtension.title" />}
        actionMenu={this.renderActionMenu}
        lastMenu={this.renderLastMenu(record)}
        dismissible
        onClose={onClose}
      >
        <TitleManager record={record.extension} />
        <Headline
          data-test-headline
          size="xx-large"
          tag="h2"
        >
          {record.extension}
        </Headline>
        <Row>
          <Col xs={12}>
            <ViewMetaData
              metadata={record.metadata}
              systemId={SYSTEM_USER_ID}
              systemUser={SYSTEM_USER_NAME}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue label={<FormattedMessage id="ui-data-import.description" />}>
              <div data-test-description>{record.description || '-'}</div>
            </KeyValue>
          </Col>
        </Row>

        <Row>
          <Col xs={4}>
            <KeyValue label={<FormattedMessage id="ui-data-import.settings.fileExtension.title" />}>
              <div data-test-extension>{record.extension}</div>
            </KeyValue>
          </Col>
          {record.importBlocked && (
            <Col xs={4}>
              <label htmlFor="import-blocked">
                <input
                  id="import-blocked"
                  className={sharedCss.checkbox}
                  data-test-import-blocked
                  type="checkbox"
                  checked
                  disabled
                />
                &nbsp;<FormattedMessage id="ui-data-import.settings.fileExtension.blockImport" />
              </label>
            </Col>
          )}
          {!record.importBlocked && (
            <Col xs={4}>
              <KeyValue label={<FormattedMessage id="ui-data-import.settings.fileExtension.dataTypes" />}>
                <div data-test-data-types>{record.dataTypes.join(', ')}</div>
              </KeyValue>
            </Col>
          )}
        </Row>
        <EndOfItem
          className={sharedCss.endOfRecord}
          title={<FormattedMessage id="ui-data-import.endOfRecord" />}
        />
        <ConfirmationModal
          id="delete-file-extension-modal"
          open={showDeleteConfirmation}
          heading={(
            <FormattedMessage
              id="ui-data-import.modal.fileExtension.delete.header"
              values={{ extension: record.extension }}
            />
          )}
          message={<FormattedMessage id="ui-data-import.modal.fileExtension.delete.message" />}
          confirmLabel={<FormattedMessage id="ui-data-import.delete" />}
          cancelLabel={<FormattedMessage id="ui-data-import.cancel" />}
          onConfirm={() => this.handleDeleteExtension(record)}
          onCancel={this.hideDeleteConfirmation}
        />
      </Pane>
    );
  }

  render() {
    const {
      hasLoaded,
      record,
    } = this.fileExtensionData;

    if (!record || !hasLoaded) {
      return <Spinner entity={this} />;
    }

    return this.renderFileExtension(record);
  }
}
