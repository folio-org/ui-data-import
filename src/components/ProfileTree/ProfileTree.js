import React, {
  memo,
  useEffect,
  useState,
} from 'react';
import {
  useDispatch,
  useSelector
} from 'react-redux';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  noop,
  last,
  snakeCase,
  get,
  set,
} from 'lodash';
import classNames from 'classnames';

import {
  setCurrentProfileTreeContent,
  setProfileTreeContent
} from '../../redux';

import {
  ENTITY_KEYS,
  PROFILE_TYPES,
  PROFILE_RELATION_TYPES,
  STATE_MANAGEMENT,
} from '../../utils';
import {
  ProfileBranch,
  ProfileLinker,
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
  setData,
  record,
  className,
  dataAttributes,
  showLabelsAsHotLink,
  resources,
}) => {
  const dataKey = 'currentData';
  const profileTreeKey = 'profileTreeData';

  const parentRecordData = {
    id: parentId,
    profileId: parentId,
    contentType: PROFILE_TYPES.JOB_PROFILE,
  };

  const dispatch = useDispatch();
  const profileTreeContent = useSelector(state => {
    return get(
      state,
      [STATE_MANAGEMENT.REDUCER, profileTreeKey],
      [],
    );
  });

  const [addedRelations, setAddedRelations] = useState(relationsToAdd);
  const [deletedRelations, setDeletedRelations] = useState(relationsToDelete);

  useEffect(() => {
    setAddedRelations(relationsToAdd);
  }, [relationsToAdd]);

  useEffect(() => {
    setDeletedRelations(relationsToDelete);
  }, [relationsToDelete]);

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
    const profileTreeData = [...profileTreeContent];

    if (linesToAdd && linesToAdd.length) {
      const relsToAdd = [...addedRelations, ...composeRelations(linesToAdd, masterId, masterType, detailType, reactTo, order)];

      onLink(relsToAdd);
      setAddedRelations(relsToAdd);
    }

    const currentProfileTreeContent = set({}, localDataKey, newData);

    dispatch(setCurrentProfileTreeContent(currentProfileTreeContent));
    dispatch(setProfileTreeContent([...profileTreeData, ...linesToAdd]));
    setInitialData(newData);
  };

  const unlink = (parentData, setParentData, line, masterId, masterType, detailType, reactTo, localDataKey) => {
    const index = parentData.findIndex(item => item.profileId === line.profileId);
    const newIdx = findRelIndex(addedRelations, masterId, line);
    const profileTreeData = [...profileTreeContent];

    if (newIdx < 0) {
      const newRels = composeRelations([line], masterId, masterType, detailType, reactTo);
      const relsToDel = [...deletedRelations, ...newRels];

      onUnlink(relsToDel);
      setDeletedRelations(relsToDel);
    } else {
      const relsToAdd = [...addedRelations];

      relsToAdd.splice(newIdx, 1);
      onLink(relsToAdd);
      setAddedRelations(relsToAdd);
    }

    const newData = [...parentData];

    newData.splice(index, 1);
    setParentData(newData);

    const getNewProfileTreeData = function buildData(array, lineToCompare) {
      return array.filter(item => {
        if (lineToCompare.childSnapshotWrappers?.length) {
          return buildData(lineToCompare.childSnapshotWrappers, item).length;
        }

        return item.id !== lineToCompare.id;
      });
    };

    const currentProfileTreeContent = set({}, localDataKey, newData);

    dispatch(setCurrentProfileTreeContent(currentProfileTreeContent));
    dispatch(setProfileTreeContent(getNewProfileTreeData(profileTreeData, line)));
  };

  const remove = (parentData, setParentData, line, masterId, masterType, detailType, reactTo, localDataKey) => {
    unlink(parentData, setParentData, line, masterId, masterType, detailType, reactTo, localDataKey);
  };

  return (
    <div>
      <div className={classNames(css['profile-tree'], className)}>
        <div className={css['profile-tree-container']}>
          {contentData && contentData.length ? (
            contentData.map((item, i) => (
              <ProfileBranch
                key={`profile-branch-${item.profileId}-${i}`}
                index={i}
                reactTo={PROFILE_RELATION_TYPES.NONE}
                linkingRules={linkingRules}
                recordData={item}
                record={record}
                profileType={ENTITY_KEYS.JOB_PROFILES}
                parentRecordData={parentRecordData}
                parentSectionKey={dataKey}
                parentSectionData={contentData}
                setParentSectionData={setData}
                rootId={parentRecordData.id}
                onLink={link}
                onUnlink={unlink}
                onDelete={remove}
                okapi={okapi}
                showLabelsAsHotLink={showLabelsAsHotLink}
                resources={resources}
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
            profileType={ENTITY_KEYS.JOB_PROFILES}
            linkingRules={linkingRules}
            dataKey={dataKey}
            initialData={contentData}
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
  resources: PropTypes.object.isRequired,
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  relationsToAdd: PropTypes.arrayOf(PropTypes.object),
  relationsToDelete: PropTypes.arrayOf(PropTypes.object),
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
  setData: PropTypes.func,
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
  setData: noop,
  record: null,
  className: null,
  dataAttributes: null,
  showLabelsAsHotLink: false,
};
