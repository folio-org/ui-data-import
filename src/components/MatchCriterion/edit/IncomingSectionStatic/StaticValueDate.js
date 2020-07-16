import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';

import {
  Layout,
  Datepicker,
} from '@folio/stripes/components';

export const StaticValueDate = ({ repeatableIndex }) => {
  return (
    <Layout
      data-test-static-exact-date-wrapper
      className="display-flex"
    >
      <Field
        name={`profile.matchDetails[${repeatableIndex}].incomingMatchExpression.staticValueDetails.exactDate`}
        component={Datepicker}
        dateFormat="YYYY-MM-DD"
      />
    </Layout>
  );
};

StaticValueDate.propTypes = { repeatableIndex: PropTypes.number.isRequired };
