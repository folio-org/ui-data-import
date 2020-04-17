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

import { Accordion } from '@folio/stripes-components';

import { TreeLine } from '../TreeLine';

import {
  ProfileLabel,
  ProfileLinker,
  getDisabledOptions,
} from '.';

import css from './ProfileTree.css';
import {
  PROFILE_LABEL_IDS,
  PROFILE_RELATION_TYPES,
} from '../../utils/constants';

export const ProfileBranch = memo(({
  reactTo,
  linkingRules,
  recordData,
  record,
  okapi,
  parentRecordData,
  parentSectionKey,
  parentSectionData,
  setParentSectionData,
  className,
  onChange,
  onLink,
  onUnlink,
  onDelete,
  dataAttributes,
}) => {
  const {
    childrenAllowed,
    siblingsProhibited,
  } = linkingRules;
  const {
    contentType,
    content: currentRecord,
    childSnapshotWrappers: currentChildren,
  } = recordData;

  const entityKey = `${camelCase(contentType)}s`;
  const childrenSectionAllowed = childrenAllowed.findIndex(item => item === entityKey) >= 0;
  const sectionKey = `jobProfiles.${record ? record.id : 'current'}.${currentRecord ? currentRecord.id : 'root'}`;

  const getSectionStatus = section => {
    const res = JSON.parse(sessionStorage.getItem(`${sectionKey}.sectionStatus.${section}`));

    return res === null || res === true;
  };

  const [matchSectionOpen, setMatchSectionOpen] = useState(getSectionStatus('match'));
  const [nonMatchSectionOpen, setNonMatchSectionOpen] = useState(getSectionStatus('nonMatch'));
  const [matchData, setMatchData] = useState(undefined);
  const [nonMatchData, setNonMatchData] = useState(undefined);

  useEffect(() => {
    const getSectionData = section => {
      const res = JSON.parse(sessionStorage.getItem(`${sectionKey}.data.${section}`));
      const itemData = currentChildren.filter(item => item.reactTo && item.reactTo === snakeCase(section).toLocaleUpperCase());

      return res || itemData;
    };

    setMatchData(getSectionData('match'));
    setNonMatchData(getSectionData('nonMatch'));
  }, [currentChildren, sectionKey]);

  const getLabel = (
    <FormattedMessage id={PROFILE_LABEL_IDS[entityKey]}>
      {profileName => `${profileName}: "${currentRecord.name}"`}
    </FormattedMessage>
  );

  const handleToggle = (section, togglerValue, togglerSetter) => {
    sessionStorage.setItem(`${sectionKey}.sectionStatus.${section}`, JSON.stringify(!togglerValue));
    togglerSetter(!togglerValue);
    onChange(prev => prev + 1);
  };

  const containerId = `container-${record ? 'editable' : 'static'}-${currentRecord.id}`;
  const matchSectionId = `accordion-match-${record ? 'editable' : 'static'}-${currentRecord.id}`;
  const nonMatchSectionId = `accordion-non-match-${record ? 'editable' : 'static'}-${currentRecord.id}`;
  const matchSectionKey = `${sectionKey}.data.match`;
  const nonMatchSectionKey = `${sectionKey}.data.nonMatch`;

  return (
    <div
      data-test-profile-branch
      id={containerId}
      className={classNames(css['profile-branch'], className)}
    >
      <ProfileLabel
        label={getLabel}
        reactTo={reactTo}
        linkingRules={linkingRules}
        recordData={recordData}
        record={record}
        parentRecordData={parentRecordData}
        parentSectionKey={parentSectionKey}
        parentSectionData={parentSectionData}
        setParentSectionData={setParentSectionData}
        onUnlink={onUnlink}
        onDelete={onDelete}
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
                    reactTo={PROFILE_RELATION_TYPES.MATCH}
                    linkingRules={linkingRules}
                    recordData={item}
                    record={record}
                    parentRecordData={recordData}
                    parentSectionKey={matchSectionKey}
                    parentSectionData={matchData}
                    setParentSectionData={setMatchData}
                    onChange={onChange}
                    onLink={onLink}
                    onUnlink={onUnlink}
                    onDelete={onDelete}
                  />
                )) : (
                  <div>
                    <FormattedMessage
                      id="ui-data-import.emptyMessage"
                      values={{ type: <FormattedMessage id="ui-data-import.section" /> }}
                    />
                  </div>
                )}
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
                id={`${currentRecord.id}-match`}
                linkingRules={linkingRules}
                disabledOptions={getDisabledOptions(matchData, siblingsProhibited)}
                parentId={currentRecord.id}
                parentType={entityKey}
                dataKey={matchSectionKey}
                initialData={matchData}
                setInitialData={setMatchData}
                reactTo={PROFILE_RELATION_TYPES.MATCH}
                onLink={onLink}
                okapi={okapi}
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
                    reactTo={PROFILE_RELATION_TYPES.NON_MATCH}
                    linkingRules={linkingRules}
                    recordData={item}
                    record={record}
                    parentRecordData={recordData}
                    parentSectionKey={nonMatchSectionKey}
                    parentSectionData={nonMatchData}
                    setParentSectionData={setNonMatchData}
                    onChange={onChange}
                    onLink={onLink}
                    onUnlink={onUnlink}
                    onDelete={onDelete}
                  />
                )) : (
                  <div>
                    <FormattedMessage
                      id="ui-data-import.emptyMessage"
                      values={{ type: <FormattedMessage id="ui-data-import.section" /> }}
                    />
                  </div>
                )}
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
                id={`${currentRecord.id}-non-match`}
                linkingRules={linkingRules}
                disabledOptions={getDisabledOptions(nonMatchData, siblingsProhibited)}
                parentId={currentRecord.id}
                parentType={entityKey}
                dataKey={nonMatchSectionKey}
                initialData={nonMatchData}
                setInitialData={setNonMatchData}
                reactTo={PROFILE_RELATION_TYPES.NON_MATCH}
                onLink={onLink}
                okapi={okapi}
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
  reactTo: PropTypes.string.isRequired,
  linkingRules: PropTypes.object.isRequired,
  recordData: PropTypes.object.isRequired,
  parentRecordData: PropTypes.object.isRequired,
  parentSectionKey: PropTypes.string.isRequired,
  parentSectionData: PropTypes.arrayOf(PropTypes.object).isRequired,
  setParentSectionData: PropTypes.func.isRequired,
  okapi: PropTypes.shape({
    tenant: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  record: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
  onDelete: PropTypes.func,
  dataAttributes: PropTypes.object,
};

ProfileBranch.defaultProps = {
  record: null,
  className: null,
  onChange: noop,
  onLink: noop,
  onUnlink: noop,
  onDelete: noop,
  dataAttributes: null,
};
