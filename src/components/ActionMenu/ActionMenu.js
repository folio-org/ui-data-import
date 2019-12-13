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
    <React.Fragment>
      {Array.isArray(items) && items.map((item, i) => templates[item](`list-menu-item-${i}`))}
    </React.Fragment>
  );
});

ActionMenu.propTypes = {
  entity: PropTypes.shape({ props: PropTypes.shape({ actionMenuItems: PropTypes.arrayOf(PropTypes.string).isRequired }) }).isRequired,
  menu: PropTypes.object.isRequired,
};
