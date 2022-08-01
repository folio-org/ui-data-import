import React, {
  Component,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  injectIntl,
  FormattedMessage,
} from 'react-intl';
import { noop } from 'lodash';
import classNames from 'classnames';

import {
  withStripes,
  stripesShape,
  IfPermission,
} from '@folio/stripes/core';

import {
  Button,
  IconButton,
  Callout,
  FormattedDate,
  FormattedTime, ConfirmationModal,
} from '@folio/stripes/components';
import {
  Progress,
  createOkapiHeaders,
  createUrl,
} from '@folio/stripes-data-transfer-components';
import { permissions } from '../../../../utils';

import { jobMetaTypes } from './jobMetaTypes';
import { jobExecutionPropTypes } from './jobExecutionPropTypes';

import * as API from '../../../../utils/upload';

import css from './Job.css';

@withStripes
@injectIntl
export class Job extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    job: jobExecutionPropTypes.isRequired,
    intl: PropTypes.object.isRequired,
    handlePreview: PropTypes.func,
  };

  static defaultProps = { handlePreview: noop };

  state = {
    deletionInProgress: false,
    showDeleteConfirmation: false,
  };

  showDeleteConfirmation = () => {
    this.setState({ showDeleteConfirmation: true });
  }

  hideDeleteConfirmation = () => {
    this.setState({ showDeleteConfirmation: false });
  };

  calloutRef = createRef();

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

  createJobUrl = id => {
    const { stripes: { okapi: { url: host } } } = this.props;

    return createUrl(`${host}/change-manager/jobExecutions/${id}/records`);
  };

  deleteJob = async job => {
    const { stripes: { okapi } } = this.props;

    const {
      jobProfileInfo: { name },
      id,
    } = job;

    try {
      await API.deleteFile(
        this.createJobUrl(id),
        createOkapiHeaders(okapi),
      );
    } catch (error) {
      this.setState({ deletionInProgress: false });

      const errorMessage = (
        <FormattedMessage
          id="ui-data-import.jobDeleteError"
          values={{ name: <strong>{name}</strong> }}
        />
      );

      this.calloutRef.current.sendCallout({
        type: 'error',
        message: errorMessage,
      });

      console.error(error); // eslint-disable-line no-console
    }
  };

  handleDeleteJob = async () => {
    const { job } = this.props;

    this.setState({ deletionInProgress: true });
    this.hideDeleteConfirmation();

    await this.deleteJob(job);
  };

  render() {
    const {
      job,
      handlePreview,
    } = this.props;

    const {
      showDeleteConfirmation,
      deletionInProgress,
    } = this.state;

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
    const isDeletionInProgress = showDeleteConfirmation || deletionInProgress;

    return (
      <li
        data-test-job-item
        className={classNames(css.job, isDeletionInProgress && css.deletingInProgress)}
      >
        <div className={classNames(css.delimiter, css.jobHeader)}>
          <span>{name}</span>
          <span>
            {fileName}
            {isDeletionInProgress && (
              <>
              &nbsp;
                <FormattedMessage
                  id="ui-data-import.stoppedJob"
                  tagName="span"
                />
              </>
            )}
          </span>
        </div>
        <IfPermission perm={permissions.DATA_IMPORT_MANAGE}>
          <FormattedMessage id="ui-data-import.delete">
            {label => (
              <IconButton
                data-test-delete-button
                icon="trash"
                size="small"
                ariaLabel={label}
                className={classNames(css.icon, css.deleteIcon)}
                onClick={this.showDeleteConfirmation}
              />
            )}
          </FormattedMessage>
        </IfPermission>
        {!isDeletionInProgress && (
          <>
            <div className={css.delimiter}>
              <span>{hrId}</span>
              <FormattedMessage
                id="ui-data-import.triggeredBy"
                values={{ userName: firstName ? `${firstName} ${lastName}` : `${lastName}` }}
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
          </>
        )}
        <Callout ref={this.calloutRef} />
        <ConfirmationModal
          id="delete-selected-logs-modal"
          open={showDeleteConfirmation}
          heading={<FormattedMessage id="ui-data-import.modal.runningJobs.header" />}
          message={[
            <FormattedMessage id="ui-data-import.modal.runningJobs.message.header" />,
            <FormattedMessage id="ui-data-import.modal.runningJobs.message.body" values={{ br: <br /> }} />,
          ]}
          bodyTag="div"
          confirmLabel={<FormattedMessage id="ui-data-import.modal.runningJobs.confirm" />}
          cancelLabel={<FormattedMessage id="ui-data-import.modal.runningJobs.cancel" />}
          onConfirm={this.handleDeleteJob}
          onCancel={this.hideDeleteConfirmation}
        />
      </li>
    );
  }
}
