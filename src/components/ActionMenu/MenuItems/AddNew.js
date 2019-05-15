import React, {
  memo,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Icon, Button } from '@folio/stripes/components';

import sharedCss from '../../../shared.css';
import { createLayerURL } from '../../../utils';
import { LAYER_TYPES } from '../../../utils/constants';

export const AddNew = memo(props => {
  const { menu, location } = props;

  return (
    <Button
      data-test-new-job-profile-menu-button
      to={createLayerURL(location, LAYER_TYPES.CREATE)}
      buttonStyle="dropdownItem"
      buttonClass={sharedCss.linkButton}
      onClick={menu.onToggle}
    >
      <Icon icon="plus-sign">
        <FormattedMessage id="ui-data-import.settings.jobProfiles.newJob" />
      </Icon>
    </Button>
  );
});

AddNew.propTypes = {
  menu: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
};
