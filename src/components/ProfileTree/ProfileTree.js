import React, {
  memo,
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  noop,
  last,
  snakeCase,
} from 'lodash';
import classNames from 'classnames';

import {
  ENTITY_KEYS,
  PROFILE_TYPES,
  PROFILE_RELATION_TYPES,
} from '../../utils';
import {
  ProfileBranch,
  ProfileLinker,
  getDisabledOptions,
} from '.';

import css from './ProfileTree.css';

export const ProfileTree = memo(({
  parentId,
  linkingRules,
  contentData,
  relationsToAdd,
  relationsToDelete,
  okapi,
  onLink,
  onUnlink,
  record,
  className,
  dataAttributes,
  showLabelsAsHotLink,
}) => {
  const { siblingsProhibited } = linkingRules;

  const dataKey = 'jobProfiles.current';
  const parentRecordData = {
    id: parentId,
    profileId: parentId,
    contentType: PROFILE_TYPES.JOB_PROFILE,
  };

  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = JSON.parse(sessionStorage.getItem(dataKey)) || contentData;

    setData(getData);
  }, [contentData]);

  const isSnakeCase = str => str && str.includes('_');

  const getLines = (lines, currentType, order, reactTo = null) => lines.map((item, index) => ({
    profileId: item.profileId,
    contentType: snakeCase(currentType).slice(0, -1).toLocaleUpperCase(),
    reactTo,
    content: item.content,
    order: order + index,
    childSnapshotWrappers: item.childSnapshotWrappers || [],
  }));

  const findRelIndex = (relations, masterId, line) => {
    return relations.findIndex(rel => rel.masterProfileId === masterId && rel.detailProfileId === line.profileId);
  };

  const composeRelations = (lines, masterId, masterType, detailType, reactTo, order) => lines.map((item, index) => {
    let rel = {
      masterProfileId: masterId,
      masterProfileType: isSnakeCase(masterType) ? masterType : snakeCase(masterType).slice(0, -1).toLocaleUpperCase(),
      detailProfileId: item.profileId || item.id,
      detailProfileType: isSnakeCase(detailType) ? detailType : snakeCase(detailType).slice(0, -1).toLocaleUpperCase(),
      order: item.order || order + index,
    };

    if (masterId === PROFILE_TYPES.MATCH_PROFILE) {
      rel = {
        ...rel,
        jobProfileId: parentId,
      };
    }

    return reactTo ? {
      ...rel,
      reactTo,
    } : rel;
  });

  const link = (initialData, setInitialData, lines, masterId, masterType, detailType, reactTo, localDataKey) => {
    const order = initialData.length ? (last(initialData).order + 1) : 0;
    const linesToAdd = lines.filter(line => line.profileId !== masterId);
    const newData = [...initialData, ...getLines(linesToAdd, detailType, order, reactTo)];

    if (linesToAdd && linesToAdd.length) {
      const relsToAdd = [...relationsToAdd, ...composeRelations(linesToAdd, masterId, masterType, detailType, reactTo, order)];

      onLink(relsToAdd);
    }

    sessionStorage.setItem(localDataKey, JSON.stringify(newData));
    setInitialData(newData);
  };

  const unlink = (parentData, setParentData, line, masterId, masterType, detailType, reactTo, localDataKey) => {
    const index = parentData.findIndex(item => item.profileId === line.profileId);
    const newIdx = findRelIndex(relationsToAdd, masterId, line);

    if (newIdx < 0) {
      const newRels = composeRelations([line], masterId, masterType, detailType, reactTo);
      const relsToDel = [...relationsToDelete, ...newRels];

      onUnlink(relsToDel);
    } else {
      const relsToAdd = [...relationsToAdd];

      relsToAdd.splice(newIdx, 1);
      onLink(relsToAdd);
    }

    const newData = [...parentData];

    newData.splice(index, 1);
    setParentData(newData);
    sessionStorage.setItem(localDataKey, JSON.stringify(newData));
  };

  const remove = (parentData, setParentData, line, masterId, masterType, detailType, reactTo, localDataKey) => {
    unlink(parentData, setParentData, line, masterId, masterType, detailType, reactTo, localDataKey);
  };

  return (
    <div>
      <div className={classNames(css['profile-tree'], className)}>
        <div className={css['profile-tree-container']}>
          {data && data.length ? (
            data.map((item, i) => (
              <ProfileBranch
                key={`profile-branch-${item.profileId}-${i}`}
                reactTo={PROFILE_RELATION_TYPES.NONE}
                linkingRules={linkingRules}
                recordData={item}
                record={record}
                parentRecordData={parentRecordData}
                parentSectionKey={dataKey}
                parentSectionData={data}
                setParentSectionData={setData}
                rootId={parentRecordData.id}
                onLink={link}
                onUnlink={unlink}
                onDelete={remove}
                okapi={okapi}
                showLabelsAsHotLink={showLabelsAsHotLink}
              />
            ))
          ) : (
            <div>
              <FormattedMessage
                id="ui-data-import.emptyMessage"
                values={{ type: <FormattedMessage id="ui-data-import.list" /> }}
              />
            </div>
          )}
        </div>
        {!record && (
          <ProfileLinker
            id="linker-root"
            parentId={parentId}
            rootId={parentRecordData.id}
            parentType={ENTITY_KEYS.JOB_PROFILES}
            linkingRules={linkingRules}
            disabledOptions={getDisabledOptions(data, siblingsProhibited)}
            dataKey={dataKey}
            initialData={data}
            setInitialData={setData}
            onLink={link}
            okapi={okapi}
            {...dataAttributes}
          />
        )}
      </div>
    </div>
  );
});

ProfileTree.propTypes = {
  linkingRules: PropTypes.object.isRequired,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  okapi: PropTypes.shape({
    tenant: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  relationsToAdd: PropTypes.arrayOf(PropTypes.object),
  relationsToDelete: PropTypes.arrayOf(PropTypes.object),
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
  record: PropTypes.object,
  className: PropTypes.string,
  dataAttributes: PropTypes.object,
  showLabelsAsHotLink: PropTypes.bool,
};

ProfileTree.defaultProps = {
  parentId: null,
  relationsToAdd: [],
  relationsToDelete: [],
  onLink: noop,
  onUnlink: noop,
  record: null,
  className: null,
  dataAttributes: null,
  showLabelsAsHotLink: false,
};
