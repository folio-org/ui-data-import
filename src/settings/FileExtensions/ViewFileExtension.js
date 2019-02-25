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
import { TitleManager } from '@folio/stripes/core';

import { Preloader } from '../../components/Preloader';
import { EndOfRecord } from '../../components/EndOfRecord';
import { ViewMetaData } from '@folio/stripes/smart-components';

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

    this.cViewMetaData = props.stripes.connect(ViewMetaData);
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
        <Preloader/>
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
          id="clickable-new-12"
          href="#"
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          <Icon icon="edit"/>&nbsp;
          <FormattedMessage id="ui-data-import.settings.fileExtension.edit"/>
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
    return (
      <Pane
        id="pane-file-extension-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={<Fragment>{record.extension} <Icon size="small" icon="caret-down"/></Fragment>}
        paneSub={<FormattedMessage id="ui-data-import.settings.fileExtension.title"/>}
        dismissible
        onClose={onClose}
        lastMenu={this.addEditMenu()}
      >
        {hasLoaded && (
          <Fragment>
            <TitleManager record={record.extension}/>
            <Headline
              size="xx-large"
              tag="h2"
            >
              {record.extension}
            </Headline>

            {record.metadata &&
            <Row>
              <Col xs={12}>
                <this.cViewMetaData metadata={record.metadata}/>
              </Col>
            </Row>
            }

            <Row>
              <Col xs={12}>
                <KeyValue
                  label={<FormattedMessage id="ui-data-import.settings.fileExtension.description"/>}
                  value={record.description || '-'}
                />
              </Col>
            </Row>

            {record.importBlocked && <section>
              <Row>
                <Col xs={12}>
                  <label>
                    <input type="checkbox" checked disabled/>
                    &nbsp;<FormattedMessage id="ui-data-import.settings.fileExtension.blockImport"/>
                  </label>
                </Col>
              </Row>
            </section>
            }
            {!record.importBlocked && <section>
              <Row>
                <Col xs={4}>
                  <KeyValue
                    label={<FormattedMessage id="ui-data-import.settings.fileExtension.title"/>}
                    value={record.extension}
                  />
                </Col>
                <Col xs={4}>
                  <KeyValue
                    label={<FormattedMessage id="ui-data-import.settings.fileExtension.dataTypes"/>}
                    value={record.dataTypes}
                  />
                </Col>
              </Row>
            </section>
            }
            <EndOfRecord/>
          </Fragment>
        )}
      </Pane>
    );
  }
}
