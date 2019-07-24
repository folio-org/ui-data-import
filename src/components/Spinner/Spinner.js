import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Pane } from '@folio/stripes/components';

import { Preloader } from '../Preloader';

export const Spinner = memo(({
  entity,
  entity: {
    props: {
      onClose,
      paneId,
    },
  },
}) => (
  <Pane
    id={paneId}
    defaultWidth="fill"
    fluidContentWidth
    paneTitle=""
    dismissible
    lastMenu={entity.renderLastMenu()}
    onClose={onClose}
  >
    <Preloader />
  </Pane>
));

Spinner.propTypes = { entity: PropTypes.object.isRequired };
