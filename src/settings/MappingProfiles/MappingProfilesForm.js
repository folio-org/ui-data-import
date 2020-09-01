import React, {
  useMemo,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import {
  Field,
  change,
} from 'redux-form';
import { isEmpty } from 'lodash';

import stripesForm from '@folio/stripes/form';
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
  MARCTable,
} from '../../components';
import {
  MappingInstanceDetails,
  MappingHoldingsDetails,
  MappingItemDetails,
} from './detailsSections/edit';

import {
  getInitialDetails,
  getInitialFields,
  getReferenceTables,
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
} from '../../utils';

import styles from './MappingProfiles.css';

const formName = 'mappingProfilesForm';

export const MappingProfilesFormComponent = ({
  pristine,
  submitting,
  initialValues,
  mappingDetails,
  okapi,
  location: { search },
  handleSubmit,
  onCancel,
  dispatch,
  intl,
}) => {
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
  const { layer } = queryString.parse(search);

  const isEditMode = layer === LAYER_TYPES.EDIT;
  const isSubmitDisabled = pristine || submitting;

  const [folioRecordType, setFolioRecordType] = useState(existingRecordType || null);
  const [fieldMappingsForMARCSelectedOption, setFieldMappingsForMARCSelectedOption] = useState('');
  const [fieldMappingsForMARC, setFieldMappingsForMARC] = useState('');
  const [addedRelations, setAddedRelations] = useState([]);
  const [deletedRelations, setDeletedRelations] = useState([]);
  const [prevExistingRecordType, setPrevExistingRecordType] = useState(existingRecordType);
  const [initials, setInitials] = useState({
    ...profile,
    mappingDetails: isEmpty(mappingDetails) ? getInitialDetails(prevExistingRecordType, true) : mappingDetails,
  });
  const [isConfirmEditModalOpen, setConfirmModalOpen] = useState(false);

  useLayoutEffect(() => {
    const isEqual = folioRecordType === prevExistingRecordType;
    const needsUpdate = !id || (id && (!isEqual || isEmpty(mappingDetails)));

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
    dispatch(change(formName, 'profile.mappingDetails', newInitDetails));

    if (!isEqual) {
      setPrevExistingRecordType(folioRecordType);
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
    .map(([recordType, { captionId }]) => ({
      value: recordType,
      label: intl.formatMessage({ id: captionId }),
    }));
  const getFolioRecordTypesDataOptions = () => Object.entries(FOLIO_RECORD_TYPES)
    .map(([recordType, { captionId }]) => ({
      value: recordType,
      label: intl.formatMessage({ id: captionId }),
    }));

  const folioRecordTypesDataOptions = useMemo(getFolioRecordTypesDataOptions, []);
  const incomingRecordTypesDataOptions = useMemo(getIncomingRecordTypesDataOptions, []);

  const setFormFieldValue = (fieldsPath, updatedValue) => {
    dispatch(change(formName, fieldsPath, updatedValue));
  };

  const getRepeatableFieldAction = mappingFieldIndex => {
    return mappingDetails?.mappingFields?.[mappingFieldIndex]?.repeatableFieldAction || '';
  };

  const handleMARCTypeChange = e => {
    if (fieldMappingsForMARC && e.target.value !== fieldMappingsForMARC) {
      setFieldMappingsForMARCSelectedOption(e.target.value);
      setConfirmModalOpen(true);
    } else {
      setFieldMappingsForMARC(e.target.value);
    }
  };

  const detailsProps = {
    initialFields,
    referenceTables,
    getRepeatableFieldAction,
    setReferenceTables: setFormFieldValue,
    okapi,
  };

  const marcTableFields = mappingDetails?.marcMappingDetails ||
    [{
      order: 0,
      field: { subfields: [{}] },
    }];

  const fieldMappingsForMARCOptions = FIELD_MAPPINGS_FOR_MARC_OPTIONS.map(option => (
    {
      value: option.value,
      label: intl.formatMessage({ id: option.label }),
    }
  ));
  const updatesFieldMappingForMARCColumns = ['arrows', 'field', 'indicator1', 'indicator2', 'subfield', 'addRemove'];
  const fieldMappingsForMARCPreviousOption = fieldMappingsForMARC && intl.formatMessage(
    { id: FIELD_MAPPINGS_FOR_MARC_OPTIONS.find(option => option.value === fieldMappingsForMARC)?.label },
  );
  const fieldMappingsForMARCCurrentOption = fieldMappingsForMARCSelectedOption && intl.formatMessage(
    { id: FIELD_MAPPINGS_FOR_MARC_OPTIONS.find(option => option.value === fieldMappingsForMARCSelectedOption)?.label },
  );

  const renderMARCTable = () => {
    switch (fieldMappingsForMARC) {
      case FIELD_MAPPINGS_FOR_MARC.UPDATES:
        return (
          <MARCTable
            fields={marcTableFields}
            onChange={setFormFieldValue}
            columns={updatesFieldMappingForMARCColumns}
          />
        );
      default:
        return (
          <MARCTable
            fields={marcTableFields}
            onChange={setFormFieldValue}
          />
        );
    }
  };

  const renderDetails = {
    INSTANCE: <MappingInstanceDetails {...detailsProps} />,
    HOLDINGS: <MappingHoldingsDetails {...detailsProps} />,
    ITEM: <MappingItemDetails {...detailsProps} />,
    MARC_BIBLIOGRAPHIC: fieldMappingsForMARC && renderMARCTable(),
  };

  return (
    <>
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
        <Headline
          data-test-header-title
          id="profile-headline"
          size="xx-large"
          tag="h2"
        >
          {headLine}
        </Headline>
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
                {placeholder => (
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
                />
              </Col>
              {folioRecordType === MARC_TYPES.MARC_BIBLIOGRAPHIC && (
                <Col xs={6}>
                  <FormattedMessage id="ui-data-import.fieldMappingsForMarc.placeholder">
                    {placeholder => (
                      <div data-test-field-mapping-foer-marc-field>
                        {/* TODO: Wrap into the <Field> component when BE is done */}
                        <Select
                          dataOptions={fieldMappingsForMARCOptions}
                          value={fieldMappingsForMARC}
                          label={<FormattedMessage id="ui-data-import.fieldMappingsForMarc" />}
                          placeholder={placeholder}
                          onChange={handleMARCTypeChange}
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
                  <Row between="xs">
                    <Col>
                      <MappedHeader
                        mappedLabelId="ui-data-import.settings.profiles.select.mappingProfiles"
                        mappableLabelId={MAPPING_DETAILS_HEADLINE[folioRecordType]?.labelId}
                        mappingTypeLabelId={FIELD_MAPPINGS_FOR_MARC_OPTIONS.find(option => option.value === fieldMappingsForMARC)?.label}
                        headlineProps={{ margin: 'small' }}
                      />
                    </Col>
                    {!isMARCType(folioRecordType) && (
                      <Col>
                        <div data-test-expand-all-button>
                          <ExpandAllButton />
                        </div>
                      </Col>
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
              onLink={setAddedRelations}
              onUnlink={setDeletedRelations}
            />
          </Accordion>
        </AccordionSet>
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
            let initalMarcMappingDetails = getInitialDetails(folioRecordType, true)?.marcMappingDetails;

            if (fieldMappingsForMARCSelectedOption === FIELD_MAPPINGS_FOR_MARC.UPDATES) {
              initalMarcMappingDetails = [
                fillEmptyFieldsWithValue(
                  initalMarcMappingDetails[0],
                  ['field.indicator1', 'field.indicator2', 'field.subfields[0].subfield'], '*',
                ),
              ];
            }

            setFieldMappingsForMARC(fieldMappingsForMARCSelectedOption);
            setFormFieldValue('profile.mappingDetails.marcMappingDetails', initalMarcMappingDetails);
            setConfirmModalOpen(false);
          }}
          onCancel={() => setConfirmModalOpen(false)}
        />
      </FullScreenForm>
    </>
  );
};

MappingProfilesFormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  location: PropTypes.oneOfType([
    PropTypes.shape({
      search: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    PropTypes.string.isRequired,
  ]),
  okapi: okapiShape.isRequired,
  mappingDetails: PropTypes.object,
  onCancel: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  const okapi = state.okapi || null;
  const mappingDetails = state.form[formName]?.values.profile?.mappingDetails || {};

  return {
    okapi,
    mappingDetails,
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
