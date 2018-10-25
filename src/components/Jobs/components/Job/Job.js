import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';

import {
  FormattedDate,
  FormattedTime,
  FormattedMessage,
} from 'react-intl';

import { Button } from '@folio/stripes/components';

import Progress from '../Progress';
import jobMetaTypes from './jobMetaTypes';

import css from './Job.css';

class Job extends React.Component {
  static defaultProps = {
    handlePreview: noop, // TODO: to be implemented in further stories
  };

  static propTypes = {
    job: PropTypes.shape({
      jobExecutionHRID: PropTypes.string.isRequired,
      jobProfileName: PropTypes.string.isRequired,
      fileName: PropTypes.string.isRequired,
      startedDate: PropTypes.string.isRequired,
      completedDate: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      runBy: PropTypes.shape({
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
      }).isRequired,
      progress: PropTypes.shape({
        current: PropTypes.number.isRequired,
        total: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
    handlePreview: PropTypes.func,
    checkDateIsToday: PropTypes.func.isRequired,
  };

  formatTime(dateStr) {
    const isToday = this.props.checkDateIsToday(dateStr);
    const datePart = !isToday && <FormattedDate value={dateStr} />;
    const timePart = <FormattedTime value={dateStr} />;
    const todayPart = isToday && <FormattedMessage id="ui-data-import.today" />;

    return (
      <span>{datePart} {timePart} {todayPart}</span>
    );
  }

  getRootClasses() {
    return classNames(css.delimiter, css.jobHeader);
  }

  render() {
    const { job } = this.props;
    const {
      jobProfileName,
      fileName,
      status,
      jobExecutionHRID,
      runBy: {
        firstName,
        lastName,
      },
      progress: {
        current,
        total,
      },
    } = job;
    const jobMeta = jobMetaTypes[status](job);
    const dateLabelId = `ui-data-import.${jobMeta.dateLabel}Running`;

    return (
      <div className={css.job}>
        <div className={this.getRootClasses()}>
          <span>{jobProfileName}</span>
          <span>{fileName}</span>
        </div>

        <div className={css.delimiter}>
          <span>{jobExecutionHRID}</span>
          <span>
            <FormattedMessage id="ui-data-import.triggeredBy" /> <span>{firstName} {lastName}</span>
          </span>
        </div>

        <div>
          <FormattedMessage id={dateLabelId} /> {this.formatTime(jobMeta.date)}
        </div>

        {jobMeta.showProgress && (
          <Progress
            current={current}
            total={total}
            progressInfoType={jobMeta.progressType}
          />
        )}

        {jobMeta.showPreview && (
          <div className={css.jobPreview}>
            <FormattedMessage id="ui-data-import.readyForPreview" />
            <Button
              buttonStyle="primary"
              marginBottom0
              onClick={this.props.handlePreview}
            >
              <FormattedMessage id="ui-data-import.previewNow" />
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default Job;
