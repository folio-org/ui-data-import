import React, {
  useMemo,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { Field } from 'react-final-form';
import {
  isEmpty,
  isEqual,
} from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';
import { stripesShape } from '@folio/stripes/core';
import {
  Headline,
  AccordionSet,
  AccordionStatus,
  Accordion,
  ExpandAllButton,
  TextField,
  Select,
  TextArea,
  Col,
  Row,
  ConfirmationModal,
} from '@folio/stripes/components';
import { FullScreenForm } from '@folio/stripes-data-transfer-components';

import {
  INCOMING_RECORD_TYPES,
  FOLIO_RECORD_TYPES,
  FolioRecordTypeSelect,
  ProfileAssociator,
  MappedHeader,
  EditKeyShortcutsWrapper,
} from '../../components';
import {
  MappingInstanceDetails,
  MappingHoldingsDetails,
  MappingItemDetails,
  MappingMARCBibDetails,
  MappingInvoiceDetails,
} from './detailsSections/edit';

import {
  getInitialDetails,
  getInitialFields,
  getReferenceTables,
} from './initialDetails';
import {
  handleProfileSave,
  compose,
  withProfileWrapper,
  validateRequiredField,
  isMARCType,
  ENTITY_KEYS,
  LAYER_TYPES,
  PROFILE_TYPES,
  MAPPING_DETAILS_HEADLINE,
  MARC_TYPES,
  FIELD_MAPPINGS_FOR_MARC,
  FIELD_MAPPINGS_FOR_MARC_OPTIONS,
  fillEmptyFieldsWithValue,
  createOptionsList,
  isFieldPristine,
  FOLIO_RECORD_TYPES_TO_DISABLE,
  INCOMING_RECORD_TYPES_TO_DISABLE,
} from '../../utils';

import styles from './MappingProfiles.css';

export const MappingProfilesFormComponent = ({
  pristine,
  submitting,
  parentResources: { marcFieldProtectionSettings: { records: marcFieldProtectionSettings = [] } },
  stripes: { okapi },
  location: { search },
  initialValues,
  handleSubmit,
  form,
  onCancel,
  intl,
  accordionStatusRef,
  transitionToParams,
  match: { path },
}) => {
  const { formatMessage } = intl;
  const { layer } = queryString.parse(search);

  const {
    profile,
    profile: {
      id,
      name,
      existingRecordType,
      parentProfiles = [],
      childProfiles = [],
    },
    addedRelations: initialAddedRelations,
    deletedRelations: initialDeletedRelations,
  } = initialValues;
  const mappingDetails = form.getState().values.profile?.mappingDetails;
  const marcMappingOption = mappingDetails?.marcMappingOption;
  const mappingMarcFieldProtectionFields = form.getState().values.profile?.mappingMarcFieldProtectionFields || [];
  const referenceTables = getReferenceTables(mappingDetails?.mappingFields || []);

  const isEditMode = layer === LAYER_TYPES.EDIT;
  const isSubmitDisabled = pristine || submitting;

  const [folioRecordType, setFolioRecordType] = useState(existingRecordType || null);
  const [fieldMappingsForMARCSelectedOption, setFieldMappingsForMARCSelectedOption] = useState('');
  const [fieldMappingsForMARC, setFieldMappingsForMARC] = useState(marcMappingOption || '');
  const [addedRelations, setAddedRelations] = useState(initialAddedRelations || []);
  const [deletedRelations, setDeletedRelations] = useState(initialDeletedRelations || []);
  const [prevExistingRecordType, setPrevExistingRecordType] = useState(existingRecordType);
  const [initials, setInitials] = useState({
    ...profile,
    mappingDetails: isEmpty(mappingDetails) ? getInitialDetails(prevExistingRecordType, true) : mappingDetails,
  });
  const [isConfirmEditModalOpen, setConfirmModalOpen] = useState(false);

  useLayoutEffect(() => {
    const isRecordTypeTheSame = folioRecordType === prevExistingRecordType;
    const needsUpdate = !id || (id && (!isRecordTypeTheSame || isEmpty(mappingDetails)));

    if (!needsUpdate) {
      return;
    }

    const newInitDetails = folioRecordType === existingRecordType && !isEmpty(mappingDetails)
      ? mappingDetails
      : getInitialDetails(folioRecordType, true);

    const newInitials = {
      ...initials,
      mappingDetails: newInitDetails,
    };

    setInitials(newInitials);
    form.change('profile.mappingDetails', newInitDetails);

    if (!isRecordTypeTheSame) {
      setPrevExistingRecordType(folioRecordType);
    }
  }, [folioRecordType]); // eslint-disable-line react-hooks/exhaustive-deps

  const paneTitle = isEditMode
    ? (
      <FormattedMessage id="ui-data-import.edit">
        {txt => `${txt} ${name}`}
      </FormattedMessage>
    )
    : <FormattedMessage id="ui-data-import.settings.mappingProfiles.new" />;

  const headLine = isEditMode ? name : <FormattedMessage id="ui-data-import.settings.mappingProfiles.new" />;

  const associations = [
    ...parentProfiles,
    ...childProfiles,
  ];

  const initialFields = getInitialFields(folioRecordType);

  const getIncomingRecordTypesDataOptions = () => Object.entries(INCOMING_RECORD_TYPES)
    .map(([recordType, { captionId }]) => {
      // TODO: Disabling options should be removed after implementation is done
      const isOptionDisabled = INCOMING_RECORD_TYPES_TO_DISABLE.some(option => option === recordType);

      return {
        value: recordType,
        label: formatMessage({ id: captionId }),
        disabled: isOptionDisabled,
      };
    });
  const getFolioRecordTypesDataOptions = () => Object.entries(FOLIO_RECORD_TYPES)
    .map(([recordType, { captionId }]) => {
      // TODO: Disabling options should be removed after implementation is done
      const isOptionDisabled = FOLIO_RECORD_TYPES_TO_DISABLE.some(option => option === recordType);

      return {
        value: recordType,
        label: formatMessage({ id: captionId }),
        disabled: isOptionDisabled,
      };
    });

  const folioRecordTypesDataOptions = useMemo(getFolioRecordTypesDataOptions, []);
  const incomingRecordTypesDataOptions = useMemo(getIncomingRecordTypesDataOptions, []);

  const onSubmit = async event => {
    await handleProfileSave(handleSubmit, form.reset, transitionToParams, path)(event);
  };

  const addRelations = useCallback(relations => {
    form.change('addedRelations', relations);
    setAddedRelations(relations);
  }, [form]);

  const deleteRelations = useCallback(relations => {
    form.change('deletedRelations', relations);
    setDeletedRelations(relations);
  }, [form]);

  const setFormFieldValue = (fieldsPath, updatedValue) => {
    form.change(fieldsPath, updatedValue);
  };

  const getRepeatableFieldAction = mappingFieldIndex => {
    return mappingDetails?.mappingFields?.[mappingFieldIndex]?.repeatableFieldAction || '';
  };

  const getMappingSubfieldsFieldValue = (mappingFieldIndex, subfieldIndex, fieldIndex) => {
    return mappingDetails?.mappingFields?.[mappingFieldIndex]?.subfields[subfieldIndex]?.fields[fieldIndex]?.value || '';
  };

  const setInitialValuesForMARCUpdates = () => {
    const initialMARCMappingDetails = fillEmptyFieldsWithValue({},
      ['field.indicator1', 'field.indicator2', 'field.subfields[0].subfield'], '*');

    initialMARCMappingDetails.order = 0;
    setFormFieldValue('profile.mappingDetails.marcMappingDetails', [initialMARCMappingDetails]);
  };

  const setInitialValuesForMARCModifications = () => {
    const initialMARCMappingDetails = [{
      order: 0,
      field: { subfields: [{}] },
    }];

    setFormFieldValue('profile.mappingDetails.marcMappingDetails', initialMARCMappingDetails);
  };

  const resetMARCMappingDetails = () => {
    setFormFieldValue('profile.mappingDetails.marcMappingDetails', []);
  };

  const setInitialMARCMappingDetails = fieldMappingForMARC => {
    if (fieldMappingForMARC === FIELD_MAPPINGS_FOR_MARC.UPDATES) {
      resetMARCMappingDetails();
    }

    if (fieldMappingForMARC === FIELD_MAPPINGS_FOR_MARC.MODIFICATIONS) {
      setInitialValuesForMARCModifications();
    }
  };

  const handleFieldMappingsForMARCTypeChange = value => {
    if (fieldMappingsForMARC && value !== fieldMappingsForMARC) {
      setFieldMappingsForMARCSelectedOption(value);
      setConfirmModalOpen(true);
    } else {
      setFieldMappingsForMARC(value);
      setInitialMARCMappingDetails(value);
    }
  };

  const detailsProps = {
    initialFields,
    referenceTables,
    getRepeatableFieldAction,
    getMappingSubfieldsFieldValue,
    setReferenceTables: setFormFieldValue,
    okapi,
  };
  const MARCDetailsProps = {
    marcMappingDetails: mappingDetails?.marcMappingDetails,
    marcFieldProtectionFields: marcFieldProtectionSettings,
    mappingMarcFieldProtectionFields,
    fieldMappingsForMARCField: fieldMappingsForMARC,
    onUpdateFieldAdd: setInitialValuesForMARCUpdates,
    setReferenceTables: setFormFieldValue,
  };
  const invoiceDetailsProps = {
    ...detailsProps,
    mappingDetails,
  };

  const fieldMappingsForMARCOptions = createOptionsList(FIELD_MAPPINGS_FOR_MARC_OPTIONS, formatMessage);
  const fieldMappingsForMARCPreviousOption = fieldMappingsForMARC && formatMessage(
    { id: FIELD_MAPPINGS_FOR_MARC_OPTIONS.find(option => option.value === fieldMappingsForMARC)?.label },
  );
  const fieldMappingsForMARCCurrentOption = fieldMappingsForMARCSelectedOption && formatMessage(
    { id: FIELD_MAPPINGS_FOR_MARC_OPTIONS.find(option => option.value === fieldMappingsForMARCSelectedOption)?.label },
  );

  const renderDetails = {
    INSTANCE: <MappingInstanceDetails {...detailsProps} />,
    HOLDINGS: <MappingHoldingsDetails {...detailsProps} />,
    ITEM: <MappingItemDetails {...detailsProps} />,
    MARC_BIBLIOGRAPHIC: <MappingMARCBibDetails {...MARCDetailsProps} />,
    INVOICE: <MappingInvoiceDetails {...invoiceDetailsProps} />,
  };

  return (
    <>
      <EditKeyShortcutsWrapper onSubmit={onSubmit}>
        <FullScreenForm
          id="mapping-profiles-form"
          paneTitle={paneTitle}
          submitButtonText={<FormattedMessage id="ui-data-import.saveAsProfile" />}
          cancelButtonText={<FormattedMessage id="ui-data-import.close" />}
          isSubmitButtonDisabled={isSubmitDisabled}
          onSubmit={onSubmit}
          onCancel={onCancel}
          contentClassName={styles.mappingForm}
        >
          <Headline
            data-test-header-title
            id="profile-headline"
            size="xx-large"
            tag="h2"
          >
            {headLine}
          </Headline>
          <AccordionStatus ref={accordionStatusRef}>
            <AccordionSet>
              <Accordion
                id="summary"
                label={<FormattedMessage id="ui-data-import.summary" />}
                separator
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
                <div data-test-incoming-record-type-field>
                  <FormattedMessage id="ui-data-import.chooseIncomingRecordType">
                    {([placeholder]) => (
                      <Field
                        label={<FormattedMessage id="ui-data-import.incomingRecordType" />}
                        name="profile.incomingRecordType"
                        component={Select}
                        required
                        validate={validateRequiredField}
                        dataOptions={incomingRecordTypesDataOptions}
                        placeholder={placeholder}
                        isEqual={isFieldPristine}
                      />
                    )}
                  </FormattedMessage>
                </div>
                <Row>
                  <Col xs={6}>
                    <FolioRecordTypeSelect
                      fieldName="existingRecordType"
                      dataOptions={folioRecordTypesDataOptions}
                      onRecordSelect={value => {
                        setFolioRecordType(value);
                        setFieldMappingsForMARC('');
                      }}
                    />
                  </Col>
                  {folioRecordType === MARC_TYPES.MARC_BIBLIOGRAPHIC && (
                    <Col xs={6}>
                      <FormattedMessage id="ui-data-import.fieldMappingsForMarc.placeholder">
                        {([placeholder]) => (
                          <div data-test-field-mapping-foer-marc-field>
                            <Field
                              name="profile.mappingDetails.marcMappingOption"
                              validate={validateRequiredField}
                              isEqual={isFieldPristine}
                              render={fieldProps => (
                                <Select
                                  {...fieldProps}
                                  label={<FormattedMessage id="ui-data-import.fieldMappingsForMarc" />}
                                  dataOptions={fieldMappingsForMARCOptions}
                                  placeholder={placeholder}
                                  onChange={e => {
                                    const value = e.target.value;

                                    fieldProps.input.onChange(value);
                                    handleFieldMappingsForMARCTypeChange(value);
                                  }}
                                />
                              )}
                              required
                            />
                          </div>
                        )}
                      </FormattedMessage>
                    </Col>
                  )}
                </Row>
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
                id="mapping-profile-details"
                label={<FormattedMessage id="ui-data-import.details" />}
                separator={false}
              >
                {/*
                  Fragment is added to avoid warnings in a case when there is no data in the details section
                  since the `children` prop is required for the `Accordion` component
                */}
                <>
                  {folioRecordType && (
                    <AccordionStatus>
                      <Row
                        between="xs"
                        style={{ margin: 0 }}
                      >
                        {!isMARCType(folioRecordType) && (
                          <>
                            <Col>
                              <MappedHeader
                                headersToSeparate={[
                                  'ui-data-import.settings.profiles.select.mappingProfiles',
                                  MAPPING_DETAILS_HEADLINE[folioRecordType]?.labelId,
                                  FIELD_MAPPINGS_FOR_MARC_OPTIONS.find(option => option.value === fieldMappingsForMARC)?.label,
                                ]}
                                headlineProps={{ margin: 'small' }}
                              />
                            </Col>
                            <Col>
                              <div data-test-expand-all-button>
                                <ExpandAllButton />
                              </div>
                            </Col>
                          </>
                        )}
                      </Row>
                      {renderDetails[folioRecordType]}
                    </AccordionStatus>
                  )}
                </>
              </Accordion>
              <Accordion
                id="mappingProfileFormAssociatedActionProfileAccordion"
                label={<FormattedMessage id="ui-data-import.settings.associatedActionProfiles" />}
                separator
              >
                <ProfileAssociator
                  entityKey={ENTITY_KEYS.ACTION_PROFILES}
                  namespaceKey="AAP"
                  parentId={id}
                  parentType={PROFILE_TYPES.MAPPING_PROFILE}
                  masterType={PROFILE_TYPES.ACTION_PROFILE}
                  detailType={PROFILE_TYPES.MAPPING_PROFILE}
                  profileName={name}
                  contentData={associations}
                  hasLoaded
                  isMultiSelect
                  isMultiLink={false}
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
            </AccordionSet>
          </AccordionStatus>
          <ConfirmationModal
            id="confirm-marc-type-change"
            open={isConfirmEditModalOpen}
            heading={<FormattedMessage id="ui-data-import.settings.mappingProfile.marcTable.MARCTypeChange.confirmationModal.header" />}
            message={(
              <FormattedMessage
                id="ui-data-import.settings.mappingProfile.marcTable.MARCTypeChange.confirmationModal.message"
                values={{
                  previousType: fieldMappingsForMARCPreviousOption,
                  currentType: fieldMappingsForMARCCurrentOption,
                }}
              />
            )}
            confirmLabel={<FormattedMessage id="ui-data-import.continue" />}
            onConfirm={() => {
              setInitialMARCMappingDetails(fieldMappingsForMARCSelectedOption);
              setFieldMappingsForMARC(fieldMappingsForMARCSelectedOption);
              setConfirmModalOpen(false);
            }}
            onCancel={() => {
              setFormFieldValue('profile.mappingDetails.marcMappingOption', fieldMappingsForMARC);
              setConfirmModalOpen(false);
            }}
          />
        </FullScreenForm>
      </EditKeyShortcutsWrapper>
    </>
  );
};

MappingProfilesFormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.shape({
    getState: PropTypes.func.isRequired,
    change: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  stripes: stripesShape.isRequired,
  transitionToParams: PropTypes.func.isRequired,
  match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
  location: PropTypes.oneOfType([
    PropTypes.shape({
      search: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    PropTypes.string.isRequired,
  ]),
  parentResources: PropTypes.object,
  accordionStatusRef: PropTypes.object,
};

export const MappingProfilesForm = compose(
  injectIntl,
  withProfileWrapper,
  stripesFinalForm({
    navigationCheck: true,
    destroyOnUnregister: true,
    initialValuesEqual: isEqual,
  }),
)(MappingProfilesFormComponent);
