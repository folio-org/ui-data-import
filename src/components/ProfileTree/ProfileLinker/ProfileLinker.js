import React, {
  Fragment,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import { Pluggable } from '@folio/stripes-core';
import {
  Button,
  Dropdown,
} from '@folio/stripes/components';

import {
  LinkerMenu,
  LinkerTrigger,
} from '.';

import css from '../ProfileTree.css';

export const ProfileLinker = ({
  id,
  parentId,
  parentType,
  onLink,
  linkingRules: { profilesAllowed },
  initialData,
  setInitialData,
  reactTo,
  title,
  className,
}) => {
  const [typeSelectorOpen, setTypeSelectorOpen] = useState(false);
  const buttonRefs = {
    matchProfiles: useRef(null),
    actionProfiles: useRef(null),
  };

  const handleMenuClick = entityKey => buttonRefs[entityKey].current.click();

  const trigger = triggerProps => (
    <LinkerTrigger
      id={`type-selector-trigger-${id}`}
      title={title}
      onClick={() => setTypeSelectorOpen(!typeSelectorOpen)}
      {...triggerProps}
    />
  );

  const menu = menuProps => (
    <LinkerMenu
      id={`type-selector-menu-${id}`}
      entityKeys={profilesAllowed}
      onClick={handleMenuClick}
      {...menuProps}
    />
  );

  const renderPluginButton = (triggerProps, entityKey) => {
    buttonRefs[entityKey] = triggerProps.buttonRef;

    return (
      <Button
        buttonRef={buttonRefs[entityKey]}
        onClick={triggerProps.onClick}
      />
    );
  };

  return (
    <Fragment>
      <div data-test-plus-sign-button>
        <Dropdown
          id={`type-selector-dropdown-${id}`}
          className={classNames(css['linker-button'], className)}
          open={typeSelectorOpen}
          onToggle={() => setTypeSelectorOpen(!typeSelectorOpen)}
          renderTrigger={trigger}
          renderMenu={menu}
          usePortal={false}
          relativePosition
        />
      </div>
      <div style={{ display: 'none' }}>
        {profilesAllowed.map((entityKey, i) => (
          <Pluggable
            key={i}
            type="find-import-profile"
            id={`${id}-clickable-find-import-profile`}
            entityKey={entityKey}
            dataKey={entityKey}
            parentType={parentType}
            disabled={false} // @TODO: Change this to actual value from LinkingRules object
            isSingleSelect
            isMultiLink
            onLink={records => onLink(initialData, setInitialData, records, parentId, parentType, entityKey, reactTo)}
            renderTrigger={triggerProps => renderPluginButton(triggerProps, entityKey)}
          >
            <span data-test-no-plugin-available>
              <FormattedMessage id="ui-data-import.find-import-profile-plugin-unavailable" />
            </span>
          </Pluggable>
        ))}
      </div>
    </Fragment>
  );
};

ProfileLinker.propTypes = {
  id: PropTypes.string.isRequired,
  parentId: PropTypes.string.isRequired,
  parentType: PropTypes.string.isRequired,
  onLink: PropTypes.func.isRequired,
  linkingRules: PropTypes.object.isRequired,
  initialData: PropTypes.arrayOf(PropTypes.object).isRequired,
  setInitialData: PropTypes.func.isRequired,
  reactTo: PropTypes.string,
  title: PropTypes.node || PropTypes.string,
  className: PropTypes.string,
};

ProfileLinker.defaultProps = {
  title: '',
  className: '',
  reactTo: null,
};
