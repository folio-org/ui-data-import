import React, {
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import classNames from 'classnames';

import { Pluggable } from '@folio/stripes/core';
import {
  Button,
  Dropdown,
} from '@folio/stripes/components';

import {
  LinkerMenu,
  LinkerTrigger,
} from '.';

import {
  PROFILE_RELATION_TYPES,
  ENTITY_KEYS,
  FILTER_QUERY_PARAMS,
  okapiShape,
} from '../../../utils';

import css from '../ProfileTree.css';

export const ProfileLinker = ({
  id,
  parentId,
  masterWrapperId,
  parentType,
  profileType,
  onLink,
  linkingRules: { profilesAllowed },
  dataKey,
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

  const manifestParams = {
    manifest: {
      query: parentType === ENTITY_KEYS.JOB_PROFILES
        ? FILTER_QUERY_PARAMS.NOT_STATIC_VALUE
        : FILTER_QUERY_PARAMS.DEFAULT,
    },
  };

  const addNewLines = entityKey => async records => {
    onLink({
      initialData,
      setInitialData,
      lines: records,
      masterId: parentId,
      masterWrapperId,
      masterType: parentType,
      detailType: entityKey,
      reactTo,
      localDataKey: dataKey,
    });
  };

  return (
    <>
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
            profileType={profileType}
            disabled={false} // @TODO: Change this to actual value from LinkingRules object
            isSingleSelect
            isMultiLink
            onLink={addNewLines(entityKey)}
            renderTrigger={triggerProps => renderPluginButton(triggerProps, entityKey)}
            filterParams={manifestParams}
          >
            <span data-test-no-plugin-available>
              <FormattedMessage id="ui-data-import.find-import-profile-plugin-unavailable" />
            </span>
          </Pluggable>
        ))}
      </div>
    </>
  );
};

ProfileLinker.propTypes = {
  id: PropTypes.string.isRequired,
  parentType: PropTypes.string.isRequired,
  profileType: PropTypes.string.isRequired,
  onLink: PropTypes.func.isRequired,
  linkingRules: PropTypes.object.isRequired,
  dataKey: PropTypes.string.isRequired,
  initialData: PropTypes.arrayOf(PropTypes.object).isRequired,
  setInitialData: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  rootId: PropTypes.string,
  parentId: PropTypes.string,
  masterWrapperId: PropTypes.string,
  reactTo: PropTypes.oneOf(Object.values(PROFILE_RELATION_TYPES)),
  title: PropTypes.node || PropTypes.string,
  className: PropTypes.string,
};

ProfileLinker.defaultProps = {
  rootId: null,
  parentId: null,
  masterWrapperId: null,
  title: '',
  className: '',
  reactTo: PROFILE_RELATION_TYPES.NONE,
};
