import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';

import { connect } from 'react-redux';
import { change } from 'redux-form';
import {
  get,
  identity,
  isEmpty,
} from 'lodash';

import stripesForm from '@folio/stripes/form';

import {
  compose,
  withProfileWrapper,
  ENTITY_KEYS,
  LAYER_TYPES,
  PROFILE_TYPES,
  ITEM_STATUS_OPTIONS,
} from '../../utils';
import {
  FlexibleForm,
  INCOMING_RECORD_TYPES,
  FOLIO_RECORD_TYPES,
} from '../../components';

import {
  getInitialDetails,
  getInitialFields,
  getReferenceTables,
} from './initialDetails';

// @TODO: Remove this after server-side configs will be available
import { formConfigSamples } from '../../../test/bigtest/mocks';

import styles from './MappingProfiles.css';

const formName = 'mappingProfilesForm';

export const MappingProfilesFormComponent = ({
  pristine,
  submitting,
  initialValues,
  okapi,
  existingRecordTypeInitial,
  mappingDetailsInitial,
  mappingDetails,
  location: { search },
  handleSubmit,
  onCancel,
  dispatch,
}) => {
  const { profile } = initialValues;
  const { layer } = queryString.parse(search);

  const isEditMode = layer === LAYER_TYPES.EDIT;
  const isSubmitDisabled = pristine || submitting;

  const formConfig = formConfigSamples.find(cfg => cfg.name === formName);
  const associations = [
    ...get(initialValues, ['profile', 'parentProfiles'], []),
    ...get(initialValues, ['profile', 'childProfiles'], []),
  ];

  const getIncomingRecordTypesDataOptions = () => Object.entries(INCOMING_RECORD_TYPES)
    .map(([recordType, { captionId }]) => ({
      value: recordType,
      label: captionId,
    }));
  const getFolioRecordTypesDataOptions = () => Object.entries(FOLIO_RECORD_TYPES)
    .map(([recordType, { captionId }]) => ({
      value: recordType,
      label: captionId,
    }));

  const folioRecordTypesDataOptions = useMemo(getFolioRecordTypesDataOptions, []);
  const incomingRecordTypesDataOptions = useMemo(getIncomingRecordTypesDataOptions, []);

  const paneTitle = isEditMode ? (
    <FormattedMessage id="ui-data-import.edit">
      {txt => `${txt} ${profile.name}`}
    </FormattedMessage>
  ) : <FormattedMessage id="ui-data-import.settings.mappingProfiles.new" />;
  const headLine = isEditMode ? profile.name : <FormattedMessage id="ui-data-import.settings.mappingProfiles.new" />;

  const prevExistingRecordType = useRef(existingRecordTypeInitial);
  const [existingRecordType, setExistingRecordType] = useState(get(profile, 'existingRecordType', null));
  const [initials, setInitials] = useState({
    ...profile,
    mappingDetails: isEmpty(mappingDetails) ? getInitialDetails(prevExistingRecordType.current, true) : mappingDetails,
  });
  const [addedRelations, setAddedRelations] = useState([]);
  const [deletedRelations, setDeletedRelations] = useState([]);

  useLayoutEffect(() => {
    const isEqual = existingRecordType === prevExistingRecordType.current;
    const needsUpdate = !profile.id || (profile.id && (!isEqual || isEmpty(mappingDetails)));

    if (!needsUpdate) {
      return;
    }

    const newInitDetails = existingRecordType === existingRecordTypeInitial && !isEmpty(mappingDetails)
      ? mappingDetailsInitial
      : getInitialDetails(existingRecordType, true);
    const newInitials = {
      ...initials,
      mappingDetails: newInitDetails,
    };

    setInitials(newInitials);
    // @TODO: change method should be changed to initialize
    dispatch(change(formName, 'profile.mappingDetails', newInitDetails));
    if (!isEqual) {
      prevExistingRecordType.current = existingRecordType;
    }
  }, [existingRecordType]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(change(formName, 'addedRelations', addedRelations));
  }, [addedRelations]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(change(formName, 'deletedRelations', deletedRelations));
  }, [deletedRelations]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMarcDetailsChange = useCallback(
    (fieldPath, updatedValue) => {
      dispatch(change(formName, fieldPath, updatedValue));
    },
    [dispatch],
  );

  const referenceTables = getReferenceTables(get(mappingDetails, 'mappingFields', []));
  const initialFields = getInitialFields(existingRecordType);

  const stateMethods = {
    dispatch,
    change,
  };

  const injectedProps = {
    'profile-headline': { children: headLine },
    'field-record-type-incoming': {
      dataOptions: incomingRecordTypesDataOptions,
      itemToString: identity,
    },
    'field-record-type-existing': {
      dataOptions: folioRecordTypesDataOptions,
      itemToString: identity,
      onChange: (event, newValue) => setExistingRecordType(newValue),
    },
    'section-mapping-details': { stateFieldValue: existingRecordType },
    'mappingProfile.actionsAssociator': {
      entityKey: ENTITY_KEYS.ACTION_PROFILES,
      namespaceKey: 'AAP',
      parentId: profile.id,
      parentType: PROFILE_TYPES.MAPPING_PROFILE,
      masterType: PROFILE_TYPES.ACTION_PROFILE,
      detailType: PROFILE_TYPES.MAPPING_PROFILE,
      profileName: profile.name,
      contentData: associations,
      relationsToAdd: addedRelations,
      relationsToDelete: deletedRelations,
      onLink: setAddedRelations,
      onUnlink: setDeletedRelations,
    },
    'item-status': {
      acceptedValuesList: ITEM_STATUS_OPTIONS.map(option => ({
        value: option.value,
        label: <FormattedMessage id={option.label} />,
      })),
    },
    'marc-modification-table': {
      fields: mappingDetails?.marcMappingDetails || [{
        order: 0,
        field: { subfields: [{}] },
      }],
      onChange: onMarcDetailsChange,
    },
  };

  return (
    <FlexibleForm
      component="FullScreenForm"
      id="mapping-profiles-form"
      config={formConfig}
      paneTitle={paneTitle}
      headLine={headLine}
      okapi={okapi}
      injectedProps={injectedProps}
      stateMethods={stateMethods}
      referenceTables={referenceTables}
      initialFields={initialFields}
      submitMessage={<FormattedMessage id="ui-data-import.saveAsProfile" />}
      isSubmitDisabled={isSubmitDisabled}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      contentClassName={styles.mappingForm}
    />
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
  okapi: PropTypes.object.isRequired,
  existingRecordTypeInitial: PropTypes.string.isRequired,
  mappingDetailsInitial: PropTypes.object.isRequired,
  mappingDetails: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = state => {
  // @TODO: Remove this when FlexibleForm internal state mamagement will be implemented.
  const okapi = get(state, ['okapi'], null);
  const mappingDetailsInitial = get(state, ['form', formName, 'initial', 'profile', 'mappingDetails'], null);
  const mappingDetails = get(state, ['form', formName, 'values', 'profile', 'mappingDetails'], null);
  const existingRecordTypeInitial = get(state, ['form', formName, 'initial', 'profile', 'existingRecordType'], null);

  return {
    okapi,
    existingRecordTypeInitial,
    mappingDetailsInitial,
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
