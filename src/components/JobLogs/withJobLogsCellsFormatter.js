import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedTime } from 'react-intl';

const withJobLogsCellsFormatter = WrappedComponent => {
  return class extends Component {
    static propTypes = {
      formatter: PropTypes.object,
    };

    static defaultProps = {
      formatter: {},
    };

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
      const { completedDate } = record;

      return (
        <FormattedTime
          value={completedDate}
          day="numeric"
          month="numeric"
          year="numeric"
        />
      );
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

export default withJobLogsCellsFormatter;
