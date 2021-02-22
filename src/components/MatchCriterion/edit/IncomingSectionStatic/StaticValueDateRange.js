import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Layout,
  Datepicker,
  Headline,
} from '@folio/stripes/components';

import css from '../MatchCriterions.css';

export const StaticValueDateRange = ({ repeatableIndex }) => {
  return (
    <Layout
      data-test-static-date-range-field
      className="display-flex"
    >
      <Headline
        weight="regular"
        margin="none"
        className={css.dateRangeLabel}
      >
        <FormattedMessage id="ui-data-import.from" />
      </Headline>
      <FormattedMessage id="ui-data-import.match.incoming.static.value-type.date-range">
        {([ariaLabel]) => (
          <Field
            name={`profile.matchDetails[${repeatableIndex}].incomingMatchExpression.staticValueDetails.fromDate`}
            component={Datepicker}
            dateFormat="YYYY-MM-DD"
            aria-label={ariaLabel}
          />
        )}
      </FormattedMessage>

      <Headline
        weight="regular"
        margin="none"
        className={css.dateRangeLabel}
      >
        <FormattedMessage id="ui-data-import.to" />
      </Headline>
      <FormattedMessage id="ui-data-import.match.incoming.static.value-type.date-range">
        {([ariaLabel]) => (
          <Field
            name={`profile.matchDetails[${repeatableIndex}].incomingMatchExpression.staticValueDetails.toDate`}
            component={Datepicker}
            dateFormat="YYYY-MM-DD"
            aria-label={ariaLabel}
          />
        )}
      </FormattedMessage>
    </Layout>
  );
};

StaticValueDateRange.propTypes = { repeatableIndex: PropTypes.number.isRequired };
