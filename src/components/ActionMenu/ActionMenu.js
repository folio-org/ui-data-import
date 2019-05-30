import React, {
  memo,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';

import { menuTemplate } from './menuTemplate';

export const ActionMenu = memo(props => {
  const {
    entity,
    menu,
  } = props;
  const { actionMenuItems: items } = entity;

  const templates = menuTemplate(entity, menu);

  return (
    <Fragment>
      {Array.isArray(items) && items.map((item, i) => templates[item](`list-menu-item-${i}`))}
    </Fragment>
  );
});

ActionMenu.propTypes = {
  entity: PropTypes.object.isRequired,
  menu: PropTypes.object.isRequired,
};
