import React, {
  useState,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import {
  Field,
  formValueSelector,
} from 'redux-form';
import { connect } from 'react-redux';
import {
  get,
  identity,
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
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import { FullScreenForm } from '../../components/FullScreenForm';
import {
  compose,
  validateRequiredField,
} from '../../utils';
import { LAYER_TYPES } from '../../utils/constants';
import {
  FolioRecordTypeSelect,
  ReactToSelect,
  ACTION_TYPES_SELECT,
  ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES,
} from '../../components';

const formName = 'actionProfilesForm';

export const ActionProfilesFormComponent = ({
  intl: { formatMessage },
  pristine,
  submitting,
  initialValues,
  handleSubmit,
  location: { search },
  associatedJobProfilesAmount,
  onCancel,
  action,
  folioRecord,
}) => {
  const [isConfirmEditModalOpen, setConfirmModalOpen] = useState(false);

  const getFilteredActions = () => {
    switch (folioRecord) {
      case ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.ORDER.type: {
        return pick(ACTION_TYPES_SELECT, ACTION_TYPES_SELECT.CREATE.type);
      }
      case ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.INVOICE.type: {
        return pick(ACTION_TYPES_SELECT, [
          ACTION_TYPES_SELECT.CREATE.type,
          ACTION_TYPES_SELECT.COMBINE.type,
        ]);
      }
      case ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.INSTANCE.type:
      case ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.HOLDINGS.type:
      case ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.ITEM.type: {
        return pick(ACTION_TYPES_SELECT, [
          ACTION_TYPES_SELECT.CREATE.type,
          ACTION_TYPES_SELECT.COMBINE.type,
          ACTION_TYPES_SELECT.REPLACE.type,
        ]);
      }
      case ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC.type:
      case ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.MARC_HOLDINGS.type:
      case ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.MARC_AUTHORITY.type:
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
      case ACTION_TYPES_SELECT.COMBINE.type: {
        return omit(ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES, ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.ORDER.type);
      }
      case ACTION_TYPES_SELECT.MODIFY.type: {
        return pick(ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES, [
          ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.MARC_AUTHORITY.type,
          ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC.type,
          ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.MARC_HOLDINGS.type,
        ]);
      }
      case ACTION_TYPES_SELECT.REPLACE.type: {
        return omit(ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES, [
          ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.ORDER.type,
          ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES.INVOICE.type,
        ]);
      }
      case ACTION_TYPES_SELECT.CREATE.type:
      default: {
        return ACTION_PROFILES_FORM_FOLIO_RECORD_TYPES;
      }
    }
  };

  const getFolioRecordTypesDataOptions = () => Object.entries(getFilteredFolioRecordTypes())
    .map(([recordType, { captionId }]) => ({
      value: recordType,
      label: formatMessage({ id: captionId }),
    }));
  const actionsDataOptions = useMemo(getActionsDataOptions, [folioRecord]);
  const folioRecordTypesDataOptions = useMemo(getFolioRecordTypesDataOptions, [action]);
  const { layer } = queryString.parse(search);
  const isEditMode = layer === LAYER_TYPES.EDIT;
  const isSubmitDisabled = pristine || submitting;

  const paneTitle = isEditMode ? (
    <FormattedMessage id="ui-data-import.edit">
      {txt => `${txt} ${initialValues.name}`}
    </FormattedMessage>
  ) : <FormattedMessage id="ui-data-import.settings.actionProfiles.new" />;
  const headLine = isEditMode ? initialValues.name : <FormattedMessage id="ui-data-import.settings.actionProfiles.new" />;
  const editWithModal = isEditMode && associatedJobProfilesAmount;

  const onSubmit = e => {
    if (editWithModal) {
      e.preventDefault();
      setConfirmModalOpen(true);
    } else {
      handleSubmit(e);
    }
  };

  return (
    <FullScreenForm
      id="action-profiles-form"
      paneTitle={paneTitle}
      submitMessage={<FormattedMessage id="ui-data-import.saveAsProfile" />}
      isSubmitDisabled={isSubmitDisabled}
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
      <AccordionSet>
        <Accordion
          label={<FormattedMessage id="ui-data-import.summary" />}
          separator={false}
        >
          <div data-test-name-field>
            <Field
              label={<FormattedMessage id="ui-data-import.name" />}
              name="name"
              required
              component={TextField}
              validate={[validateRequiredField]}
            />
          </div>
          <div data-test-description-field>
            <Field
              label={<FormattedMessage id="ui-data-import.description" />}
              name="description"
              component={TextArea}
            />
          </div>
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-data-import.details" />}
          separator={false}
        >
          <div data-test-react-to-field>
            <Field
              label={<FormattedMessage id="ui-data-import.reactTo" />}
              name="reactTo"
              required
              validate={[validateRequiredField]}
              component={ReactToSelect}
            />
          </div>
          <div data-test-action-field>
            <FormattedMessage id="ui-data-import.selectAction">
              {placeholder => (
                <Field
                  label={<FormattedMessage id="ui-data-import.action" />}
                  name="action"
                  component={Select}
                  required
                  itemToString={identity}
                  validate={[validateRequiredField]}
                  dataOptions={actionsDataOptions}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </div>
          <FolioRecordTypeSelect dataOptions={folioRecordTypesDataOptions} />
        </Accordion>
        {isEditMode || (
          <Accordion
            id="actionProfileFormAssociatedMappingProfileAccordion"
            label={<FormattedMessage id="ui-data-import.settings.actionProfiles.associatedMappingProfile" />}
            separator={false}
          >
            <div>
              {/* will be implemented in https://issues.folio.org/browse/UIDATIMP-208 */}
            </div>
          </Accordion>
        )}
      </AccordionSet>
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
        onConfirm={() => {
          handleSubmit();
          setConfirmModalOpen(false);
        }}
        onCancel={() => setConfirmModalOpen(false)}
      />
    </FullScreenForm>
  );
};

ActionProfilesFormComponent.propTypes = {
  intl: intlShape.isRequired,
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  associatedJobProfilesAmount: PropTypes.number.isRequired,
  action: PropTypes.string,
  folioRecord: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
};

const selector = formValueSelector(formName);

const mapStateToProps = state => {
  const { length: associatedJobProfilesAmount } = get(
    state,
    ['folio_data_import_associated_job_profiles', 'records', 0, 'childSnapshotWrappers'],
    [],
  );
  const action = selector(state, 'action');
  const folioRecord = selector(state, 'folioRecord');

  return {
    associatedJobProfilesAmount,
    action,
    folioRecord,
  };
};

export const ActionProfilesForm = compose(
  injectIntl,
  stripesForm({
    form: formName,
    navigationCheck: true,
    enableReinitialize: true,
  }),
  connect(mapStateToProps),
)(ActionProfilesFormComponent);
