import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { noop } from 'lodash';

import {
  DropdownMenu,
  MenuSection,
} from '@folio/stripes/components';

import { LinkerButton } from '.';

export const LinkerMenu = ({
  id,
  open,
  entityKeys: [matchProfiles, actionProfiles],
  onToggle,
  onClick,
  keyHandler,
}) => {
  return (
    <DropdownMenu
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
        <div role="menu">
          <LinkerButton
            id={`menu-link-match-${id}`}
            entityKey={matchProfiles}
            onClick={onClick}
          />
          <LinkerButton
            id={`menu-link-action-${id}`}
            entityKey={actionProfiles}
            onClick={onClick}
          />
        </div>
      </MenuSection>
    </DropdownMenu>
  );
};

LinkerMenu.propTypes = {
  id: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  entityKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  onToggle: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  keyHandler: PropTypes.func,
};

LinkerMenu.defaultProps = { keyHandler: noop };
