import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Pane } from '@folio/stripes/components';

export class ViewActionProfile extends Component {
  static propTypes = { onClose: PropTypes.func.isRequired };

  render() {
    const { onClose } = this.props;

    return (
      <Pane
        id="pane-action-profile-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle="Content title"
        dismissible
        onClose={onClose}
      >
        <div>Content</div>
      </Pane>
    );
  }
}
