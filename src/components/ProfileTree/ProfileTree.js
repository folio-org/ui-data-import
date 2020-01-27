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
  onLink,
  onUnlink,
  record,
  className,
  dataAttributes,
}) => {
  const dataKey = `${parentId || 'new'}.root.data`;
  const [changesCount, setChangesCount] = useState(0);
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(JSON.parse(sessionStorage.getItem(dataKey)) || contentData);

    return () => {
      sessionStorage.removeItem(dataKey);
    };
  }, [contentData]);

  const ChangesContext = React.createContext(changesCount);

  const getLines = (lines, currentType, reactTo = null) => lines.map(item => ({
    id: item.id,
    contentType: snakeCase(currentType).slice(0, -1).toLocaleUpperCase(),
    reactTo,
    content: item,
    childSnapshotWrappers: [],
  }));

  const findRelIndex = (relations, masterId, line) => {
    return relations.findIndex(rel => rel.masterProfileId === masterId && rel.detailProfileId === line.id);
  };

  const composeRelations = (lines, masterId, masterType, detailType) => lines.map(item => ({
    masterProfileId: masterId,
    masterProfileType: masterType,
    detailProfileId: item.id,
    detailProfileType: detailType,
  }));

  const link = (lines, masterId, masterType, detailType) => {
    const uniqueLines = lines.filter(line => data.findIndex(item => item.id === line.id) === -1);
    const newData = [...data, ...getLines(lines, masterType)];
    const linesToAdd = uniqueLines.filter(line => findRelIndex(relationsToDelete, line) === -1);

    if (linesToAdd && linesToAdd.length) {
      const relsToAdd = [...relationsToAdd, ...composeRelations(linesToAdd)];

      onLink(relsToAdd);
    }

    setData(newData);

    sessionStorage.setItem(dataKey, JSON.stringify(newData));
    onLink(linesToAdd);
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
    <ChangesContext.Provider value={changesCount}>
      <div className={classNames(css['profile-tree'], className)}>
        <div className={css['profile-tree-container']}>
          {data && data.length ? (
            data.map((item, i) => (
              <ProfileBranch
                key={`profile-branch-${item.id}-${i}`}
                entityKey={`${camelCase(item.contentType)}s`}
                recordData={item.content}
                contentData={item.childSnapshotWrappers}
                record={record}
                linkingRules={linkingRules}
                onChange={setChangesCount}
                onLink={onLink}
                onUnlink={onUnlink}
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
            linkingRules={linkingRules}
            onLink={link}
            {...dataAttributes}
          />
        )}
      </div>
    </ChangesContext.Provider>
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
