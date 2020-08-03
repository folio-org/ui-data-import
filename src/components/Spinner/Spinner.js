import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  Pane,
  PaneHeader,
} from '@folio/stripes/components';

import { Preloader } from '../Preloader';

export const Spinner = memo(({
  entity: { props: { onClose } },
  ...props
}) => {
  const header = renderProps => (
    <PaneHeader
      {...renderProps}
      dismissible
      onClose={onClose}
    />
  );

  return (
    <Pane
      defaultWidth="fill"
      fluidContentWidth
      renderHeader={header}
      {...props}
    >
      <Preloader />
    </Pane>
  );
});

Spinner.propTypes = { entity: PropTypes.object.isRequired };
