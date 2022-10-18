import React, {
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { Field } from 'react-final-form';
import {
  get,
  isEqual,
  omit,
  pick,
} from 'lodash';

import {
  Headline,
  TextArea,
  TextField,
  Accordion,
  AccordionSet,
  ConfirmationModal,
  Select,
  AccordionStatus,
} from '@folio/stripes/components';
import { FullScreenForm } from '@folio/stripes-data-transfer-components';
import stripesFinalForm from '@folio/stripes/final-form';

import {
  compose,
  withProfileWrapper,
  validateRequiredField,
  isFieldPristine,
  handleProfileSave,
  ENTITY_KEYS,
  LAYER_TYPES,
  PROFILE_TYPES,
  FOLIO_RECORD_TYPES_TO_DISABLE,
} from '../../utils';
import {
  EditKeyShortcutsWrapper,
  FolioRecordTypeSelect,
  ACTION_TYPES_SELECT,
  ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES,
  ProfileAssociator,
} from '../../components';

export const ActionProfilesFormComponent = ({
  intl: { formatMessage },
  pristine,
  submitting,
  initialValues,
  handleSubmit,
  form,
  onCancel,
  accordionStatusRef,
  layerType,
  transitionToParams,
  baseUrl,
}) => {
  const { profile } = initialValues;
  const associatedJobProfiles = profile.parentProfiles || [];
  const associatedJobProfilesAmount = associatedJobProfiles.length;

  const [action, setAction] = useState(profile.action || '');
  const [folioRecord, setFolioRecord] = useState(profile.folioRecord || '');
  const [isConfirmEditModalOpen, setConfirmModalOpen] = useState(false);

  const addedRelations = form.getState().values.addedRelations || [];
  const deletedRelations = form.getState().values.deletedRelations || [];

  const addRelations = relations => {
    form.change('addedRelations', relations);
  };

  const deleteRelations = relations => {
    form.change('deletedRelations', relations);
  };

  const getFilteredActions = () => {
    switch (folioRecord) {
      case ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.ORDER.type: {
        return pick(ACTION_TYPES_SELECT, ACTION_TYPES_SELECT.CREATE.type);
      }
      case ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.INVOICE.type: {
        return pick(ACTION_TYPES_SELECT, ACTION_TYPES_SELECT.CREATE.type);
      }
      case ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.ITEM.type: {
        return pick(ACTION_TYPES_SELECT, [
          ACTION_TYPES_SELECT.CREATE.type,
          ACTION_TYPES_SELECT.UPDATE.type,
        ]);
      }
      case ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.MARC_AUTHORITY.type: {
        return pick(ACTION_TYPES_SELECT, ACTION_TYPES_SELECT.UPDATE.type);
      }
      default: {
        return ACTION_TYPES_SELECT;
      }
    }
  };

  const getActionsDataOptions = () => Object.entries(getFilteredActions())
    .map(([recordType, { captionId }]) => ({
      value: recordType,
      label: formatMessage({ id: captionId }),
    }));

  const getFilteredFolioRecordTypes = () => {
    switch (action) {
      case ACTION_TYPES_SELECT.MODIFY.type: {
        return pick(ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES, [
          ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.MARC_AUTHORITY.type,
          ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC.type,
          ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.MARC_HOLDINGS.type,
        ]);
      }
      case ACTION_TYPES_SELECT.UPDATE.type: {
        return omit(ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES, ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.ORDER.type);
      }
      case ACTION_TYPES_SELECT.CREATE.type:
      default: {
        return ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES;
      }
    }
  };

  const getFolioRecordTypesDataOptions = () => Object.entries(getFilteredFolioRecordTypes())
    .map(([recordType, { captionId }]) => {
      // TODO: Disabling options should be removed after implementation is done
      const isOptionDisabled = FOLIO_RECORD_TYPES_TO_DISABLE.some(option => option === recordType);

      return {
        value: recordType,
        label: formatMessage({ id: captionId }),
        disabled: isOptionDisabled,
      };
    });
  const actionsDataOptions = useMemo(getActionsDataOptions, [folioRecord]);
  const folioRecordTypesDataOptions = useMemo(getFolioRecordTypesDataOptions, [action]);
  const isEditMode = layerType === LAYER_TYPES.EDIT;
  const isSubmitDisabled = pristine || submitting;

  const paneTitle = isEditMode ? (
    <FormattedMessage id="ui-data-import.edit">
      {txt => `${txt} ${profile.name}`}
    </FormattedMessage>
  ) : <FormattedMessage id="ui-data-import.settings.actionProfiles.new" />;
  const headLine = isEditMode ? profile.name : <FormattedMessage id="ui-data-import.settings.actionProfiles.new" />;
  const editWithModal = isEditMode && associatedJobProfilesAmount;
  const associations = [
    ...[],
    ...get(initialValues, ['profile', 'parentProfiles'], []),
    ...get(initialValues, ['profile', 'childProfiles'], []),
  ];

  const onSubmit = async event => {
    if (editWithModal) {
      event.preventDefault();
      setConfirmModalOpen(true);
    } else {
      await handleProfileSave(handleSubmit, form.reset, transitionToParams, baseUrl)(event);
    }
  };

  const onRecordSelect = value => {
    if (value === ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.MARC_AUTHORITY.type) {
      form.change('profile.action', ACTION_TYPES_SELECT.UPDATE.type);
    }

    setFolioRecord(value);
  };

  return (
    <EditKeyShortcutsWrapper onSubmit={onSubmit}>
      <FullScreenForm
        id="action-profiles-form"
        paneTitle={paneTitle}
        submitButtonText={<FormattedMessage id="ui-data-import.saveAsProfile" />}
        cancelButtonText={<FormattedMessage id="ui-data-import.close" />}
        isSubmitButtonDisabled={isSubmitDisabled}
        onSubmit={onSubmit}
        onCancel={onCancel}
      >
        <Headline
          size="xx-large"
          tag="h2"
          data-test-header-title
        >
          {headLine}
        </Headline>
        <AccordionStatus ref={accordionStatusRef}>
          <AccordionSet>
            <Accordion
              label={<FormattedMessage id="ui-data-import.summary" />}
              separator={false}
            >
              <div data-test-name-field>
                <Field
                  label={<FormattedMessage id="ui-data-import.name" />}
                  name="profile.name"
                  required
                  component={TextField}
                  validate={validateRequiredField}
                  isEqual={isFieldPristine}
                />
              </div>
              <div data-test-description-field>
                <Field
                  label={<FormattedMessage id="ui-data-import.description" />}
                  name="profile.description"
                  component={TextArea}
                  isEqual={isFieldPristine}
                />
              </div>
            </Accordion>
            <Accordion
              label={<FormattedMessage id="ui-data-import.details" />}
              separator={false}
            >
              <div data-test-action-field>
                <FormattedMessage id="ui-data-import.selectAction">
                  {([placeholder]) => (
                    <Field
                      name="profile.action"
                      validate={validateRequiredField}
                      render={fieldProps => (
                        <Select
                          {...fieldProps}
                          label={<FormattedMessage id="ui-data-import.action" />}
                          dataOptions={actionsDataOptions}
                          placeholder={placeholder}
                          onChange={event => {
                            const value = event.target.value;

                            fieldProps.input.onChange(value);
                            setAction(value);
                          }}
                          required
                        />
                      )}
                    />
                  )}
                </FormattedMessage>
              </div>
              <FolioRecordTypeSelect
                fieldName="folioRecord"
                dataOptions={folioRecordTypesDataOptions}
                onRecordSelect={onRecordSelect}
              />
            </Accordion>
            <Accordion
              id="actionProfileFormAssociatedMappingProfileAccordion"
              label={<FormattedMessage id="ui-data-import.settings.associatedMappingProfile" />}
              separator={false}
            >
              <ProfileAssociator
                entityKey={ENTITY_KEYS.MAPPING_PROFILES}
                namespaceKey="AMP"
                parentId={profile.id}
                parentType={PROFILE_TYPES.ACTION_PROFILE}
                masterType={PROFILE_TYPES.ACTION_PROFILE}
                detailType={PROFILE_TYPES.MAPPING_PROFILE}
                profileType={ENTITY_KEYS.ACTION_PROFILES}
                profileName={profile.name}
                contentData={associations}
                hasLoaded
                isMultiSelect={false}
                isMultiLink
                relationsToAdd={addedRelations}
                relationsToDelete={deletedRelations}
                onLink={addRelations}
                onUnlink={deleteRelations}
                isEditMode={isEditMode}
              />
              <Field
                name="addedRelations"
                component={() => null}
              />
              <Field
                name="deletedRelations"
                component={() => null}
              />
            </Accordion>
            {isEditMode && (
              <Accordion
                id="actionProfileFormAssociatedJobProfileAccordion"
                label={<FormattedMessage id="ui-data-import.settings.associatedJobProfiles" />}
                separator={false}
              >
                <ProfileAssociator
                  entityKey={ENTITY_KEYS.JOB_PROFILES}
                  namespaceKey="AJP"
                  parentId={profile.id}
                  parentType={PROFILE_TYPES.ACTION_PROFILE}
                  masterType={PROFILE_TYPES.JOB_PROFILE}
                  detailType={PROFILE_TYPES.ACTION_PROFILE}
                  profileType={ENTITY_KEYS.ACTION_PROFILES}
                  profileName={profile.name}
                  contentData={associations}
                  record={initialValues}
                  hasLoaded
                  isMultiSelect={false}
                  isMultiLink
                  useSearch={false}
                  isEditMode={isEditMode}
                />
              </Accordion>
            )}
          </AccordionSet>
        </AccordionStatus>
        <ConfirmationModal
          id="confirm-edit-action-profile-modal"
          open={isConfirmEditModalOpen}
          heading={<FormattedMessage id="ui-data-import.settings.actionProfiles.confirmEditModal.heading" />}
          message={(
            <FormattedMessage
              id="ui-data-import.settings.actionProfiles.confirmEditModal.message"
              values={{ amount: associatedJobProfilesAmount }}
            />
          )}
          confirmLabel={<FormattedMessage id="ui-data-import.confirm" />}
          onConfirm={async () => {
            await handleProfileSave(handleSubmit, form.reset, transitionToParams, baseUrl)();

            setConfirmModalOpen(false);
          }}
          onCancel={() => setConfirmModalOpen(false)}
        />
      </FullScreenForm>
    </EditKeyShortcutsWrapper>
  );
};

ActionProfilesFormComponent.propTypes = {
  intl: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getState: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
  transitionToParams: PropTypes.func.isRequired,
  baseUrl: PropTypes.string.isRequired,
  match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
  onCancel: PropTypes.func.isRequired,
  location: PropTypes.oneOfType([
    PropTypes.shape({
      search: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    PropTypes.string.isRequired,
  ]),
  accordionStatusRef: PropTypes.object,
  layerType: PropTypes.string,
};

export const ActionProfilesForm = compose(
  injectIntl,
  withProfileWrapper,
  stripesFinalForm({
    navigationCheck: true,
    initialValuesEqual: isEqual,
  }),
)(ActionProfilesFormComponent);
