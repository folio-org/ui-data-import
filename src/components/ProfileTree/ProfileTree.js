import React, {
  memo,
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
  record,
  contentData,
  linkingRules,
  className,
  dataAttributes,
}) => {
  const [changesCount, setChangesCount] = useState(0);
  const [currentType, setCurrentType] = useState(null);
  const [data, setData] = useState(contentData);
  const [profilesToLink, setProfilesToLink] = useState([]);
  const [profilesToUnlink, setProfilesToUnlink] = useState([]);

  const ChangesContext = React.createContext(changesCount);

  const getLines = (lines, reactTo) => lines.map(item => ({
    id: item.id,
    contentType: snakeCase(currentType).slice(0, -1).toLocaleUpperCase(),
    reactTo,
    content: item,
    childSnapshotWrappers: [],
  }));

  const onLink = lines => {
    const newData = [...data, ...getLines(lines)];

    setData(newData);
  };

  return (
    <ChangesContext.Provider value={changesCount}>
      <div className={classNames(css['profile-tree'], className)}>
        <div className={css['profile-tree-container']}>
          {data && data.length ? (
            data.map(item => (
              <ProfileBranch
                key={`profile-branch-${item.id}`}
                entityKey={`${camelCase(item.contentType)}s`}
                recordData={item.content}
                contentData={item.childSnapshotWrappers}
                profilesToLink={profilesToLink}
                profilesToUnlink={profilesToUnlink}
                record={record}
                linkingRules={linkingRules}
                onChange={setChangesCount}
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
            linkingRules={linkingRules}
            onTypeSelected={setCurrentType}
            onLinkCallback={onLink}
            {...dataAttributes}
          />
        )}
      </div>
    </ChangesContext.Provider>
  );
});

ProfileTree.propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  linkingRules: PropTypes.object,
  record: PropTypes.object,
  className: PropTypes.string,
  dataAttributes: PropTypes.object,
};
