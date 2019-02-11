import React, {
  Component,
  Fragment,
} from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  intlShape,
  FormattedDate,
  FormattedTime,
  FormattedMessage,
} from 'react-intl';
import { noop } from 'lodash';
import classNames from 'classnames';

import { Button } from '@folio/stripes/components';

import Progress from '../../../Progress';
import jobMetaTypes from './jobMetaTypes';
import jobPropTypes from './jobPropTypes';

import css from './Job.css';

class Job extends Component {
  static propTypes = {
    job: jobPropTypes.isRequired,
    intl: intlShape.isRequired,
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

    return (
      <span>{datePart} {timePart} {todayPart}</span>
    );
  }

  render() {
    const {
      job,
      handlePreview,
    } = this.props;

    const {
      jobProfileName,
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
          <span>{jobProfileName}</span>
          <span>{fileName}</span>
        </div>

        <div className={css.delimiter}>
          <span>{hrId}</span>
          <span>
            <FormattedMessage id="ui-data-import.triggeredBy" /> <span>{firstName} {lastName}</span>
          </span>
        </div>

        <div className={css.delimiter}>
          {jobMeta && (
            <span>
              <FormattedMessage
                id="ui-data-import.recordsCount"
                values={{ count: total }}
              />
            </span>
          )}
          <span>
            <span data-test-date-label><FormattedMessage id={dateLabelId} /></span> {this.formatTime(jobMeta.date)}
          </span>
        </div>

        {jobMeta.showProgress && (
          <Fragment>
            <div>
              <FormattedMessage id="ui-data-import.progressRunning" />
            </div>
            <div data-test-progress-bar>
              <Progress
                current={current}
                total={total}
              />
            </div>
          </Fragment>
        )}

        {jobMeta.showPreview && (
          <div className={css.jobPreview}>
            <FormattedMessage id="ui-data-import.readyForPreview" />
            <div data-test-preview-now-button>
              <Button
                buttonStyle="primary"
                marginBottom0
                onClick={handlePreview}
              >
                <FormattedMessage id="ui-data-import.previewNow" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default injectIntl(Job);
