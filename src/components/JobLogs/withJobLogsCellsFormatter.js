import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
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
        fileName: this.formatFileName,
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

    formatFileName = record => (
      <Button
        buttonStyle="link"
        marginBottom0
        to={`/data-import/log/${record.jobExecutionId}`}
        style={{
          marginTop: '5px',
          marginBottom: '5px',
          color: 'inherit',
        }}
        target="_blank"
      >
        {record.fileName}
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
