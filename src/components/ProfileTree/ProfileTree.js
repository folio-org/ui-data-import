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
  const [currentType, setCurrentType] = useState(null);
  const [data, setData] = useState(contentData);

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
    <div className={classNames(css['profile-tree'], className)}>
      <div className={css['profile-tree-container']}>
        {data && data.length ? (
          data.map(item => (
            <ProfileBranch
              key={`profile-branch-${item.id}`}
              entityKey={`${camelCase(item.contentType)}s`}
              recordData={item.content}
              contentData={item.childSnapshotWrappers}
              record={record}
              linkingRules={linkingRules}
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
  );
});

ProfileTree.propTypes = {
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  linkingRules: PropTypes.object,
  record: PropTypes.object,
  className: PropTypes.string,
  dataAttributes: PropTypes.object,
};
