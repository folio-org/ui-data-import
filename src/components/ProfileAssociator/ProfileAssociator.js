import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { noop } from 'lodash';

import { IntlConsumer } from '@folio/stripes/core';

import { stringToWords } from '../../utils';
import { ENTITY_KEYS } from '../../utils/constants';

import { actionProfilesShape } from '../../settings/ActionProfiles';
import { jobProfilesShape } from '../../settings/JobProfiles';
import { mappingProfilesShape } from '../../settings/MappingProfiles';
import { matchProfilesShape } from '../../settings/MatchProfiles';

import { AssociatorStatic } from './AssociatorStatic';
import { AssociatorEditable } from './AssociatorEditable';

export const ProfileAssociator = memo(({
  entityKey,
  namespaceKey,
  parentId,
  parentType,
  masterType,
  detailType,
  profileName,
  isMultiSelect,
  isMultiLink,
  contentData,
  hasLoaded,
  record,
  useSearch,
  relationsToAdd,
  relationsToDelete,
  onLink,
  onUnlink,
  dataAttributes,
}) => {
  const profiles = {
    [ENTITY_KEYS.JOB_PROFILES]: jobProfilesShape,
    [ENTITY_KEYS.MATCH_PROFILES]: matchProfilesShape,
    [ENTITY_KEYS.ACTION_PROFILES]: actionProfilesShape,
    [ENTITY_KEYS.MAPPING_PROFILES]: mappingProfilesShape,
  };
  const profileShape = profiles[entityKey];

  const contentType = stringToWords(entityKey).map(word => word.toLocaleUpperCase()).join('_').slice(0, -1);

  const getProfiles = () => {
    const data = contentData.filter(item => item.contentType === contentType);

    return data.length ? data.map(({ content }) => content) : data;
  };

  return (
    <IntlConsumer>
      {intl => (
        <>
          {record ? (
            <AssociatorStatic
              intl={intl}
              entityKey={entityKey}
              namespaceKey={namespaceKey}
              profileShape={profileShape}
              record={record}
              contentData={getProfiles()}
              hasLoaded={hasLoaded}
              dataAttributes={dataAttributes}
              isMultiSelect={isMultiSelect}
              useSearch={useSearch}
            />
          ) : (
            <AssociatorEditable
              intl={intl}
              entityKey={entityKey}
              namespaceKey={namespaceKey}
              isMultiSelect={isMultiSelect}
              isMultiLink={isMultiLink}
              profileShape={profileShape}
              contentData={getProfiles()}
              hasLoaded={hasLoaded}
              parentId={parentId}
              parentType={parentType}
              masterType={masterType}
              detailType={detailType}
              profileName={profileName}
              relationsToAdd={relationsToAdd}
              relationsToDelete={relationsToDelete}
              onLink={onLink}
              onUnlink={onUnlink}
              dataAttributes={dataAttributes}
            />
          )}
        </>
      )}
    </IntlConsumer>
  );
});

ProfileAssociator.propTypes = {
  entityKey: PropTypes.string.isRequired,
  namespaceKey: PropTypes.string.isRequired,
  parentType: PropTypes.string.isRequired,
  masterType: PropTypes.string.isRequired,
  detailType: PropTypes.string.isRequired,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  profileName: PropTypes.string,
  parentId: PropTypes.string || PropTypes.number,
  hasLoaded: PropTypes.bool,
  record: PropTypes.object,
  dataAttributes: PropTypes.shape(PropTypes.object),
  isMultiSelect: PropTypes.bool,
  isMultiLink: PropTypes.bool,
  useSearch: PropTypes.bool,
  relationsToAdd: PropTypes.arrayOf(PropTypes.object),
  relationsToDelete: PropTypes.arrayOf(PropTypes.object),
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
};

ProfileAssociator.defaultProps = {
  parentId: null,
  hasLoaded: false,
  record: null,
  dataAttributes: null,
  isMultiSelect: true,
  isMultiLink: true,
  useSearch: true,
  relationsToAdd: [],
  relationsToDelete: [],
  onLink: noop,
  onUnlink: noop,
};
