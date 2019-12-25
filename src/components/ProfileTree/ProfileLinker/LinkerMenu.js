import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { noop } from 'lodash';

import {
  DropdownMenu,
  MenuSection,
} from '@folio/stripes-components';

import { ENTITY_KEYS } from '../../../utils/constants';
import { LinkerButton } from '.';

export const LinkerMenu = ({
  id,
  open,
  keyHandler,
  onToggle,
  onTypeSelected,
  onLink,
  onClose,
}) => (
  <DropdownMenu
    role="menu"
    placement="bottom-end"
    aria-label="Available Profile types"
    open={open}
    onToggle={onToggle}
    onKeyDown={keyHandler}
  >
    <MenuSection
      id={`menu-actions-${id}`}
      label={<FormattedMessage id="ui-data-import.settings.action.add" />}
      labelTag="h3"
    >
      <LinkerButton
        id={`menu-link-match-${id}`}
        entityKey={ENTITY_KEYS.MATCH_PROFILES}
        onTypeSelected={onTypeSelected}
        onLink={onLink}
        onClose={onClose}
      />
      <LinkerButton
        id={`menu-link-action-${id}`}
        entityKey={ENTITY_KEYS.ACTION_PROFILES}
        onTypeSelected={onTypeSelected}
        onLink={onLink}
        onClose={onClose}
      />
    </MenuSection>
  </DropdownMenu>
);

LinkerMenu.propTypes = {
  id: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  keyHandler: PropTypes.func,
  onToggle: PropTypes.func,
  onTypeSelected: PropTypes.func,
  onLink: PropTypes.func,
  onClose: PropTypes.func,
};

LinkerMenu.defaultProps = {
  onToggle: noop,
  keyHandler: noop,
  onTypeSelected: noop,
  onLink: noop,
  onClose: noop,
};
