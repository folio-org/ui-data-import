import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import moment from 'moment';

import {
  Layout,
  Datepicker,
  Headline,
} from '@folio/stripes/components';

import { isFieldPristine } from '../../../../utils';

import css from '../MatchCriterions.css';

const DATE_FORMAT = 'YYYY-MM-DD';

export const StaticValueDateRange = ({ repeatableIndex }) => {
  const getDatesEqualState = (initialDate, newDate) => {
    const initialFormattedDate = moment.utc(initialDate, DATE_FORMAT).format();
    const newFormattedDate = moment.utc(newDate, DATE_FORMAT).format();

    return isFieldPristine(initialFormattedDate, newFormattedDate);
  };

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
            isEqual={getDatesEqualState}
            render={fieldProps => (
              <Datepicker
                {...fieldProps}
                aria-label={ariaLabel}
                dateFormat={DATE_FORMAT}
                dirty={fieldProps.meta.dirty}
              />
            )}
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
            isEqual={getDatesEqualState}
            render={fieldProps => (
              <Datepicker
                {...fieldProps}
                aria-label={ariaLabel}
                dateFormat={DATE_FORMAT}
                dirty={fieldProps.meta.dirty}
              />
            )}
          />
        )}
      </FormattedMessage>
    </Layout>
  );
};

StaticValueDateRange.propTypes = { repeatableIndex: PropTypes.number.isRequired };
