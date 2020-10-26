import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';

export const StaticValueText = ({ repeatableIndex }) => {
  return (
    <div data-test-static-text-field>
      <FormattedMessage id="ui-data-import.match.incoming.static.value-type.text">
        {([ariaLabel]) => (
          <Field
            name={`profile.matchDetails[${repeatableIndex}].incomingMatchExpression.staticValueDetails.text`}
            component={TextField}
            aria-label={ariaLabel}
          />
        )}
      </FormattedMessage>
    </div>
  );
};

StaticValueText.propTypes = { repeatableIndex: PropTypes.number.isRequired };
