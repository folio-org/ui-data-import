import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';

export const StaticValueNumber = ({ repeatableIndex }) => {
  return (
    <div data-test-static-number-field>
      <FormattedMessage id="ui-data-import.match.incoming.static.value-type.number">
        {([ariaLabel]) => (
          <Field
            name={`profile.matchDetails[${repeatableIndex}].incomingMatchExpression.staticValueDetails.number`}
            component={TextField}
            type="number"
            aria-label={ariaLabel}
          />
        )}
      </FormattedMessage>
    </div>
  );
};

StaticValueNumber.propTypes = { repeatableIndex: PropTypes.number.isRequired };
