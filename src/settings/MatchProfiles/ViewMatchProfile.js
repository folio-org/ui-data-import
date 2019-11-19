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
  Accordion,
  AccordionSet,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  ViewMetaData,
  withTags,
  TagsAccordion,
} from '@folio/stripes/smart-components';

import { createLayerURL } from '../../utils';
import {
  LAYER_TYPES,
  ENTITY_KEYS,
  SYSTEM_USER_ID,
  SYSTEM_USER_NAME,
  PROFILE_TYPES,
  COMPARISON_PARTS,
  QUALIFIER_TYPES,
  CRITERION_TYPES,
  VALUE_TYPES,
  RECORD_TYPES,
} from '../../utils/constants';
import {
  Spinner,
  EndOfItem,
  ActionMenu,
  AssociatedJobProfiles,
  FlexibleForm,
} from '../../components';
import { LastMenu } from '../../components/ActionMenu/ItemTemplates/LastMenu';

import sharedCss from '../../shared.css';
import styles from './ViewMatchProfile.css';
import { formConfigSamples } from '../../../test/bigtest/mocks';

const formName = 'matchProfilesForm';

@stripesConnect
@withTags
export class ViewMatchProfile extends Component {
  static manifest = Object.freeze({
    matchProfile: {
      type: 'okapi',
      path: 'data-import-profiles/matchProfiles/:{id}',
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
    location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
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

  renderLastMenu = record => (
    <LastMenu
      caption="ui-data-import.edit"
      location={createLayerURL(this.props.location, LAYER_TYPES.EDIT)}
      style={{ visibility: !record ? 'hidden' : 'visible' }}
      dataAttributes={{ 'data-test-edit-item-button': '' }}
    />
  );

  getValue = (fields, label) => {
    const field = fields.find(item => item.label === label);

    return (!isEmpty(field) && !!field.value.trim()) ? field.value : '-';
  };

  getLabel = (elements, label) => {
    const element = elements.find(item => item.value === label);

    return !isEmpty(element) ? <FormattedMessage id={element.label} /> : '-';
  };

  render() {
    const {
      onClose,
      paneId,
      tagsEnabled,
    } = this.props;
    const { showDeleteConfirmation } = this.state;

    const {
      hasLoaded,
      record: matchProfile,
    } = this.matchProfileData;

    if (!matchProfile || !hasLoaded) {
      return <Spinner entity={this} />;
    }

    const paneTitle = (
      <AppIcon
        size="small"
        app="data-import"
        iconKey="matchProfiles"
      >
        {matchProfile.name}
      </AppIcon>
    );

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
    const matchDetails = matchProfile.matchDetails[0];
    const {
      incomingMatchExpression,
      existingMatchExpression,
    } = matchDetails;

    const componentsProps = {
      existingType: {
        record: {
          captionId: 'ui-data-import.recordTypes.instance',
          iconKey: 'instance',
          type: 'INSTANCE',
        },
      },
      existingRecordSection: {
        label: (
          <FormattedMessage
            id="ui-data-import.match.existing.record"
            values={{ recordType: RECORD_TYPES[matchDetails.existingRecordType] }}
          />
        ),
      },
      existingRecordField: {
        label: (
          <FormattedMessage
            id="ui-data-import.match.existing.record.field"
            values={{ recordType: RECORD_TYPES[matchDetails.existingRecordType] }}
          />
        ),
      },
      marcRecordFieldMain: { value: this.getValue(incomingMatchExpression.fields, 'field') },
      marcRecordFieldIn1: { value: this.getValue(incomingMatchExpression.fields, 'indicator1') },
      marcRecordFieldIn2: { value: this.getValue(incomingMatchExpression.fields, 'indicator2') },
      marcRecordFieldSubfield: { value: this.getValue(incomingMatchExpression.fields, 'recordSubfield') },
      criterionIncomingQualifierTerm: { value: this.getLabel(QUALIFIER_TYPES, get(incomingMatchExpression, ['qualifier', 'qualifierType'])) },
      criterionIncomingQualifierValue: { value: get(incomingMatchExpression, ['qualifier', 'qualifierValue'], '-') },
      criterionIncomingValuePart: { value: this.getLabel(COMPARISON_PARTS, get(incomingMatchExpression, ['qualifier', 'comparisonPart'])) },
      criterionType: { value: this.getLabel(CRITERION_TYPES, matchDetails.matchCriterion) },
      valueType: { value: this.getLabel(VALUE_TYPES, existingMatchExpression.dataValueType) },
      criterionExistingQualifierTerm: { value: this.getLabel(QUALIFIER_TYPES, get(existingMatchExpression, ['qualifier', 'qualifierType'])) },
      criterionExistingQualifierValue: { value: get(existingMatchExpression, ['qualifier', 'qualifierValue'], '-') },
      criterionExistingValuePart: { value: this.getLabel(COMPARISON_PARTS, get(existingMatchExpression, ['qualifier', 'comparisonPart'])) },
    };

    return (
      <Pane
        id={paneId}
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={paneTitle}
        paneSub={<FormattedMessage id="ui-data-import.matchProfileName" />}
        actionMenu={this.renderActionMenu}
        lastMenu={this.renderLastMenu(matchProfile)}
        dismissible
        onClose={onClose}
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
              component="Accordion"
              id="match-profiles-view"
              label={<FormattedMessage id="ui-data-import.details" />}
              config={formConfig}
              styles={styles}
              record={matchProfile}
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
            <AssociatedJobProfiles detailType={PROFILE_TYPES.MATCH_PROFILE} />
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
