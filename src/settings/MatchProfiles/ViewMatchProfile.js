import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  isEmpty,
  get,
} from 'lodash';

import {
  AppIcon,
  TitleManager,
  stripesConnect,
} from '@folio/stripes/core';
import {
  Pane,
  Button,
  Headline,
  KeyValue,
  NoValue,
  Accordion,
  AccordionSet,
  ConfirmationModal,
  PaneHeader,
} from '@folio/stripes/components';
import {
  ViewMetaData,
  withTags,
  TagsAccordion,
} from '@folio/stripes/smart-components';

import { getFieldMatched } from '../../utils';
import {
  ENTITY_KEYS,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
  PROFILE_TYPES,
  COMPARISON_PARTS,
  QUALIFIER_TYPES,
  CRITERION_TYPES,
  VALUE_TYPES,
} from '../../utils/constants';
import {
  Spinner,
  EndOfItem,
  ActionMenu,
  FlexibleForm,
  ProfileAssociator,
} from '../../components';
import { FOLIO_RECORD_TYPES } from '../../components/ListTemplate';

import sharedCss from '../../shared.css';
import styles from './ViewMatchProfile.css';
import { formConfigSamples } from '../../../test/bigtest/mocks';

const formName = 'matchProfilesForm';

@stripesConnect
@withTags
export class ViewMatchProfile extends Component {
  static manifest = Object.freeze({
    initializedFilterConfig: { initialValue: false },
    matchProfile: {
      type: 'okapi',
      path: 'data-import-profiles/matchProfiles/:{id}',
      params: { withRelations: true },
      throwErrors: false,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      matchProfile: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    match: PropTypes.shape({ params: PropTypes.shape({ id: PropTypes.string }).isRequired }).isRequired,
    tagsEnabled: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    paneId: PropTypes.string,
    ENTITY_KEY: PropTypes.string, // eslint-disable-line
    actionMenuItems: PropTypes.arrayOf(PropTypes.string), // eslint-disable-line
  };

  static defaultProps = {
    paneId: 'pane-match-profile-details',
    ENTITY_KEY: ENTITY_KEYS.MATCH_PROFILES,
    actionMenuItems: [
      'edit',
      'duplicate',
      'delete',
    ],
  };

  state = {
    deletionInProgress: false,
    showDeleteConfirmation: false,
  };

  get matchProfileData() {
    const { resources } = this.props;

    const matchProfile = resources.matchProfile || {};
    const [record] = matchProfile.records || [];

    return {
      hasLoaded: matchProfile.hasLoaded,
      record,
    };
  }

  showDeleteConfirmation = () => {
    this.setState({ showDeleteConfirmation: true });
  };

  hideDeleteConfirmation = () => {
    this.setState({
      showDeleteConfirmation: false,
      deletionInProgress: false,
    });
  };

  handleDelete(record) {
    const { onDelete } = this.props;
    const { deletionInProgress } = this.state;

    if (deletionInProgress) {
      return;
    }

    this.setState({ deletionInProgress: true }, async () => {
      await onDelete(record);
      this.hideDeleteConfirmation();
    });
  }

  renderActionMenu = menu => (
    <ActionMenu
      entity={this}
      menu={menu}
    />
  );

  getValue = (fields, label) => {
    const field = fields.find(item => item.label === label);

    return (!isEmpty(field) && !!field.value.trim()) ? field.value : undefined;
  };

  getLabel = (elements, label) => {
    const element = elements.find(item => item.value === label);

    return !isEmpty(element) ? <FormattedMessage id={element.label} /> : undefined;
  };

  renderPaneHeader = renderProps => {
    const {
      onClose,
      paneId,
    } = this.props;

    const { record: matchProfile } = this.matchProfileData;

    const paneTitle = (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="matchProfiles"
      >
        {matchProfile.name}
      </AppIcon>
    );

    return (
      <PaneHeader
        {...renderProps}
        id={paneId}
        paneTitle={paneTitle}
        paneSub={<FormattedMessage id="ui-data-import.matchProfileName" />}
        actionMenu={this.renderActionMenu}
        dismissible
        onClose={onClose}
      />
    );
  };

  render() {
    const { tagsEnabled } = this.props;
    const { showDeleteConfirmation } = this.state;

    const {
      hasLoaded,
      record: matchProfile,
    } = this.matchProfileData;
    const associations = [...[], ...get(matchProfile, ['parentProfiles'], []), ...get(matchProfile, ['childProfiles'], [])];

    if (!matchProfile || !hasLoaded) {
      return <Spinner entity={this} />;
    }

    // MatchProfiles sample data does not contain user Ids because of back-end limitations
    // and therefore it is required to add it manually on UI side
    // TODO: use real IDs when sample data will be removed (remove the block of code below)
    {
      const userId = get(this.props, ['stripes', 'okapi', 'currentUser', 'id'], '');

      matchProfile.metadata = {
        ...matchProfile.metadata,
        createdByUserId: matchProfile.metadata.createdByUserId || userId,
        updatedByUserId: matchProfile.metadata.updatedByUserId || userId,
      };
    }

    const tagsEntityLink = `data-import-profiles/matchProfiles/${matchProfile.id}`;

    // Here is mocked config file with mocked values, it should be replaced/rewritten once BE will be ready
    const formConfig = formConfigSamples.find(cfg => cfg.name === formName);
    const matchDetails = get(matchProfile, ['matchDetails', '0'], []);
    const {
      incomingMatchExpression,
      existingMatchExpression,
    } = matchDetails;

    const incomingFields = get(incomingMatchExpression, 'fields', []);
    const existingFields = get(existingMatchExpression, 'fields', []);
    const existingField = this.getValue(existingFields, 'field');

    const record = {
      ...matchProfile,
      matchDetails: [{
        incomingMatchExpression: {
          fields: [
            {
              label: 'field',
              value: this.getValue(incomingFields, 'field') || <NoValue />,
            }, {
              label: 'indicator1',
              value: this.getValue(incomingFields, 'indicator1') || <NoValue />,
            }, {
              label: 'indicator2',
              value: this.getValue(incomingFields, 'indicator2') || <NoValue />,
            }, {
              label: 'recordSubfield',
              value: this.getValue(incomingFields, 'recordSubfield') || <NoValue />,
            },
          ],
          qualifier: {
            qualifierType: this.getLabel(QUALIFIER_TYPES, get(incomingMatchExpression, ['qualifier', 'qualifierType'])),
            qualifierValue: get(incomingMatchExpression, ['qualifier', 'qualifierValue']),
            comparisonPart: this.getLabel(COMPARISON_PARTS, get(incomingMatchExpression, ['qualifier', 'comparisonPart'])),
          },
        },
        incomingRecordType: get(matchDetails, 'incomingRecordType', ''),
        matchCriterion: this.getLabel(CRITERION_TYPES, get(matchDetails, 'matchCriterion', '')) || <NoValue />,
        existingMatchExpression: {
          fields: [
            {
              label: 'field',
              value: getFieldMatched(existingField, matchProfile.existingRecordType) || <NoValue />,
            },
          ],
          dataValueType: this.getLabel(VALUE_TYPES, get(existingMatchExpression, 'dataValueType', '')) || <NoValue />,
          qualifier: {
            qualifierType: this.getLabel(QUALIFIER_TYPES, get(existingMatchExpression, ['qualifier', 'qualifierType'])),
            qualifierValue: get(existingMatchExpression, ['qualifier', 'qualifierValue']),
            comparisonPart: this.getLabel(COMPARISON_PARTS, get(existingMatchExpression, ['qualifier', 'comparisonPart'])),
          },
        },
        existingRecordType: get(matchDetails, 'existingRecordType', ''),
      }],
    };
    const existingRecordLabel = <FormattedMessage id={FOLIO_RECORD_TYPES[matchProfile.existingRecordType].captionId} />;
    const componentsProps = {
      'panel-existing': {
        id: 'panel-existing-view',
        existingRecordType: matchProfile.existingRecordType,
        isEditable: false,
      },
      'existing-record-section': {
        label: (
          <FormattedMessage
            id="ui-data-import.match.existing.record"
            values={{ recordType: existingRecordLabel }}
          />
        ),
      },
      'existing-record-field': {
        label: (
          <FormattedMessage
            id="ui-data-import.match.existing.record.field"
            values={{ recordType: existingRecordLabel }}
          />
        ),
      },
    };

    return (
      <Pane
        renderHeader={this.renderPaneHeader}
        defaultWidth="620px"
        fluidContentWidth
      >
        <TitleManager record={matchProfile.name} />
        <Headline
          data-test-headline
          size="xx-large"
          tag="h2"
        >
          {matchProfile.name}
        </Headline>
        <AccordionSet>
          <Accordion label={<FormattedMessage id="ui-data-import.summary" />}>
            <ViewMetaData
              metadata={matchProfile.metadata}
              systemId={SYSTEM_USER_ID}
              systemUser={SYSTEM_USER_NAME}
            />
            <KeyValue label={<FormattedMessage id="ui-data-import.description" />}>
              <div data-test-description>{matchProfile.description || '-'}</div>
            </KeyValue>
          </Accordion>
          {tagsEnabled && (
            <div data-test-tags-accordion>
              <TagsAccordion link={tagsEntityLink} />
            </div>
          )}
          <div className={styles.details}>
            <FlexibleForm
              component="Fragment"
              config={formConfig}
              styles={styles}
              record={record}
              componentsProps={componentsProps}
            />
          </div>
          <Accordion
            label={<FormattedMessage id="ui-data-import.settings.associatedJobProfiles" />}
            displayWhenOpen={(
              <Button>
                <FormattedMessage id="ui-data-import.options" />
              </Button>
            )}
          >
            <ProfileAssociator
              entityKey={ENTITY_KEYS.JOB_PROFILES}
              namespaceKey="AJP"
              parentType={PROFILE_TYPES.MATCH_PROFILE}
              masterType={PROFILE_TYPES.JOB_PROFILE}
              detailType={PROFILE_TYPES.MATCH_PROFILE}
              contentData={associations}
              hasLoaded={hasLoaded}
              record={matchProfile}
              isMultiSelect
              isMultiLink
            />
          </Accordion>
        </AccordionSet>
        <EndOfItem
          className={sharedCss.endOfRecord}
          title={<FormattedMessage id="ui-data-import.endOfRecord" />}
        />
        <ConfirmationModal
          id="delete-match-profile-modal"
          open={showDeleteConfirmation}
          heading={(
            <FormattedMessage
              id="ui-data-import.modal.matchProfile.delete.header"
              values={{ name: matchProfile.name }}
            />
          )}
          message={<FormattedMessage id="ui-data-import.modal.matchProfile.delete.message" />}
          confirmLabel={<FormattedMessage id="ui-data-import.delete" />}
          cancelLabel={<FormattedMessage id="ui-data-import.cancel" />}
          onConfirm={() => this.handleDelete(matchProfile)}
          onCancel={this.hideDeleteConfirmation}
        />
      </Pane>
    );
  }
}
