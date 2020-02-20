import React, {
  memo,
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  noop,
  snakeCase,
} from 'lodash';
import classNames from 'classnames';

import {
  ENTITY_KEYS,
  PROFILE_TYPES,
  PROFILE_RELATION_TYPES,
} from '../../utils/constants';
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
  onLink,
  onUnlink,
  record,
  className,
  dataAttributes,
}) => {
  const { siblingsProhibited } = linkingRules;

  const dataKey = 'jobProfiles.current';
  const parentRecordData = {
    id: parentId,
    contentType: PROFILE_TYPES.JOB_PROFILE,
  };

  const [changesCount, setChangesCount] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = JSON.parse(sessionStorage.getItem(dataKey)) || contentData;

    setData(getData);
  }, [contentData]);

  /**
   * Disabled due to UIDATIMP-357 and UIDATIMP-358 conflict with context solution
   * @TODO return this to action or substitute with new solution to fix TreeLine rendering
   */
  // const ChangesContext = React.createContext(changesCount);

  const isSnakeCase = str => str && str.includes('_');

  const getLines = (lines, currentType, reactTo = null) => lines.map(item => ({
    profileId: item.id,
    contentType: snakeCase(currentType).slice(0, -1).toLocaleUpperCase(),
    reactTo,
    content: item,
    childSnapshotWrappers: [],
  }));

  const findRelIndex = (relations, masterId, line) => {
    return relations.findIndex(rel => rel.masterProfileId === masterId && rel.detailProfileId === line.id);
  };

  const composeRelations = (lines, masterId, masterType, detailType, reactTo) => lines.map(item => {
    const rel = {
      masterProfileId: masterId,
      masterProfileType: isSnakeCase(masterType) ? masterType : snakeCase(masterType).slice(0, -1).toLocaleUpperCase(),
      detailProfileId: item.id,
      detailProfileType: isSnakeCase(detailType) ? detailType : snakeCase(detailType).slice(0, -1).toLocaleUpperCase(),
    };

    return reactTo ? {
      ...rel,
      reactTo,
    } : rel;
  });

  const link = (initialData, setInitialData, lines, masterId, masterType, detailType, reactTo, localDataKey) => {
    const uniqueLines = lines.filter(line => initialData.findIndex(item => item.id === line.id) === -1);
    const newData = [...initialData, ...getLines(uniqueLines, detailType, reactTo)];
    const linesToAdd = uniqueLines.filter(line => findRelIndex(relationsToDelete, line) === -1);

    if (linesToAdd && linesToAdd.length) {
      const relsToAdd = [...relationsToAdd, ...composeRelations(linesToAdd, masterId, masterType, detailType, reactTo)];

      onLink(relsToAdd);
    }

    sessionStorage.setItem(localDataKey, JSON.stringify(newData));
    setInitialData(newData);
  };

  const unlink = (parentData, setParentData, line, masterId, masterType, detailType, reactTo, localDataKey) => {
    const index = parentData.findIndex(item => item.id === line.id);
    const newIdx = findRelIndex(relationsToAdd, line);

    if (newIdx < 0) {
      const newRels = composeRelations([line], masterId, masterType, detailType, reactTo);
      const relsToDel = [...relationsToDelete, ...newRels];

      onUnlink(relsToDel);
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
    /**
     * Disabled due to UIDATIMP-357 and UIDATIMP-358 conflict with context solution
     * @TODO return this to action or substitute with new solution to fix TreeLine rendering
     */
    /* <ChangesContext.Provider value={changesCount}> */
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
                onChange={setChangesCount}
                onLink={link}
                onUnlink={unlink}
                onDelete={remove}
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
            parentType={ENTITY_KEYS.JOB_PROFILES}
            linkingRules={linkingRules}
            disabledOptions={getDisabledOptions(data, siblingsProhibited)}
            dataKey={dataKey}
            initialData={data}
            setInitialData={setData}
            onLink={link}
            {...dataAttributes}
          />
        )}
      </div>
    </div>
    /* </ChangesContext.Provider> */
  );
});

ProfileTree.propTypes = {
  linkingRules: PropTypes.object.isRequired,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  parentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  relationsToAdd: PropTypes.arrayOf(PropTypes.object),
  relationsToDelete: PropTypes.arrayOf(PropTypes.object),
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
  record: PropTypes.object,
  className: PropTypes.string,
  dataAttributes: PropTypes.object,
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
};
