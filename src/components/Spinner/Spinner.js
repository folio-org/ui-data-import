import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  PaneHeader,
} from '@folio/stripes/components';
import { Preloader } from '@folio/stripes-data-transfer-components';

import sharedCss from '../../shared.css';

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
      <Preloader
        message={<FormattedMessage id="ui-data-import.loading" />}
        size="medium"
        preloaderClassName={sharedCss.preloader}
      />
    </Pane>
  );
});

Spinner.propTypes = { entity: PropTypes.object.isRequired };
