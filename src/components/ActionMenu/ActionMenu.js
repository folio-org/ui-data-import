import React, {
  memo,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';

import * as Actions from './MenuItems';

export const ActionMenu = memo(props => {
  const { config: { items } } = props;

  return (
    <Fragment>
      {items && items.length && items.map((cfg, i) => {
        const Control = Actions[cfg.control];

        return (
          <Control
            key={`menu-item-${i}`}
            {...cfg}
          />
        );
      })}
    </Fragment>
  );
});

ActionMenu.propTypes = {
  config: PropTypes.shape({}).isRequired,
};
