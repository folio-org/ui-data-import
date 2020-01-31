import React, {
  memo,
  useEffect,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
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
  contentData,
  linkingRules,
  record,
  className,
  dataAttributes,
}) => {
  const [changesCount, setChangesCount] = useState(0);
  const [data, setData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [profilesToLink, setProfilesToLink] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [profilesToUnlink, setProfilesToUnlink] = useState([]);

  useEffect(() => {
    function getData() {
      const res = JSON.parse(sessionStorage.getItem('root.data'));

      return res || contentData;
    }
    setData(getData());
  }, [contentData]);

  const ChangesContext = React.createContext(changesCount);

  const getLines = (lines, currentType, reactTo) => lines.map(item => ({
    id: item.id,
    contentType: snakeCase(currentType).slice(0, -1).toLocaleUpperCase(),
    reactTo,
    content: item,
    childSnapshotWrappers: [],
  }));

  // eslint-disable-next-line no-unused-vars
  const onLink = lines => {
    setProfilesToLink([]);
  };

  // eslint-disable-next-line no-unused-vars
  const onUnlink = recordId => {
    setProfilesToUnlink([]);
  };

  // eslint-disable-next-line no-unused-vars
  const onDelete = recordId => {
    // @TODO: Record deletion code should be here
    onUnlink(recordId);
  };

  const onRootLink = (lines, currentType) => {
    const newData = [...data, ...getLines(lines, currentType)];

    sessionStorage.setItem('root.data', JSON.stringify(newData));
    setData(newData);
    onLink();
  };

  // eslint-disable-next-line no-unused-vars
  const onRootUnlink = recordId => {
    const index = data.findIndex(item => item.id === recordId);
    const newData = data;

    newData.splice(index, 0);
    sessionStorage.setItem('root.data', JSON.stringify(newData));
    setData(newData);
    onUnlink();
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
            onLink={onRootLink}
            {...dataAttributes}
          />
        )}
      </div>
    </ChangesContext.Provider>
  );
});

ProfileTree.propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  linkingRules: PropTypes.object.isRequired,
  record: PropTypes.object,
  className: PropTypes.string,
  dataAttributes: PropTypes.object,
};
