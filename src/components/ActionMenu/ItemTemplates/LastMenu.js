import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  PaneMenu,
  Button,
} from '@folio/stripes/components';

export const LastMenu = memo(props => {
  const {
    caption,
    location,
    style,
    dataAttributes,
  } = props;

  return (
    <PaneMenu>
      <Button
        to={location}
        style={style}
        buttonStyle="primary paneHeaderNewButton"
        marginBottom0
        {...dataAttributes}
      >
        <FormattedMessage id={caption} />
      </Button>
    </PaneMenu>
  );
});

LastMenu.propTypes = {
  caption: PropTypes.string.isRequired,
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  style: PropTypes.object,
  dataAttributes: PropTypes.object,
};

LastMenu.defaultProps = { dataAttributes: {} };
