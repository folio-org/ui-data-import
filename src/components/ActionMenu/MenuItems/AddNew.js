import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Icon,
  Button,
} from '@folio/stripes/components';

import { createLayerURL } from '../../../utils';
import { LAYER_TYPES } from '../../../utils/constants';

import sharedCss from '../../../shared.css';

export const AddNew = memo(props => {
  const {
    caption,
    menu,
    location,
  } = props;

  return (
    <Button
      data-test-new-item-menu-button
      to={createLayerURL(location, LAYER_TYPES.CREATE)}
      buttonStyle="dropdownItem"
      buttonClass={sharedCss.linkButton}
      onClick={menu.onToggle}
    >
      <Icon icon="plus-sign">
        <FormattedMessage id={caption} />
      </Icon>
    </Button>
  );
});

AddNew.propTypes = {
  caption: PropTypes.string.isRequired,
  menu: PropTypes.object.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};
