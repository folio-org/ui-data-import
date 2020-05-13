import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedDate,
  FormattedTime,
  FormattedMessage,
} from 'react-intl';
import { noop } from 'lodash';
import classNames from 'classnames';

import { Button } from '@folio/stripes/components';

import { Progress } from '../../../Progress';
import { jobMetaTypes } from './jobMetaTypes';
import { jobExecutionPropTypes } from './jobExecutionPropTypes';

import css from './Job.css';

@injectIntl
export class Job extends Component {
  static propTypes = {
    job: jobExecutionPropTypes.isRequired,
    intl: PropTypes.object.isRequired,
    handlePreview: PropTypes.func,
  };

  static defaultProps = { handlePreview: noop };

  checkDateIsToday = date => {
    const { intl: { formatDate } } = this.props;

    return formatDate(new Date()) === formatDate(date);
  };

  formatTime(dateStr) {
    const isToday = this.checkDateIsToday(dateStr);
    const datePart = !isToday && <FormattedDate value={dateStr} />;
    const timePart = <FormattedTime value={dateStr} />;
    const todayPart = isToday && <FormattedMessage id="ui-data-import.today" />;

    return <span>{datePart} {timePart} {todayPart}</span>;
  }

  render() {
    const {
      job,
      handlePreview,
    } = this.props;

    const {
      jobProfileInfo: { name },
      fileName,
      uiStatus,
      hrId,
      runBy: {
        firstName,
        lastName,
      },
      progress: {
        current,
        total,
      },
    } = job;
    const jobMeta = jobMetaTypes[uiStatus](job);
    const dateLabelId = `ui-data-import.${jobMeta.dateLabel}Running`;

    return (
      <div
        data-test-job-item
        className={css.job}
      >
        <div className={classNames(css.delimiter, css.jobHeader)}>
          <span>{name}</span>
          <span>{fileName}</span>
        </div>

        <div className={css.delimiter}>
          <span>{hrId}</span>
          <FormattedMessage
            id="ui-data-import.triggeredBy"
            values={{ userName: `${firstName} ${lastName}` }}
            tagName="span"
          />
        </div>

        <div className={css.delimiter}>
          {jobMeta && (
            <FormattedMessage
              id="ui-data-import.recordsCount"
              values={{ count: total }}
              tagName="span"
            />
          )}
          <span data-test-date-label>
            <FormattedMessage
              id={dateLabelId}
              values={{ time: this.formatTime(jobMeta.date) }}
            />
          </span>
        </div>

        {jobMeta.showProgress && (
          <>
            <FormattedMessage
              id="ui-data-import.progressRunning"
              tagName="div"
            />
            <Progress
              current={current}
              total={total}
            />
          </>
        )}

        {jobMeta.showPreview && (
          <div className={css.jobPreview}>
            <FormattedMessage id="ui-data-import.readyForPreview" />
            <Button
              data-test-preview-now-button
              buttonStyle="primary"
              marginBottom0
              onClick={handlePreview}
            >
              <FormattedMessage id="ui-data-import.previewNow" />
            </Button>
          </div>
        )}
      </div>
    );
  }
}
