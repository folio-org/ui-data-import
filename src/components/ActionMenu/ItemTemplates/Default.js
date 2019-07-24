import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Icon,
  Button,
} from '@folio/stripes/components';

export const Default = memo(({
  caption,
  icon,
  onClick,
  dataAttributes,
}) => (
  <Button
    buttonStyle="dropdownItem"
    onClick={onClick}
    {...dataAttributes}
  >
    <Icon icon={icon}>
      <FormattedMessage id={caption} />
    </Icon>
  </Button>
));

Default.propTypes = {
  caption: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  dataAttributes: PropTypes.object,
};
