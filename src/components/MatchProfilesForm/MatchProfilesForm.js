import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Headline,
  TextArea,
  TextField,
  Accordion,
  AccordionSet,
} from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';

import { FullScreenForm } from '../FullScreenForm';
import { validateRequiredField } from '../../utils';

const formName = 'matchProfilesForm';

export const MatchProfilesFormComponent = props => {
  const {
    pristine,
    submitting,
    handleSubmit,
    onCancel,
  } = props;

  const isSubmitDisabled = pristine || submitting;

  return (
    <FullScreenForm
      id="match-profiles-form"
      paneTitle={<FormattedMessage id="ui-data-import.settings.matchProfiles.newProfile" />}
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
        <FormattedMessage id="ui-data-import.settings.matchProfiles.newProfile" />
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
          label={<FormattedMessage id="ui-data-import.settings.matchProfiles.details" />}
          separator={false}
        >
          <div>
            {/* will be implemented in https://issues.folio.org/browse/UIDATIMP-175 */}
          </div>
        </Accordion>
      </AccordionSet>
    </FullScreenForm>
  );
};

MatchProfilesFormComponent.propTypes = {
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
