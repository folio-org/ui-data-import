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

import { Accordion } from '@folio/stripes-components';

import { TreeLine } from '../TreeLine';

import {
  ProfileLabel,
  ProfileLinker,
} from '.';

import css from './ProfileTree.css';

export const ProfileBranch = memo(({
  entityKey,
  recordData,
  contentData,
  linkingRules,
  record,
  className,
  dataAttributes,
}) => {
  const { childrenAllowed } = linkingRules;

  const childrenSectionAllowed = childrenAllowed.findIndex(item => item === entityKey) >= 0;

  const [currentType, setCurrentType] = useState(null);
  const [matchData, setMatchData] = useState(contentData);
  const [nonMatchData, setNonMatchData] = useState(contentData);

  const getLines = (lines, reactTo) => lines.map(item => ({
    id: item.id,
    contentType: snakeCase(currentType).slice(0, -1).toLocaleUpperCase(),
    reactTo,
    content: item,
    childSnapshotWrappers: [],
  }));

  const onMatchLink = lines => {
    const newData = [...matchData, ...getLines(lines, 'MATCH')];

    setMatchData(newData);
  };

  const onNonMatchLink = lines => {
    const newData = [...nonMatchData, ...getLines(lines, 'NON_MATCH')];

    setNonMatchData(newData);
  };

  const containerId = `container-${record ? 'editable' : 'static'}-${recordData.id}`;
  const matchSectionId = `accordion-match-${record ? 'editable' : 'static'}-${recordData.id}`;
  const nonMatchSectionId = `accordion-non-match-${record ? 'editable' : 'static'}-${recordData.id}`;

  return (
    <div
      id={containerId}
      className={classNames(css['profile-branch'], className)}
    >
      <ProfileLabel
        entityKey={entityKey}
        recordData={recordData}
        record={record}
        linkingRules={linkingRules}
      />
      {childrenSectionAllowed && (
        <div className={css['branch-container']}>
          <Accordion
            id={matchSectionId}
            label={<FormattedMessage id="ui-data-import.settings.profiles.linking.forMatches" />}
            separator={false}
          >
            <div className={css['branch-tree-container']}>
              {matchData && matchData.length ?
                matchData.map(item => (
                  <ProfileBranch
                    key={`profile-branch-${item.id}`}
                    entityKey={`${camelCase(item.contentType)}s`}
                    recordData={item.content}
                    contentData={item.childSnapshotWrappers}
                    record={record}
                    linkingRules={linkingRules}
                  />
                )) : (
                  <div>
                    <FormattedMessage
                      id="ui-data-import.emptyMessage"
                      values={{ type: <FormattedMessage id="ui-data-import.section" /> }}
                    />
                  </div>
                )
              }
            </div>
            <TreeLine
              from={`#branch-${record ? 'editable' : 'static'}-${recordData.id}`}
              to={`#${matchSectionId}`}
              container={`#${containerId}`}
              fromAnchor="left bottom"
              toAnchor="left"
              fromAnchorOffset="15px"
              orientation="horizontal"
            />
            {!record && (
              <ProfileLinker
                linkingRules={linkingRules}
                onTypeSelected={setCurrentType}
                onLinkCallback={onMatchLink}
                {...dataAttributes}
              />
            )}
          </Accordion>
          <Accordion
            id={nonMatchSectionId}
            label={<FormattedMessage id="ui-data-import.settings.profiles.linking.forNonMatches" />}
            separator={false}
          >
            <div className={css['branch-tree-container']}>
              {nonMatchData && nonMatchData.length ?
                nonMatchData.map((item, i) => (
                  <ProfileBranch
                    key={`profile-branch-${i}`}
                    entityKey={`${camelCase(item.contentType)}s`}
                    recordData={item.content}
                    contentData={item.childSnapshotWrappers}
                    record={record}
                    linkingRules={linkingRules}
                  />
                )) : (
                  <div>
                    <FormattedMessage
                      id="ui-data-import.emptyMessage"
                      values={{ type: <FormattedMessage id="ui-data-import.section" /> }}
                    />
                  </div>
                )
              }
            </div>
            <TreeLine
              from={`#branch-${record ? 'editable' : 'static'}-${recordData.id}`}
              to={`#${nonMatchSectionId}`}
              container={`#${containerId}`}
              fromAnchor="left bottom"
              toAnchor="left"
              fromAnchorOffset="15px"
              orientation="horizontal"
            />
            {!record && (
              <ProfileLinker
                linkingRules={linkingRules}
                onTypeSelected={setCurrentType}
                onLinkCallback={onNonMatchLink}
                {...dataAttributes}
              />
            )}
          </Accordion>
        </div>
      )}
    </div>
  );
});

ProfileBranch.propTypes = {
  entityKey: PropTypes.string.isRequired,
  recordData: PropTypes.object.isRequired,
  contentData: PropTypes.arrayOf(PropTypes.object).isRequired,
  linkingRules: PropTypes.object.isRequired,
  record: PropTypes.object,
  className: PropTypes.string,
  dataAttributes: PropTypes.object,
};

ProfileBranch.defaultProps = {
  record: null,
  className: null,
  dataAttributes: null,
};
