import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape,
} from 'react-intl';
import { compose } from '../../utils';

const withJobLogsCellsFormatter = WrappedComponent => {
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

export default compose(
  injectIntl,
  withJobLogsCellsFormatter,
);
