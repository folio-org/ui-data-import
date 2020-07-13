import React from 'react';
import {
  FormattedDate,
  FormattedMessage,
} from 'react-intl';

import {
  Layout,
  Headline, NoValue,
} from '@folio/stripes/components';

import css from '../ViewMatchCriterion.css';

export const StaticValueDateRange = ({
  fromDate,
  toDate,
}) => {
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
      {fromDate ? <FormattedDate value={fromDate} /> : <NoValue />}
      <Headline
        weight="regular"
        margin="none"
        className={css.dateRangeLabel}
      >
        <FormattedMessage id="ui-data-import.to" />
      </Headline>
      {toDate ? <FormattedDate value={toDate} /> : <NoValue />}
    </Layout>
  );
};
