import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Pane } from '@folio/stripes/components';

// TODO: view component will be developed in UIDATIMP-56
class ViewFileExtension extends Component {
  static manifest = Object.freeze({});

  static propTypes = { onClose: PropTypes.func.isRequired };

  render() {
    const { onClose } = this.props;

    return (
      <Pane
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

export default ViewFileExtension;
