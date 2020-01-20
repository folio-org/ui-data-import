import React, {
  memo,
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
  onChange,
  onLink,
  onUnlink,
  dataAttributes,
}) => {
  const { childrenAllowed } = linkingRules;

  const childrenSectionAllowed = childrenAllowed.findIndex(item => item === entityKey) >= 0;
  const sectionKey = `jobProfiles.${record ? record.id : 'current'}.${recordData ? recordData.id : 'root'}`;

  const getSectionStatus = section => {
    const res = JSON.parse(sessionStorage.getItem(`${sectionKey}.sectionStatus.${section}`));

    return res === null || res === true;
  };

  const getSectionData = section => {
    const res = JSON.parse(sessionStorage.getItem(`${sectionKey}.data.${section}`));

    return res || contentData;
  };

  const [matchSectionOpen, setMatchSectionOpen] = useState(getSectionStatus('match'));
  const [nonMatchSectionOpen, setNonMatchSectionOpen] = useState(getSectionStatus('nonMatch'));
  const [matchData, setMatchData] = useState(getSectionData('match'));
  const [nonMatchData, setNonMatchData] = useState(getSectionData('nonMatch'));

  const getLines = (lines, currentType, reactTo) => lines.map(item => ({
    id: item.id,
    contentType: snakeCase(currentType).slice(0, -1).toLocaleUpperCase(),
    reactTo,
    content: item,
    childSnapshotWrappers: [],
  }));

  const handleToggle = (section, togglerValue, togglerSetter) => {
    sessionStorage.setItem(`${sectionKey}.sectionStatus.${section}`, JSON.stringify(!togglerValue));
    togglerSetter(!togglerValue);
    onChange(prev => prev + 1);
  };

  const onMatchLink = (lines, currentType) => {
    const newData = [...matchData, ...getLines(lines, currentType, 'MATCH')];

    sessionStorage.setItem(`${sectionKey}.data.match`, JSON.stringify(newData));
    setMatchData(newData);
    onLink();
  };

  const onMatchUnlink = recordId => {
    const index = matchData.findIndex(item => item.id === recordId);
    const newData = matchData;

    newData.splice(index, 0);
    sessionStorage.setItem(`${sectionKey}.data.match`, JSON.stringify(newData));
    setMatchData(newData);
    onUnlink();
  };

  const onNonMatchLink = (lines, currentType) => {
    const newData = [...nonMatchData, ...getLines(lines, currentType, 'NON_MATCH')];

    sessionStorage.setItem(`${sectionKey}.data.nonMatch`, JSON.stringify(newData));
    setNonMatchData(newData);
    onLink();
  };

  const onNonMatchUnlink = recordId => {
    const index = nonMatchData.findIndex(item => item.id === recordId);
    const newData = nonMatchData;

    newData.splice(index, 0);
    sessionStorage.setItem(`${sectionKey}.data.nonMatch`, JSON.stringify(newData));
    setNonMatchData(newData);
    onUnlink();
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
        onUnlink={noop}
        onDelete={noop}
      />
      {childrenSectionAllowed && (
        <div className={css['branch-container']}>
          <Accordion
            id={matchSectionId}
            label={<FormattedMessage id="ui-data-import.settings.profiles.linking.forMatches" />}
            separator={false}
            open={matchSectionOpen}
            onToggle={() => handleToggle('match', matchSectionOpen, setMatchSectionOpen)}
          >
            <div className={css['branch-tree-container']}>
              {matchData && matchData.length ?
                matchData.map((item, i) => (
                  <ProfileBranch
                    key={`profile-branch-${item.id}-${i}`}
                    entityKey={`${camelCase(item.contentType)}s`}
                    recordData={item.content}
                    contentData={item.childSnapshotWrappers}
                    record={record}
                    linkingRules={linkingRules}
                    onChange={onChange}
                    onLink={onLink}
                    onUnlink={onUnlink}
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
              to={`#${matchSectionId} > :first-child`}
              container={`#${containerId}`}
              fromAnchor="left bottom"
              toAnchor="left"
              fromAnchorOffset="15px"
              orientation="horizontal"
            />
            {!record && (
              <ProfileLinker
                id={`${recordData.id}-match`}
                linkingRules={linkingRules}
                onLink={onMatchLink}
                {...dataAttributes}
              />
            )}
          </Accordion>
          <Accordion
            id={nonMatchSectionId}
            label={<FormattedMessage id="ui-data-import.settings.profiles.linking.forNonMatches" />}
            separator={false}
            open={nonMatchSectionOpen}
            onToggle={() => handleToggle('nonMatch', nonMatchSectionOpen, setNonMatchSectionOpen)}
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
                    onChange={onChange}
                    onLink={onLink}
                    onUnlink={onUnlink}
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
              to={`#${nonMatchSectionId} > :first-child`}
              container={`#${containerId}`}
              fromAnchor="left bottom"
              toAnchor="left"
              fromAnchorOffset="15px"
              orientation="horizontal"
            />
            {!record && (
              <ProfileLinker
                id={`${recordData.id}-non-match`}
                linkingRules={linkingRules}
                onLink={onNonMatchLink}
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
  onChange: PropTypes.func,
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
  dataAttributes: PropTypes.object,
};

ProfileBranch.defaultProps = {
  record: null,
  className: null,
  onChange: noop,
  onLink: noop,
  onUnlink: noop,
  dataAttributes: null,
};
