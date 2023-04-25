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
  camelCase,
  snakeCase,
  get,
  set,
} from 'lodash';
import classNames from 'classnames';

import { Accordion } from '@folio/stripes/components';

import { TreeLine } from '../TreeLine';

import {
  ProfileLabel,
  ProfileLinker,
} from '.';
import { setCurrentProfileTreeContent } from '../../redux';

import css from './ProfileTree.css';
import {
  okapiShape,
  PROFILE_LABEL_IDS,
  PROFILE_RELATION_TYPES,
  STATE_MANAGEMENT,
} from '../../utils';

export const ProfileBranch = memo(({
  reactTo,
  linkingRules,
  recordData,
  record,
  profileType,
  okapi,
  parentRecordData,
  parentSectionKey,
  parentSectionData,
  setParentSectionData,
  rootId,
  className,
  onChange,
  onLink,
  onUnlink,
  onDelete,
  dataAttributes,
  showLabelsAsHotLink,
  resources,
  index,
  parentIndex,
  parentProfilesRelationTypes,
}) => {
  const { childrenAllowed } = linkingRules;
  const {
    contentType,
    content: currentRecord,
    childSnapshotWrappers: currentChildren,
  } = recordData;

  const entityKey = `${camelCase(contentType)}s`;
  const childrenSectionAllowed = childrenAllowed.findIndex(item => item === entityKey) >= 0;
  const sectionKey = `${record ? record.id : 'current'}Branch.${currentRecord ? currentRecord.id : 'root'}`;

  const dispatch = useDispatch();
  const jobProfilesState = useSelector(state => {
    return get(
      state,
      [STATE_MANAGEMENT.REDUCER, 'jobProfiles', sectionKey],
      [],
    );
  });

  const getSectionStatus = section => {
    const res = get(jobProfilesState, ['sectionStatus', section]);

    return res === undefined || res === true;
  };

  const [matchSectionOpen, setMatchSectionOpen] = useState(getSectionStatus('match'));
  const [nonMatchSectionOpen, setNonMatchSectionOpen] = useState(getSectionStatus('nonMatch'));
  const [matchData, setMatchData] = useState([]);
  const [nonMatchData, setNonMatchData] = useState([]);

  useEffect(() => {
    const getSectionData = section => {
      const res = get(jobProfilesState, ['data', section]);

      const itemData = currentChildren.filter(item => item.reactTo && item.reactTo === snakeCase(section).toLocaleUpperCase());

      return res || itemData;
    };

    setMatchData(getSectionData('match'));
    setNonMatchData(getSectionData('nonMatch'));
  }, [currentChildren, sectionKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const getLabel = (
    <FormattedMessage id={PROFILE_LABEL_IDS[entityKey]}>
      {profileName => `${profileName}: "${currentRecord.name}"`}
    </FormattedMessage>
  );

  const handleToggle = (section, togglerValue, togglerSetter) => {
    const accStatus = set({}, `${sectionKey}.sectionStatus.${section}`, !togglerValue);

    dispatch(setCurrentProfileTreeContent(accStatus));
    togglerSetter(!togglerValue);
  };

  const branchMode = record ? 'static' : 'editable';
  const currentIndex = parentIndex ? `${parentIndex}-${index}` : `${index}`;
  const currentProfilesRelationTypes = parentProfilesRelationTypes ? `${parentProfilesRelationTypes}-${reactTo}` : 'ROOT';
  const containerId = `container-${currentProfilesRelationTypes}-${branchMode}-${currentRecord.id}-${currentIndex}`;
  const matchSectionId = `accordion-match-${currentProfilesRelationTypes}-${branchMode}-${currentRecord.id}-${currentIndex}`;
  const nonMatchSectionId = `accordion-non-match-${currentProfilesRelationTypes}-${branchMode}-${currentRecord.id}-${currentIndex}`;
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
        showLabelsAsHotLink={showLabelsAsHotLink}
        resources={resources}
        currentIndex={currentIndex}
        currentProfilesRelationTypes={currentProfilesRelationTypes}
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
                    index={i}
                    parentIndex={currentIndex}
                    parentProfilesRelationTypes={currentProfilesRelationTypes}
                    reactTo={PROFILE_RELATION_TYPES.MATCH}
                    linkingRules={linkingRules}
                    recordData={item}
                    record={record}
                    profileType={profileType}
                    okapi={okapi}
                    parentRecordData={recordData}
                    parentSectionKey={matchSectionKey}
                    parentSectionData={matchData}
                    setParentSectionData={setMatchData}
                    rootId={rootId}
                    onChange={onChange}
                    onLink={onLink}
                    onUnlink={onUnlink}
                    onDelete={onDelete}
                    showLabelsAsHotLink={showLabelsAsHotLink}
                    resources={resources}
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
              from={`#branch-${branchMode}-${recordData.id}`}
              to={`#${matchSectionId} > :first-child`}
              container={`#${containerId}`}
              fromAnchor="left bottom"
              toAnchor="left"
              fromAnchorOffset="15px"
              orientation="horizontal"
            />
            {!record && (
              <ProfileLinker
                id={`${currentProfilesRelationTypes}-${currentRecord.id}-${currentIndex}-match`}
                linkingRules={linkingRules}
                parentId={currentRecord.id}
                rootId={rootId}
                parentType={entityKey}
                profileType={profileType}
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
                    index={i}
                    parentIndex={currentIndex}
                    parentProfilesRelationTypes={currentProfilesRelationTypes}
                    reactTo={PROFILE_RELATION_TYPES.NON_MATCH}
                    linkingRules={linkingRules}
                    recordData={item}
                    record={record}
                    profileType={profileType}
                    okapi={okapi}
                    parentRecordData={recordData}
                    parentSectionKey={nonMatchSectionKey}
                    parentSectionData={nonMatchData}
                    setParentSectionData={setNonMatchData}
                    rootId={rootId}
                    onChange={onChange}
                    onLink={onLink}
                    onUnlink={onUnlink}
                    onDelete={onDelete}
                    showLabelsAsHotLink={showLabelsAsHotLink}
                    resources={resources}
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
              from={`#branch-${branchMode}-${recordData.id}`}
              to={`#${nonMatchSectionId} > :first-child`}
              container={`#${containerId}`}
              fromAnchor="left bottom"
              toAnchor="left"
              fromAnchorOffset="15px"
              orientation="horizontal"
            />
            {!record && (
              <ProfileLinker
                id={`${currentProfilesRelationTypes}-${currentRecord.id}-${currentIndex}-non-match`}
                linkingRules={linkingRules}
                parentId={currentRecord.id}
                rootId={rootId}
                parentType={entityKey}
                profileType={profileType}
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
  linkingRules: PropTypes.object.isRequired,
  recordData: PropTypes.object.isRequired,
  parentRecordData: PropTypes.object.isRequired,
  parentSectionKey: PropTypes.string.isRequired,
  parentSectionData: PropTypes.arrayOf(PropTypes.object).isRequired,
  setParentSectionData: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  resources: PropTypes.object.isRequired,
  profileType: PropTypes.string.isRequired,
  reactTo: PropTypes.oneOf(Object.values(PROFILE_RELATION_TYPES)),
  rootId: PropTypes.string,
  record: PropTypes.object,
  className: PropTypes.string,
  onChange: PropTypes.func,
  onLink: PropTypes.func,
  onUnlink: PropTypes.func,
  onDelete: PropTypes.func,
  dataAttributes: PropTypes.object,
  showLabelsAsHotLink: PropTypes.bool,
  index: PropTypes.number,
  parentIndex: PropTypes.string,
  parentProfilesRelationTypes: PropTypes.string,
};

ProfileBranch.defaultProps = {
  reactTo: null,
  rootId: null,
  record: null,
  className: null,
  onChange: noop,
  onLink: noop,
  onUnlink: noop,
  onDelete: noop,
  dataAttributes: null,
  showLabelsAsHotLink: false,
  index: 0,
  parentIndex: '',
  parentProfilesRelationTypes: '',
};
