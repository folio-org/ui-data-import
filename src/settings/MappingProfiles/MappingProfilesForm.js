import React, {
  useMemo,
  useState,
  useEffect,
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
  change,
} from 'redux-form';
import {
  get,
  identity,
} from 'lodash';

import {
  Select,
  Headline,
  TextArea,
  TextField,
  Accordion,
  AccordionSet,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import {
  validateRequiredField,
  compose, withProfileWrapper,
} from '../../utils';
import {
  ENTITY_KEYS,
  LAYER_TYPES,
  PROFILE_TYPES,
} from '../../utils/constants';
import {
  FullScreenForm,
  FolioRecordTypeSelect,
  ProfileAssociator,
  INCOMING_RECORD_TYPES,
  FOLIO_RECORD_TYPES,
} from '../../components';

const formName = 'mappingProfilesForm';

export const MappingProfilesFormComponent = ({
  intl: { formatMessage },
  pristine,
  submitting,
  initialValues,
  location: { search },
  handleSubmit,
  onCancel,
  dispatch,
}) => {
  const { profile } = initialValues;
  const getIncomingRecordTypesDataOptions = () => Object.entries(INCOMING_RECORD_TYPES)
    .map(([recordType, { captionId }]) => ({
      value: recordType,
      label: formatMessage({ id: captionId }),
    }));
  const getFolioRecordTypesDataOptions = () => Object.entries(FOLIO_RECORD_TYPES)
    .map(([recordType, { captionId }]) => ({
      value: recordType,
      label: formatMessage({ id: captionId }),
    }));

  const folioRecordTypesDataOptions = useMemo(getFolioRecordTypesDataOptions, []);
  const incomingRecordTypesDataOptions = useMemo(getIncomingRecordTypesDataOptions, []);
  const { layer } = queryString.parse(search);
  const isEditMode = layer === LAYER_TYPES.EDIT;
  const isSubmitDisabled = pristine || submitting;
  const paneTitle = isEditMode
    ? (
      <FormattedMessage id="ui-data-import.edit">
        {txt => `${txt} ${profile.name}`}
      </FormattedMessage>
    )
    : <FormattedMessage id="ui-data-import.settings.mappingProfiles.new" />;
  const headLine = isEditMode
    ? profile.name
    : <FormattedMessage id="ui-data-import.settings.mappingProfiles.new" />;
  const associations = [
    ...[],
    ...get(initialValues, ['profile', 'parentProfiles'], []),
    ...get(initialValues, ['profile', 'childProfiles'], []),
  ];

  const [addedRelations, setAddedRelations] = useState([]);
  const [deletedRelations, setDeletedRelations] = useState([]);

  useEffect(() => {
    dispatch(change(formName, 'addedRelations', addedRelations));
  }, [addedRelations]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(change(formName, 'deletedRelations', deletedRelations));
  }, [deletedRelations]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FullScreenForm
      id="mapping-profiles-form"
      paneTitle={paneTitle}
      submitMessage={<FormattedMessage id="ui-data-import.saveAsProfile" />}
      isSubmitDisabled={isSubmitDisabled}
      onSubmit={handleSubmit}
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
              name="profile.name"
              required
              component={TextField}
              validate={[validateRequiredField]}
            />
          </div>
          <div data-test-incoming-record-type-field>
            <FormattedMessage id="ui-data-import.chooseIncomingRecordType">
              {placeholder => (
                <Field
                  label={<FormattedMessage id="ui-data-import.incomingRecordType" />}
                  name="profile.incomingRecordType"
                  component={Select}
                  required
                  itemToString={identity}
                  validate={[validateRequiredField]}
                  dataOptions={incomingRecordTypesDataOptions}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </div>
          <FolioRecordTypeSelect
            fieldName="existingRecordType"
            dataOptions={folioRecordTypesDataOptions}
          />
          <div data-test-description-field>
            <Field
              label={<FormattedMessage id="ui-data-import.description" />}
              name="profile.description"
              component={TextArea}
            />
          </div>
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-data-import.details" />}
          separator={false}
        >
          <div>
            {/* will be implemented in the future */}
          </div>
        </Accordion>
        <Accordion
          id="mappingProfileFormAssociatedActionProfileAccordion"
          label={<FormattedMessage id="ui-data-import.settings.associatedActionProfiles" />}
          separator={false}
        >
          <ProfileAssociator
            entityKey={ENTITY_KEYS.ACTION_PROFILES}
            namespaceKey="AAP"
            parentId={profile.id}
            parentType={PROFILE_TYPES.MAPPING_PROFILE}
            masterType={PROFILE_TYPES.ACTION_PROFILE}
            detailType={PROFILE_TYPES.MAPPING_PROFILE}
            profileName={profile.name}
            contentData={associations}
            hasLoaded
            isMultiSelect
            isMultiLink={false}
            relationsToAdd={addedRelations}
            relationsToDelete={deletedRelations}
            onLink={setAddedRelations}
            onUnlink={setDeletedRelations}
          />
        </Accordion>
      </AccordionSet>
    </FullScreenForm>
  );
};

MappingProfilesFormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired || PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export const MappingProfilesForm = compose(
  injectIntl,
  withProfileWrapper,
  stripesForm({
    form: formName,
    navigationCheck: true,
    enableReinitialize: true,
  }),
)(MappingProfilesFormComponent);
