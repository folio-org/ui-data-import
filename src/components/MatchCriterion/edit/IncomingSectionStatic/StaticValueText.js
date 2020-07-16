import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';

export const StaticValueText = ({ repeatableIndex }) => {
  return (
    <div data-test-static-text-field>
      <Field
        name={`profile.matchDetails[${repeatableIndex}].incomingMatchExpression.staticValueDetails.text`}
        component={TextField}
      />
    </div>
  );
};

StaticValueText.propTypes = { repeatableIndex: PropTypes.number.isRequired };
