import React, {
  Component,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Headline,
  Row,
  Col,
  KeyValue,
  Icon,
  Button,
  PaneMenu,
} from '@folio/stripes/components';
import {
  TitleManager,
  stripesShape,
} from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';

import { Preloader } from '../../components/Preloader';
import { EndOfItem } from '../../components/EndOfItem';

import css from './FileExtensions.css';

export class ViewFileExtension extends Component {
  static manifest = Object.freeze({
    fileExtension: {
      type: 'okapi',
      path: 'data-import/fileExtensions/:{id}',
      throwErrors: false,
    },
  });

  static propTypes = {
    stripes: stripesShape.isRequired,
    resources: PropTypes.shape({
      fileExtension: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(
          PropTypes.shape({
            extension: PropTypes.string.isRequired,
            description: PropTypes.string.isRequired,
            importBlocked: PropTypes.bool.isRequired,
            dataTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
            metadata: PropTypes.object.isRequired,
          }),
        ),
      }),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    onClose: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { stripes } = this.props;

    this.connectedViewMetaData = stripes.connect(ViewMetaData);
  }

  renderSpinner() {
    const { onClose } = this.props;

    return (
      <Pane
        id="pane-file-extension-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle=""
        dismissible
        onClose={onClose}
      >
        <Preloader />
      </Pane>
    );
  }

  get fileExtensionData() {
    const {
      resources,
      match: { params },
    } = this.props;

    const fileExtension = resources.fileExtension || {};
    const records = fileExtension.records || [];

    return {
      hasLoaded: fileExtension.hasLoaded,
      record: records.find(record => record.id === params.id),
    };
  }

  addEditMenu() {
    return (
      <PaneMenu>
        <Button
          id="clickable-new"
          href="#"
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          <FormattedMessage id="ui-data-import.edit" />
        </Button>
      </PaneMenu>
    );
  }

  render() {
    const { onClose } = this.props;

    const {
      hasLoaded,
      record,
    } = this.fileExtensionData;

    if (!record) {
      return this.renderSpinner();
    }

    const paneTitle = (
      <Fragment>
        {record.extension}
        <Icon
          size="small"
          icon="caret-down"
        />
      </Fragment>
    );

    return (
      <Pane
        id="pane-file-extension-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={paneTitle}
        paneSub={<FormattedMessage id="ui-data-import.settings.fileExtension.title" />}
        lastMenu={this.addEditMenu()}
        dismissible
        onClose={onClose}
      >
        {hasLoaded && (
          <Fragment>
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
                <this.connectedViewMetaData metadata={record.metadata} />
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <KeyValue label={<FormattedMessage id="ui-data-import.description" />}>
                  <div data-test-description>{record.description || '-'}</div>
                </KeyValue>
              </Col>
            </Row>

            {record.importBlocked && (
              <section>
                <Row>
                  <Col xs={4}>
                    <KeyValue label={<FormattedMessage id="ui-data-import.settings.fileExtension.title" />}>
                      <div data-test-extension>{record.extension}</div>
                    </KeyValue>
                  </Col>
                  <Col xs={4}>
                    <label htmlFor="import-blocked">
                      <input
                        id="import-blocked"
                        className={css.checkbox}
                        data-test-import-blocked
                        type="checkbox"
                        checked
                        disabled
                      />
                      &nbsp;<FormattedMessage id="ui-data-import.settings.fileExtension.blockImport" />
                    </label>
                  </Col>
                </Row>
              </section>
            )}
            {!record.importBlocked && (
              <section>
                <Row>
                  <Col xs={4}>
                    <KeyValue label={<FormattedMessage id="ui-data-import.settings.fileExtension.title" />}>
                      <div data-test-extension>{record.extension}</div>
                    </KeyValue>
                  </Col>
                  <Col xs={4}>
                    <KeyValue label={<FormattedMessage id="ui-data-import.settings.fileExtension.dataTypes" />}>
                      <div data-test-data-types>
                        {record.dataTypes.map((type, i) => <span key={i}>
                          {i > 0 && ', '}
                          {type}
                          {/* eslint-disable-next-line */}
                        </span>)}
                      </div>
                    </KeyValue>
                  </Col>
                </Row>
              </section>
            )}
            <EndOfItem
              className={css.endOfRecord}
              title={<FormattedMessage id="ui-data-import.endOfRecord" />}
            />
          </Fragment>
        )}
      </Pane>
    );
  }
}
