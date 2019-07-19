import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';
import { Field } from 'redux-form';
import { identity } from 'lodash';

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
  compose,
} from '../../utils';
import {
  RECORD_TYPES,
  INCOMING_RECORD_TYPES,
  FullScreenForm,
} from '../../components';

const formName = 'mappingProfilesForm';

export const MappingProfilesFormComponent = ({
  intl: { formatMessage },
  pristine,
  submitting,
  handleSubmit,
  onCancel,
}) => {
  const getIncomingRecordTypesDataOptions = () => Object.entries(INCOMING_RECORD_TYPES)
    .map(([recordType, { captionId }]) => ({
      value: recordType,
      label: formatMessage({ id: captionId }),
    }));

  const getFolioRecordTypesDataOptions = () => Object.entries(RECORD_TYPES)
    .map(([recordType, { captionId }]) => ({
      value: recordType,
      label: formatMessage({ id: captionId }),
    }));

  const incomingRecordTypesDataOptions = useMemo(getIncomingRecordTypesDataOptions, []);
  const folioRecordTypesDataOptions = useMemo(getFolioRecordTypesDataOptions, []);
  const isSubmitDisabled = pristine || submitting;
  const title = <FormattedMessage id="ui-data-import.settings.mappingProfiles.new" />;

  return (
    <FullScreenForm
      id="mapping-profiles-form"
      paneTitle={title}
      submitMessage={<FormattedMessage id="ui-data-import.save" />}
      isSubmitDisabled={isSubmitDisabled}
      onSubmit={handleSubmit}
      onCancel={onCancel}
    >
      <Headline
        size="xx-large"
        tag="h2"
        data-test-header-title
      >
        {title}
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
          <div data-test-incoming-record-type-field>
            <FormattedMessage id="ui-data-import.chooseIncomingRecordType">
              {placeholder => (
                <Field
                  label={<FormattedMessage id="ui-data-import.incomingRecordType" />}
                  name="incomingRecordType"
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
          <div data-test-folio-record-type-field>
            <FormattedMessage id="ui-data-import.chooseFolioRecordType">
              {placeholder => (
                <Field
                  label={<FormattedMessage id="ui-data-import.folioRecordType" />}
                  name="folioRecord"
                  component={Select}
                  required
                  itemToString={identity}
                  validate={[validateRequiredField]}
                  dataOptions={folioRecordTypesDataOptions}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
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
          <div>
            {/* will be implemented in the future */}
          </div>
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-data-import.settings.associatedActionProfiles" />}
          separator={false}
        >
          <div>
            {/* will be implemented in the future */}
          </div>
        </Accordion>
      </AccordionSet>
    </FullScreenForm>
  );
};

MappingProfilesFormComponent.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  initialValues: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  onCancel: PropTypes.func.isRequired,
};

export const MappingProfilesForm = compose(
  injectIntl,
  stripesForm({
    form: formName,
    navigationCheck: true,
    enableReinitialize: true,
  })
)(MappingProfilesFormComponent);
