import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import noop from 'lodash/noop';

import {
  FormattedDate,
  FormattedTime,
  FormattedMessage,
  FormattedNumber,
  FormattedPlural,
} from 'react-intl';

import { Button } from '@folio/stripes/components';

import Progress from '../Progress';
import jobMetaTypes from './jobMetaTypes';
import jobPropTypes from './jobPropTypes';

import css from './Job.css';

class Job extends Component {
  static defaultProps = {
    handlePreview: noop,
  };

  static propTypes = {
    job: jobPropTypes.isRequired,
    checkDateIsToday: PropTypes.func.isRequired,
    handlePreview: PropTypes.func,
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
      jobExecutionHrId,
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
          <span>{jobExecutionHrId}</span>
          <span>
            <FormattedMessage id="ui-data-import.triggeredBy" /> <span>{firstName} {lastName}</span>
          </span>
        </div>

        <div className={css.delimiter}>
          {jobMeta && (
            <span>
              <FormattedNumber value={total} />{' '}
              <FormattedPlural
                value={total}
                one={<FormattedMessage id="ui-data-import.record" />}
                other={<FormattedMessage id="ui-data-import.records" />}
              />
            </span>
          )}
          <span><FormattedMessage id={dateLabelId} /> {this.formatTime(jobMeta.date)}</span>
        </div>

        {jobMeta.showProgress && (
          <Fragment>
            <div>
              <FormattedMessage id="ui-data-import.progressRunning" />
            </div>
            <Progress
              current={current}
              total={total}
            />
          </Fragment>
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
