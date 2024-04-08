import React, {
  memo,
  useEffect,
  useState,
} from 'react';
import {
  useDispatch,
  useSelector,
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
  setProfileTreeContent,
} from '../../redux';

import {
  ENTITY_KEYS,
  PROFILE_TYPES,
  PROFILE_RELATION_TYPES,
  STATE_MANAGEMENT,
  okapiShape,
} from '../../utils';
import {
  ProfileBranch,
  ProfileLinker,
} from '.';

import css from './ProfileTree.css';

export const ProfileTree = memo(({
  parentId,
  profileWrapperId,
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
    profileWrapperId,
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

  const massageAddedProfiles = (lines, currentType, order, reactTo = null) => lines.map((item, index) => ({
    id: item.content.id,
    contentType: snakeCase(currentType).slice(0, -1).toLocaleUpperCase(),
    reactTo,
    content: item.content,
    order: order + index,
    childSnapshotWrappers: item.childSnapshotWrappers || [],
  }));

  const findRelIndex = (relations, masterId, line, reactTo) => {
    return relations.findIndex(rel => (rel.masterProfileId === masterId
      && rel.detailProfileId === line.content.id
      && rel.reactTo !== undefined ? rel.reactTo === reactTo : reactTo === null));
  };

  const composeRelations = ({
    lines,
    masterId,
    masterType,
    detailType,
    masterWrapperId,
    detailWrapperId,
    reactTo,
    order,
  }) => lines.map((item, index) => {
    let rel = {
      masterProfileId: masterId,
      masterWrapperId,
      masterProfileType: isSnakeCase(masterType) ? masterType : snakeCase(masterType).slice(0, -1).toLocaleUpperCase(),
      detailProfileId: item.content.id,
      detailWrapperId,
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

  const link = ({
    initialData: profilesInSection,
    setInitialData: setSectionData,
    lines,
    masterId,
    masterWrapperId,
    masterType,
    detailType: addedProfileType,
    reactTo,
    localDataKey,
  }) => {
    // get order for newly added lines
    const order = profilesInSection.length ? (last(profilesInSection).order + 1) : 0;

    // filter match profiles so linked profile is not the same as parent profile
    const linesToAdd = lines.filter(line => line.content.id !== masterId);

    if (linesToAdd && linesToAdd.length) {
      const relsToAdd = [...addedRelations, ...composeRelations({
        lines: linesToAdd,
        masterId,
        masterType,
        detailType: addedProfileType,
        masterWrapperId,
        detailWrapperId: null,
        reactTo,
        order,
      })];

      // set added relations to form field
      onLink(relsToAdd);

      // set added relations to component state
      setAddedRelations(relsToAdd);
    }

    const massagedAddedProfiles = massageAddedProfiles(linesToAdd, addedProfileType, order, reactTo);

    const sectionData = [...profilesInSection, ...massagedAddedProfiles];
    const sectionDataForStorage = set({}, localDataKey, sectionData);

    dispatch(setCurrentProfileTreeContent(sectionDataForStorage));
    dispatch(setProfileTreeContent([...profileTreeContent, ...massagedAddedProfiles]));
    setSectionData(sectionData);
  };

  const unlink = ({
    parentData: sectionData,
    setParentData,
    line,
    masterId,
    masterWrapperId,
    masterType,
    detailType,
    detailWrapperId,
    reactTo,
    localDataKey,
  }) => {
    // find unlinking profile index in section
    const index = sectionData.findIndex(item => item.content.id === line.content.id);

    // check whether the unlinking profile was added during editing
    const indexOfUnlinkedProfileInAddedProfiles = findRelIndex(addedRelations, masterId, line, reactTo);

    const isUnlinkingInitialData = indexOfUnlinkedProfileInAddedProfiles < 0;

    if (isUnlinkingInitialData) {
      const relsToDel = [...deletedRelations, ...composeRelations({
        lines: [line],
        masterId,
        masterType,
        detailType,
        masterWrapperId,
        detailWrapperId,
        reactTo,
      })];

      // set deleted relations to form field
      onUnlink(relsToDel);

      // set unlinked relations to component state
      setDeletedRelations(relsToDel);
    } else {
      const relsToAdd = [...addedRelations];

      relsToAdd.splice(indexOfUnlinkedProfileInAddedProfiles, 1);

      // set added relations to form field
      onLink(relsToAdd);

      // set added relations to component state
      setAddedRelations(relsToAdd);
    }

    const newSectionData = [...sectionData];

    newSectionData.splice(index, 1);

    setParentData(newSectionData);

    const getNewProfileTreeData = function buildData(array, lineToCompare) {
      return array.filter(item => {
        if (lineToCompare.childSnapshotWrappers?.length) {
          return buildData(lineToCompare.childSnapshotWrappers, item).length;
        }

        return item.id !== lineToCompare.id;
      });
    };

    const sectionDataForStorage = set({}, localDataKey, newSectionData);

    dispatch(setCurrentProfileTreeContent(sectionDataForStorage));
    dispatch(setProfileTreeContent(getNewProfileTreeData([...profileTreeContent], line)));
  };

  return (
    <div>
      <div className={classNames(css['profile-tree'], className)}>
        <div className={css['profile-tree-container']}>
          {contentData && contentData.length ? (
            contentData.map((item, i) => (
              <ProfileBranch
                key={`profile-branch-${item.content.id}-${i}`}
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
                onDelete={unlink}
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
            masterWrapperId={profileWrapperId}
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
  okapi: okapiShape.isRequired,
  resources: PropTypes.object.isRequired,
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  profileWrapperId: PropTypes.string,
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
  profileWrapperId: null,
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
