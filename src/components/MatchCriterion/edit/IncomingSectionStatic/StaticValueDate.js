import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

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
      <FormattedMessage id="ui-data-import.match.incoming.static.value-type.date">
        {([ariaLabel]) => (
          <Field
            name={`profile.matchDetails[${repeatableIndex}].incomingMatchExpression.staticValueDetails.exactDate`}
            component={Datepicker}
            dateFormat="YYYY-MM-DD"
            aria-label={ariaLabel}
          />
        )}
      </FormattedMessage>
    </Layout>
  );
};

StaticValueDate.propTypes = { repeatableIndex: PropTypes.number.isRequired };
