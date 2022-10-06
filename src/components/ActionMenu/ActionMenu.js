import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { menuTemplate } from './menuTemplate';
import {
  DEFAULT_PROFILE_IDS,
  PROFILE_IDS_WITH_DISABLED_DUPLICATE_BUTTON,
} from '../../utils';

export const ActionMenu = memo(({
  entity,
  entity: { props: { actionMenuItems: items } },
  menu,
  baseUrl,
  recordId,
}) => {
  const isDefaultProfile = DEFAULT_PROFILE_IDS.includes(recordId);
  const isDuplicateButtonDisabled = PROFILE_IDS_WITH_DISABLED_DUPLICATE_BUTTON.includes(recordId);

  const templates = menuTemplate({
    entity,
    menu,
    baseUrl,
    isDefaultProfile,
    isDuplicateButtonDisabled,
  });

  return (
    <>
      {Array.isArray(items) && items.map((item, i) => templates[item](`list-menu-item-${i}`))}
    </>
  );
});

ActionMenu.propTypes = {
  entity: PropTypes.shape({ props: PropTypes.shape({ actionMenuItems: PropTypes.arrayOf(PropTypes.string).isRequired }) }).isRequired,
  menu: PropTypes.object.isRequired,
  recordId: PropTypes.string,
  baseUrl: PropTypes.string,
};

ActionMenu.defaultProps = { recordId: '' };
