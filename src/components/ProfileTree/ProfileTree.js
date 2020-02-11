import React, {
  memo,
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  noop,
  camelCase,
  snakeCase,
} from 'lodash';
import classNames from 'classnames';

import { ENTITY_KEYS } from '../../utils/constants';
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
  const [changesCount, setChangesCount] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getData = JSON.parse(sessionStorage.getItem(dataKey)) || contentData;

    setData(getData);
  }, [contentData]);

  // const ChangesContext = React.createContext(changesCount);

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

  const composeRelations = (lines, masterId, masterType, detailType, reactTo) => lines.map(item => ({
    masterProfileId: masterId,
    masterProfileType: snakeCase(masterType).slice(0, -1).toLocaleUpperCase(),
    detailProfileId: item.id,
    detailProfileType: snakeCase(detailType).slice(0, -1).toLocaleUpperCase(),
    reactTo,
  }));

  const link = (initialData, setInitialData, lines, masterId, masterType, detailType, reactTo, localDataKey) => {
    const uniqueLines = lines.filter(line => initialData.findIndex(item => item.id === line.id) === -1);
    const newData = [...initialData, ...getLines(uniqueLines, detailType, reactTo)];
    const linesToAdd = uniqueLines.filter(line => findRelIndex(relationsToDelete, line) === -1);

    sessionStorage.setItem(localDataKey, JSON.stringify(newData));
    setInitialData(newData);

    if (linesToAdd && linesToAdd.length) {
      const relsToAdd = [...relationsToAdd, ...composeRelations(linesToAdd, masterId, masterType, detailType, reactTo)];

      onLink(relsToAdd);
    }

    sessionStorage.setItem(localDataKey, JSON.stringify(newData));
    setInitialData(newData);
  };

  const unlink = row => {
    const index = data.findIndex(item => item.id === row.id);
    const newIdx = findRelIndex(relationsToAdd, row);

    if (newIdx < 0) {
      const relsToDel = [...relationsToDelete, ...composeRelations([row])];

      onUnlink(relsToDel);
    }

    data.splice(index, 1);
    setData(data);
    sessionStorage.setItem(dataKey, JSON.stringify(data));
  };

  const remove = row => {
    const index = data.findIndex(item => item.id === row.id);
    const newIdx = findRelIndex(relationsToAdd, row);

    if (newIdx < 0) {
      const relsToDel = [...relationsToDelete, ...composeRelations([row])];

      onUnlink(relsToDel);
    }

    data.splice(index, 1);
    setData(data);
  };

  return (
    /**
     * Disabled due to UIDATIMP-357 and UIDATIMP-358 conflict with context solution
     * @TODO return this to action or substitute with new solution to fix TreeLine rendering
     */
    /* <ChangesContext.Provider value={changesCount}> */
    <div>
      {/* <div>{changesCount}</div> */}
      <div className={classNames(css['profile-tree'], className)}>
        <div className={css['profile-tree-container']}>
          {data && data.length ? (
            data.map((item, i) => (
              <ProfileBranch
                key={`profile-branch-${item.profileId}-${i}`}
                entityKey={`${camelCase(item.contentType)}s`}
                recordData={item.content}
                contentData={item.childSnapshotWrappers}
                record={record}
                linkingRules={linkingRules}
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
  parentId: PropTypes.oneOf(PropTypes.string, PropTypes.number),
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
