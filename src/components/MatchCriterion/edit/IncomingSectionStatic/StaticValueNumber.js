import React from 'react';
import { Field } from 'redux-form';

import { TextField } from '@folio/stripes/components';

export const StaticValueNumber = ({ repeatableIndex }) => {
  return (
    <div data-test-static-number-field>
      <Field
        name={`profile.matchDetails[${repeatableIndex}].incomingMatchExpression.staticValueDetails.number`}
        component={TextField}
        type="number"
      />
    </div>
  );
};
