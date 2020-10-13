import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Layout,
  Headline,
  NoValue,
  FormattedDate,
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

StaticValueDateRange.propTypes = {
  fromDate: PropTypes.string,
  toDate: PropTypes.string,
};

StaticValueDateRange.defaultProps = {
  fromDate: '',
  toDate: '',
};
