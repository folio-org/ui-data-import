import React, {
  useMemo,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import {
  Field,
  change,
} from 'redux-form';
import {
  omit,
  pick,
} from 'lodash';

import stripesForm from '@folio/stripes/form';
import {
  useStripes,
  checkIfUserInCentralTenant,
  TitleManager,
} from '@folio/stripes/core';
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
import {
  FullScreenForm,
  FOLIO_RECORD_TYPES,
} from '@folio/stripes-data-transfer-components';

import {
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
  MappingOrderDetails,
  MappingMARCAuthorityDetails,
} from './detailsSections/edit';

import {
  getInitialDetails,
  getInitialFields,
  getReferenceTables,
  getMappingDetailsForDuplicated,
} from './initialDetails';
import {
  compose,
  withProfileWrapper,
  validateRequiredField,
  isMARCType,
  okapiShape,
  ENTITY_KEYS,
  LAYER_TYPES,
  PROFILE_TYPES,
  MAPPING_DETAILS_HEADLINE,
  MARC_TYPES,
  FIELD_MAPPINGS_FOR_MARC,
  FIELD_MAPPINGS_FOR_MARC_OPTIONS,
  fillEmptyFieldsWithValue,
  marcFieldProtectionSettingsShape,
  createOptionsList,
  FOLIO_RECORD_TYPES_TO_DISABLE,
  INCOMING_RECORD_TYPES_TO_DISABLE,
  INCOMING_RECORD_TYPES,
} from '../../utils';

import styles from './MappingProfiles.css';

export const formName = 'mappingProfilesForm';

const INITIAL_FOLIO_RECORD_TYPES = {
  ...omit(FOLIO_RECORD_TYPES, [
    FOLIO_RECORD_TYPES.AUTHORITY.type,
    FOLIO_RECORD_TYPES.ITEMS.type,
    FOLIO_RECORD_TYPES.SRS.type,
  ])
};

export const MappingProfilesFormComponent = ({
  pristine,
  submitting,
  initialValues,
  mappingDetails,
  mappingDetails: { marcMappingOption },
  parentResources: { marcFieldProtectionSettings: { records: marcFieldProtectionSettings = [] } },
  mappingMarcFieldProtectionFields,
  okapi,
  handleSubmit,
  onCancel,
  dispatch,
  intl,
  accordionStatusRef,
  layerType,
}) => {
  const { formatMessage } = intl;
  const {
    profile,
    profile: {
      id,
      name,
      existingRecordType,
      parentProfiles = [],
      childProfiles = [],
    },
  } = initialValues;
  const isEditMode = layerType === LAYER_TYPES.EDIT;
  const isDuplicateMode = layerType === LAYER_TYPES.DUPLICATE;
  const isSubmitDisabled = pristine || submitting;

  const [folioRecordType, setFolioRecordType] = useState(existingRecordType || null);
  const [initials, setInitials] = useState(profile || {});
  const [fieldMappingsForMARCSelectedOption, setFieldMappingsForMARCSelectedOption] = useState('');
  const [fieldMappingsForMARC, setFieldMappingsForMARC] = useState(marcMappingOption || '');
  const [addedRelations, setAddedRelations] = useState([]);
  const [deletedRelations, setDeletedRelations] = useState([]);
  const [isConfirmEditModalOpen, setConfirmModalOpen] = useState(false);

  const stripes = useStripes();
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

  const setMappingDetailsToForm = newMappingDetails => {
    dispatch(change(formName, 'profile.mappingDetails', newMappingDetails));
  };

  const MAPPING_PROFILES_FORM_FOLIO_RECORD_TYPES = isUserInCentralTenant ?
    pick(INITIAL_FOLIO_RECORD_TYPES, [
      FOLIO_RECORD_TYPES.INSTANCE.type,
      FOLIO_RECORD_TYPES.ORDER.type,
      FOLIO_RECORD_TYPES.INVOICE.type,
      FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC.type,
      FOLIO_RECORD_TYPES.MARC_AUTHORITY.type,
    ]) : INITIAL_FOLIO_RECORD_TYPES;

  // set initial mappingDetails
  useEffect(() => {
    // existingRecordType is the initial folio record type value
    setFolioRecordType(existingRecordType);

    // on Edit/Duplicate mappingDetails is an object of fields
    // on Create mappingDetails = {}
    const initialMappingDetails = isDuplicateMode ? getMappingDetailsForDuplicated(mappingDetails) : mappingDetails;

    // update initials
    const newInitials = {
      ...initials,
      mappingDetails: initialMappingDetails,
    };

    setInitials(newInitials);

    // initialize the form with mappingDetails
    setMappingDetailsToForm(initialMappingDetails);
  }, [existingRecordType]); // eslint-disable-line react-hooks/exhaustive-deps

  // set updated mappingDetails on the folio record type change
  useEffect(() => {
    const isInitial = folioRecordType === existingRecordType;

    if (isInitial) {
      setMappingDetailsToForm(initials.mappingDetails);
    } else {
      const updatedMappingDetails = getInitialDetails(folioRecordType, true);

      setMappingDetailsToForm(updatedMappingDetails);
    }
  }, [folioRecordType]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(change(formName, 'addedRelations', addedRelations));
  }, [addedRelations, dispatch]);
  useEffect(() => {
    dispatch(change(formName, 'deletedRelations', deletedRelations));
  }, [deletedRelations, dispatch]);

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

  const referenceTables = getReferenceTables(mappingDetails?.mappingFields || []);
  const initialFields = getInitialFields(folioRecordType);

  const getIncomingRecordTypesDataOptions = () => Object.entries(INCOMING_RECORD_TYPES)
    .map(([recordType, { captionId }]) => {
      // TODO: Disabling options should be removed after implentation is done
      const isOptionDisabled = INCOMING_RECORD_TYPES_TO_DISABLE.some(option => option === recordType);

      return {
        value: recordType,
        label: formatMessage({ id: captionId }),
        disabled: isOptionDisabled,
      };
    });
  const getFolioRecordTypesDataOptions = () => Object.entries(MAPPING_PROFILES_FORM_FOLIO_RECORD_TYPES)
    .map(([recordType, { captionId }]) => {
      // TODO: Disabling options should be removed after implentation is done
      const isOptionDisabled = FOLIO_RECORD_TYPES_TO_DISABLE.some(option => option === recordType);

      return {
        value: recordType,
        label: formatMessage({ id: captionId }),
        disabled: isOptionDisabled,
      };
    });

  const folioRecordTypesDataOptions = useMemo(getFolioRecordTypesDataOptions, []);
  const incomingRecordTypesDataOptions = useMemo(getIncomingRecordTypesDataOptions, []);

  const setFormFieldValue = (fieldsPath, updatedValue) => {
    dispatch(change(formName, fieldsPath, updatedValue));
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

  const handleFieldMappingsForMARCTypeChange = e => {
    const value = e.target.value;

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
    requestLimit: stripes.config.maxUnpagedResourceCount,
  };

  const MARCDetailsProps = {
    marcMappingDetails: mappingDetails?.marcMappingDetails,
    marcFieldProtectionFields: marcFieldProtectionSettings,
    mappingMarcFieldProtectionFields,
    fieldMappingsForMARCField: fieldMappingsForMARC,
    onUpdateFieldAdd: setInitialValuesForMARCUpdates,
    setReferenceTables: setFormFieldValue,
    folioRecordType,
  };

  const invoiceDetailsProps = {
    ...detailsProps,
    mappingDetails,
  };
  const fieldMappingsForMARCBibOptions = createOptionsList(FIELD_MAPPINGS_FOR_MARC_OPTIONS, formatMessage);
  const fieldMappingsForMARCAuthorityOptions = createOptionsList(FIELD_MAPPINGS_FOR_MARC_OPTIONS.filter(field => {
    return field.value === FIELD_MAPPINGS_FOR_MARC.UPDATES;
  }), formatMessage);
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
    MARC_AUTHORITY: <MappingMARCAuthorityDetails {...MARCDetailsProps} />,
    INVOICE: <MappingInvoiceDetails {...invoiceDetailsProps} />,
    ORDER: <MappingOrderDetails {...invoiceDetailsProps} />,
  };

  return (
    <>
      <EditKeyShortcutsWrapper onSubmit={handleSubmit}>
        <FullScreenForm
          id="mapping-profiles-form"
          paneTitle={paneTitle}
          submitButtonText={<FormattedMessage id="ui-data-import.saveAsProfile" />}
          cancelButtonText={<FormattedMessage id="ui-data-import.close" />}
          isSubmitButtonDisabled={isSubmitDisabled}
          onSubmit={handleSubmit}
          onCancel={onCancel}
          contentClassName={styles.mappingForm}
        >
          <TitleManager
            prefix={`${formatMessage({ id: 'ui-data-import.settings.dataImport.title' })} - `}
            page={formatMessage({ id: 'ui-data-import.settings.mappingProfiles.title' })}
            record={`${formatMessage({ id: `ui-data-import.${layerType}` })} ${profile.name}`}
          />
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
                    validate={[validateRequiredField]}
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
                        validate={[validateRequiredField]}
                        dataOptions={incomingRecordTypesDataOptions}
                        placeholder={placeholder}
                      />
                    )}
                  </FormattedMessage>
                </div>
                <Row>
                  <Col xs={6}>
                    <FolioRecordTypeSelect
                      fieldName="existingRecordType"
                      dataOptions={folioRecordTypesDataOptions}
                      onRecordSelect={e => {
                        setFolioRecordType(e.target.value);
                        setFieldMappingsForMARC('');
                      }}
                      formType="redux-form"
                    />
                  </Col>
                  {(folioRecordType === MARC_TYPES.MARC_BIBLIOGRAPHIC || folioRecordType === MARC_TYPES.MARC_AUTHORITY) && (
                    <Col xs={6}>
                      <FormattedMessage id="ui-data-import.fieldMappingsForMarc.placeholder">
                        {([placeholder]) => (
                          <div data-test-field-mapping-foer-marc-field>
                            <Field
                              label={<FormattedMessage id="ui-data-import.fieldMappingsForMarc" />}
                              name="profile.mappingDetails.marcMappingOption"
                              component={Select}
                              validate={[validateRequiredField]}
                              dataOptions={folioRecordType === MARC_TYPES.MARC_BIBLIOGRAPHIC
                                ? fieldMappingsForMARCBibOptions
                                : fieldMappingsForMARCAuthorityOptions
                              }
                              placeholder={placeholder}
                              onChange={handleFieldMappingsForMARCTypeChange}
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
                  />
                </div>
              </Accordion>
              {folioRecordType && (
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
              )}
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
                  profileType={ENTITY_KEYS.MAPPING_PROFILES}
                  profileName={name}
                  contentData={associations}
                  hasLoaded
                  isMultiSelect
                  isMultiLink={false}
                  relationsToAdd={addedRelations}
                  relationsToDelete={deletedRelations}
                  onLink={setAddedRelations}
                  onUnlink={setDeletedRelations}
                  isEditMode={isEditMode}
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
  okapi: okapiShape.isRequired,
  mappingMarcFieldProtectionFields: PropTypes.arrayOf(marcFieldProtectionSettingsShape).isRequired,
  onCancel: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  mappingDetails: PropTypes.object,
  parentResources: PropTypes.object,
  accordionStatusRef: PropTypes.object,
  layerType: PropTypes.string,
};

const mapStateToProps = state => {
  const okapi = state.okapi || null;
  const mappingDetails = state.form[formName]?.values?.profile?.mappingDetails || {};
  const mappingMarcFieldProtectionFields = state.form[formName]?.values?.profile?.marcFieldProtectionSettings || [];

  return {
    okapi,
    mappingDetails,
    mappingMarcFieldProtectionFields,
  };
};

export const MappingProfilesForm = compose(
  injectIntl,
  withProfileWrapper,
  stripesForm({
    form: formName,
    navigationCheck: true,
    enableReinitialize: true,
  }),
  connect(mapStateToProps),
)(MappingProfilesFormComponent);
