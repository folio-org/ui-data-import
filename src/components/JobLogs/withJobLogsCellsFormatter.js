import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
  intlShape,
} from 'react-intl';

import { Button } from '@folio/stripes/components';

import { compose } from '../../utils';

const withJobLogsCellsFormatterComponent = WrappedComponent => {
  return class extends Component {
    static propTypes = {
      intl: intlShape.isRequired,
      formatter: PropTypes.object,
    };

    static defaultProps = { formatter: {} };

    constructor(props) {
      super(props);

      this.cellFormatters = {
        ...props.formatter,
        runBy: this.formatUser,
        completedDate: this.formatEndedRunningDate,
        log: this.createLogButton,
      };
    }

    formatUser(record) {
      const {
        runBy: {
          firstName,
          lastName,
        },
      } = record;

      return `${firstName} ${lastName}`;
    }

    formatEndedRunningDate = record => {
      const { intl: { formatTime } } = this.props;

      const { completedDate } = record;

      return formatTime(completedDate, {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      });
    };

    createLogButton = record => (
      <Button
        buttonStyle="primary"
        marginBottom0
        to={`/data-import/log/${record.jobExecutionId}`}
        target="_blank"
      >
        <FormattedMessage id="ui-data-import.log" />
      </Button>
    );

    render() {
      return (
        <WrappedComponent
          {...this.props}
          formatter={this.cellFormatters}
        />
      );
    }
  };
};

export const withJobLogsCellsFormatter = compose(
  injectIntl,
  withJobLogsCellsFormatterComponent,
);
