import React, {
  memo,
  useState,
  Fragment,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import {
  Tooltip,
  Button,
  Icon,
  Dropdown,
  DropdownMenu,
  MenuSection,
} from '@folio/stripes/components';

import { ENTITY_KEYS } from '../../utils/constants';

import { LinkerButton } from '.';

import css from './ProfileTree.css';

export const ProfileLinker = memo(({
  title,
  linkingRules,
  className,
  onTypeSelected,
  onLinkCallback,
}) => {
  const localTitle = title || <FormattedMessage id="ui-data-import.settings.getStarted" />;
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);

  const trigger = ({
    triggerRef,
    ariaProps,
    keyHandler,
  }) => (
    <Fragment>
      <Button
        buttonStyle="default"
        ref={triggerRef}
        aria-labelledby="linker-tooltip-text"
        aria-describedby="linker-tooltip-sub"
        onClick={() => setTypeSelectorOpen(!typeSelectorOpen)}
        onKeyDown={keyHandler}
        {...ariaProps}
      >
        <Icon
          icon="plus-sign"
          size="medium"
        />
      </Button>
      <Tooltip
        id="linker-tooltip"
        text={localTitle}
        triggerRef={triggerRef}
        placement="right-end"
      />
    </Fragment>
  );

  const menu = ({
    open,
    onToggle,
    keyHandler,
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
        id="menu-actions"
        label={<FormattedMessage id="ui-data-import.settings.action.add" />}
        labelTag="h3"
      >
        <LinkerButton
          entityKey={ENTITY_KEYS.MATCH_PROFILES}
          onTypeSelected={onTypeSelected}
          onLinkCallback={lines => {
            onLinkCallback(lines);
            setTypeSelectorOpen(false);
          }}
        />
        <LinkerButton
          entityKey={ENTITY_KEYS.ACTION_PROFILES}
          onTypeSelected={onTypeSelected}
          onLinkCallback={lines => {
            onLinkCallback(lines);
            setTypeSelectorOpen(false);
          }}
        />
      </MenuSection>
    </DropdownMenu>
  );

  return (
    <Dropdown
      id="type-selector-dropdown"
      className={classNames(css['linker-button'], className)}
      open={typeSelectorOpen}
      renderTrigger={trigger}
      renderMenu={menu}
      usePortal={false}
      relativePosition
    />
  );
});

ProfileLinker.propTypes = {
  onTypeSelected: PropTypes.func.isRequired,
  onLinkCallback: PropTypes.func.isRequired,
  linkingRules: PropTypes.object.isRequired,
  title: PropTypes.node || PropTypes.string,
  className: PropTypes.string,
};
