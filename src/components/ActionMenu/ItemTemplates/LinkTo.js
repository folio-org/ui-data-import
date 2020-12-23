import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Icon,
  Button,
} from '@folio/stripes/components';

import sharedCss from '../../../shared.css';

export const LinkTo = memo(({
  caption,
  icon,
  menu,
  location,
  dataAttributes = {},
  isDisabled,
}) => (
  <Button
    to={location}
    buttonStyle="dropdownItem"
    buttonClass={sharedCss.linkButton}
    disabled={isDisabled}
    onClick={menu.onToggle}
    {...dataAttributes}
  >
    <Icon icon={icon}>
      <FormattedMessage id={caption} />
    </Icon>
  </Button>
));

LinkTo.propTypes = {
  caption: PropTypes.string.isRequired,
  icon: PropTypes.string,
  menu: PropTypes.object.isRequired,
  location: PropTypes.oneOfType([
    PropTypes.shape({
      search: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    PropTypes.string.isRequired,
  ]),
  dataAttributes: PropTypes.object,
  isDisabled: PropTypes.bool,
};
