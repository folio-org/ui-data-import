import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';
import { identity } from 'lodash';

import {
  Headline,
  TextArea,
  TextField,
  Select,
  Accordion,
  AccordionSet,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import { FullScreenForm } from '../FullScreenForm';
import { validateRequiredField } from '../../utils';
import { DATA_TYPES } from '../../utils/constants';

const formName = 'jobProfilesForm';
const dataTypes = DATA_TYPES.map(dataType => ({
  value: dataType,
  label: dataType,
}));

export const JobProfilesForm = stripesForm({
  form: formName,
  navigationCheck: true,
  enableReinitialize: true,
})(props => {
  const {
    pristine,
    submitting,
    handleSubmit,
    onCancel,
  } = props;

  const isSubmitDisabled = pristine || submitting;

  const title = <FormattedMessage id="ui-data-import.settings.jobProfiles.newJob" />;

  return (
    <FullScreenForm
      id="job-profiles-form"
      paneTitle={title}
      submitMessage={<FormattedMessage id="ui-data-import.settings.jobProfiles.create" />}
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
          label={<FormattedMessage id="ui-data-import.settings.jobProfiles.summary" />}
          separator={false}
        >
          <div data-test-name-field>
            <Field
              label={<FormattedMessage id="ui-data-import.settings.jobProfiles.name" />}
              name="name"
              required
              component={TextField}
              validate={[validateRequiredField]}
            />
          </div>
          <div data-test-accepted-data-types-field>
            <FormattedMessage id="ui-data-import.settings.jobProfiles.chooseAcceptedDataType">
              {placeholder => (
                <Field
                  label={<FormattedMessage id="ui-data-import.settings.jobProfiles.acceptedDataType" />}
                  name="acceptedDataTypes"
                  component={Select}
                  required
                  itemToString={identity}
                  validate={[validateRequiredField]}
                  dataOptions={dataTypes}
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
          label={<FormattedMessage id="ui-data-import.settings.jobProfiles.overview" />}
          separator={false}
        >
          {/* will be implemented in https://issues.folio.org/browse/UIDATIMP-152 */}
        </Accordion>
      </AccordionSet>
    </FullScreenForm>
  );
});

JobProfilesForm.propTypes = {
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
