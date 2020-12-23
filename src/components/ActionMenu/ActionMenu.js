import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { menuTemplate } from './menuTemplate';
import { OCLC_DEFAULT_PROFILE_IDS } from '../../utils';

export const ActionMenu = memo(({
  entity,
  entity: { props: { actionMenuItems: items } },
  menu,
  recordId,
}) => {
  const isDefaultProfile = OCLC_DEFAULT_PROFILE_IDS.includes(recordId);

  const templates = menuTemplate(entity, menu, isDefaultProfile);

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
};

ActionMenu.defaultProps = { recordId: '' };
