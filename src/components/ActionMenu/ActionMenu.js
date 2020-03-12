import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { menuTemplate } from './menuTemplate';

export const ActionMenu = memo(({
  entity,
  entity: { props: { actionMenuItems: items } },
  menu,
}) => {
  const templates = menuTemplate(entity, menu);

  return (
    <>
      {Array.isArray(items) && items.map((item, i) => templates[item](`list-menu-item-${i}`))}
    </>
  );
});

ActionMenu.propTypes = {
  entity: PropTypes.shape({ props: PropTypes.shape({ actionMenuItems: PropTypes.arrayOf(PropTypes.string).isRequired }) }).isRequired,
  menu: PropTypes.object.isRequired,
};
