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

const formName = 'actionProfilesForm';

export const ActionProfilesFormComponent = props => {
  const {
    pristine,
    submitting,
    handleSubmit,
    onCancel,
  } = props;

  const isSubmitDisabled = pristine || submitting;

  const title = <FormattedMessage id="ui-data-import.settings.actionProfiles.new" />;

  return (
    <FullScreenForm
      id="action-profiles-form"
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
            {/* will be implemented in https://issues.folio.org/browse/UIDATIMP-207 */}
          </div>
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-data-import.settings.actionProfiles.associatedMappingProfile" />}
          separator={false}
        >
          <div>
            {/* will be implemented in https://issues.folio.org/browse/UIDATIMP-208 */}
          </div>
        </Accordion>
      </AccordionSet>
    </FullScreenForm>
  );
};

ActionProfilesFormComponent.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  initialValues: PropTypes.object.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  location: PropTypes.shape({ search: PropTypes.string.isRequired }).isRequired,
  onCancel: PropTypes.func.isRequired,
};

export const ActionProfilesForm = stripesForm({
  form: formName,
  navigationCheck: true,
  enableReinitialize: true,
})(ActionProfilesFormComponent);
