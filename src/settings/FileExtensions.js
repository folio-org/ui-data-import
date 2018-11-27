import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Pane } from '@folio/stripes/components';

export default class FileExtensions extends Component {
  static propTypes = {
    label: PropTypes.node.isRequired,
  };

  render() {
    const { label } = this.props;

    return (
      <Pane
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={label}
      >
        <div>
          <FormattedMessage id="ui-data-import.settings.fileExtensions" />
        </div>
      </Pane>
    );
  }
}
