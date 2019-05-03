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

const formName = 'matchProfilesForm';
const dataTypes = DATA_TYPES.map(dataType => ({
  value: dataType,
  label: dataType,
}));

export const MatchProfilesFormComponent = props => {
  const {
    pristine,
    submitting,
    initialValues,
    handleSubmit,
    onCancel,
  } = props;

  const isEditMode = Boolean(initialValues.id);
  const isSubmitDisabled = pristine || submitting;

  const paneTitle = isEditMode
    ? (
      <FormattedMessage id="ui-data-import.edit">
        {txt => `${txt} ${initialValues.name}`}
      </FormattedMessage>
    )
    : <FormattedMessage id="ui-data-import.settings.matchProfiles.newJob" />;
  const headLine = isEditMode
    ? initialValues.name
    : <FormattedMessage id="ui-data-import.settings.matchProfiles.newJob" />;

  return (
    <FullScreenForm
      id="match-profiles-form"
      paneTitle={paneTitle}
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
        {headLine}
      </Headline>
      <AccordionSet>
        <Accordion
          label={<FormattedMessage id="ui-data-import.settings.matchProfiles.summary" />}
          separator={false}
        >
          <div data-test-name-field>
            <Field
              label={<FormattedMessage id="ui-data-import.settings.matchProfiles.name" />}
              name="name"
              required
              component={TextField}
              validate={[validateRequiredField]}
            />
          </div>
          <div data-test-accepted-data-types-field>
            <FormattedMessage id="ui-data-import.settings.matchProfiles.chooseAcceptedDataType">
              {placeholder => (
                <Field
                  label={<FormattedMessage id="ui-data-import.settings.matchProfiles.acceptedDataType" />}
                  name="dataType"
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
          label={<FormattedMessage id="ui-data-import.settings.matchProfiles.overview" />}
          separator={false}
        >
          <div>
            {/* will be implemented in https://issues.folio.org/browse/UIDATIMP-152 */}
          </div>
        </Accordion>
      </AccordionSet>
    </FullScreenForm>
  );
};

MatchProfilesFormComponent.propTypes = {
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export const MatchProfilesForm = stripesForm({
  form: formName,
  navigationCheck: true,
  enableReinitialize: true,
})(MatchProfilesFormComponent);
