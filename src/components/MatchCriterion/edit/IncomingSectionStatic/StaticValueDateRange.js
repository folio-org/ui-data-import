import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

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
      <Field
        name={`profile.matchDetails[${repeatableIndex}].incomingMatchExpression.staticValueDetails.fromDate`}
        component={Datepicker}
        dateFormat="YYYY-MM-DD"
      />
      <Headline
        weight="regular"
        margin="none"
        className={css.dateRangeLabel}
      >
        <FormattedMessage id="ui-data-import.to" />
      </Headline>
      <Field
        name={`profile.matchDetails[${repeatableIndex}].incomingMatchExpression.staticValueDetails.toDate`}
        component={Datepicker}
        dateFormat="YYYY-MM-DD"
      />
    </Layout>
  );
};
