import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
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
  useOkapiKy,
} from '@folio/stripes/core';

import {
  Button,
  IconButton,
  Callout,
  ConfirmationModal,
  FormattedDate,
  FormattedTime,
  Layout
} from '@folio/stripes/components';
import {
  Progress,
  createOkapiHeaders,
  createUrl,
} from '@folio/stripes-data-transfer-components';
import { permissions, cancelMultipartJob } from '../../../../utils';

import { jobMetaTypes } from './jobMetaTypes';
import { jobExecutionPropTypes } from './jobExecutionPropTypes';

import * as API from '../../../../utils/upload';
import * as CompositeJobFields from '../../../../utils/compositeJobStatus';
import { trimLeadNumbers } from '../../../../utils/multipartUpload';

import {
  addHrid,
  deleteHrid,
  deselectRecord,
  selectRecord,
} from '../../../../redux/actions/jobExecutionsActionCreator';

import css from './Job.css';

const renderCompositeDetails = (jobEntry, previousProgress = { processed: 0, total: 100 }, updateProgress = noop) => {
  const {
    completedSliceAmount,
    erroredSliceAmount,
    failedSliceAmount,
    totalSliceAmount,
    inProgressRecords,
    completedRecords,
    failedRecords,
  } = CompositeJobFields.collectCompositeJobValues(jobEntry);

  const progress = CompositeJobFields.calculateCompositeProgress(
    {
      inProgressRecords,
      completedRecords,
      failedRecords
    },
    jobEntry.totalRecordsInFile,
    previousProgress,
    updateProgress
  );

  return (
    <>
      <FormattedMessage
        id="ui-data-import.progressRunning"
        tagName="div"
      />
      <Progress
        current={progress.processed}
        total={progress.total}
      />
      <FormattedMessage
        id="ui-data-import.jobProgress.partsRemaining"
        tagName="div"
        values={{
          current: totalSliceAmount - (failedSliceAmount + completedSliceAmount),
          total: totalSliceAmount
        }}
      />
      <FormattedMessage
        id="ui-data-import.jobProgress.partsProcessed"
        tagName="div"
        values={{
          current: failedSliceAmount + completedSliceAmount,
          total: totalSliceAmount,
        }}
      />
      <ul className={css.compositeList}>
        <li className={css.listItem}>
          <FormattedMessage
            id="ui-data-import.jobProgress.partsCompleted"
            tagName="div"
            values={{ amount: completedSliceAmount }}
          />
        </li>
        <li className={css.listItem}>
          <FormattedMessage
            id="ui-data-import.jobProgress.partsCompletedWithErrors"
            tagName="div"
            values={{ amount: erroredSliceAmount }}
          />
        </li>
      </ul>
    </>
  );
};


const propTypes = {
  stripes: stripesShape.isRequired,
  job: jobExecutionPropTypes.isRequired,
  intl: PropTypes.object.isRequired,
  handlePreview: PropTypes.func,
};

const JobComponent = ({
  stripes,
  job,
  intl,
  handlePreview = noop,
}) => {
  const [deletionInProgress, setDeletionInProgress] = useState(false);
  const [showCancelJobModal, setShowCancelJobModal] = useState(false);
  const [compositeProgress, updateCompositeProgress] = useState({ processed: 0, total: 100 });
  const calloutRef = useRef();
  const dispatch = useDispatch();
  const okapiKy = useOkapiKy();

  useEffect(() => {
    return () => dispatch(deleteHrid(job.hrId));
  }, [dispatch, job.hrId]);

  dispatch(addHrid(job.hrId));

  const onDeleteClick = () => {
    setShowCancelJobModal(true);
    dispatch(selectRecord(job.hrId));
  };

  const hideCancelJobConfirmationModal = () => {
    setShowCancelJobModal(false);
  };

  const checkDateIsToday = date => {
    const { formatDate } = intl;

    return formatDate(new Date()) === formatDate(date);
  };

  const formatTime = dateStr => {
    const isToday = checkDateIsToday(dateStr);
    const datePart = !isToday && <FormattedDate value={dateStr} />;
    const timePart = <FormattedTime value={dateStr} />;
    const todayPart = isToday && <FormattedMessage id="ui-data-import.today" />;

    return <span>{datePart} {timePart} {todayPart}</span>;
  };

  const createJobUrl = id => {
    const { okapi: { url: host } } = stripes;

    return createUrl(`${host}/change-manager/jobExecutions/${id}/records`);
  };

  const deleteJob = async () => {
    const { okapi } = stripes;

    const {
      jobProfileInfo: { name },
      id,
    } = job;

    try {
      if (job.compositeDetails) {
        await cancelMultipartJob(okapiKy, id);
      } else {
        await API.deleteFile(
          createJobUrl(id),
          createOkapiHeaders(okapi),
        );
      }
    } catch (error) {
      setDeletionInProgress(false);

      const errorMessage = (
        <FormattedMessage
          id="ui-data-import.jobDeleteError"
          values={{ name: <strong>{name}</strong> }}
        />
      );

      calloutRef.current.sendCallout({
        type: 'error',
        message: errorMessage,
      });

      console.error(error); // eslint-disable-line no-console
    }
  };

  const handleDeleteJob = async () => {
    dispatch(deselectRecord(job.hrId));
    setDeletionInProgress(true);
    hideCancelJobConfirmationModal();

    await deleteJob();
  };

  const renderCancelModalMessage = (jobEntry) => {
    const {
      completedSliceAmount,
      totalSliceAmount,
    } = CompositeJobFields.collectCompositeJobValues(jobEntry);

    return (
      <>
        <FormattedMessage id="ui-data-import.modal.cancelRunningSplitJob.message" />
        <p>
          <FormattedMessage
            id="ui-data-import.modal.cancelRunningSplitJob.message.pleaseNote"
          />
        </p>
        <Layout className={`${css.compositeList} padding-end-gutter padding-start-gutter`} element="ul">
          <li className={css.listItem}>
            <FormattedMessage id="ui-data-import.modal.cancelRunningSplitJob.message.noRestart" />
          </li>
          <li className={css.listItem}>
            <FormattedMessage id="ui-data-import.modal.cancelRunningSplitJob.message.noRevert" />
          </li>
          <li className={css.listItem}>
            <FormattedMessage
              id="ui-data-import.modal.cancelRunningSplitJob.message.jobParts"
              values={{ current: completedSliceAmount, total: totalSliceAmount }}
            />
          </li>
          <li className={css.listItem}>
            <FormattedMessage
              id="ui-data-import.modal.cancelRunningSplitJob.message.remaining"
              values={{ remaining: totalSliceAmount - completedSliceAmount }}
            />
          </li>
        </Layout>
      </>
    );
  };

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
  const isDeletionInProgress = showCancelJobModal || deletionInProgress;
  const currentProgress = current <= total ? current : total;

  return (
    <li
      data-test-job-item
      className={classNames(css.job, isDeletionInProgress && css.deletingInProgress)}
    >
      <div className={classNames(css.delimiter, css.jobHeader)}>
        <span>{name}</span>
        &nbsp;
        <span>
          {trimLeadNumbers(fileName)}
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
          {([label]) => (
            <IconButton
              data-test-delete-button
              icon="trash"
              size="small"
              ariaLabel={label}
              className={classNames(css.icon, css.deleteIcon)}
              onClick={onDeleteClick}
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
                values={{ count: job.compositeDetails ? job.totalRecordsInFile : total }}
                tagName="span"
              />
            )}
            <span data-test-date-label>
              <FormattedMessage
                id={dateLabelId}
                values={{ time: formatTime(jobMeta.date) }}
              />
            </span>
          </div>
          {jobMeta.showProgress && !job.compositeDetails && (
            <>
              <FormattedMessage
                id="ui-data-import.progressRunning"
                tagName="div"
              />
              <Progress
                current={currentProgress}
                total={total}
              />
            </>
          )}
          {job.compositeDetails && renderCompositeDetails(job, compositeProgress, updateCompositeProgress)}
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
      <Callout ref={calloutRef} />
      <ConfirmationModal
        id="cancel-running-job-modal"
        open={showCancelJobModal}
        heading={job.compositeDetails ?
          <FormattedMessage id="ui-data-import.modal.cancelRunningSplitJob.header" /> :
          <FormattedMessage id="ui-data-import.modal.cancelRunningJob.header" />
          }
        message={job.compositeDetails ?
          renderCancelModalMessage(job) :
          <FormattedMessage
            id="ui-data-import.modal.cancelRunningJob.message"
            values={{ break: <br /> }}
          />
        }
        bodyTag="div"
        confirmLabel={<FormattedMessage id="ui-data-import.modal.cancelRunningJob.confirm" />}
        cancelLabel={<FormattedMessage id="ui-data-import.modal.cancelRunningJob.cancel" />}
        onConfirm={handleDeleteJob}
        onCancel={hideCancelJobConfirmationModal}
      />
    </li>
  );
};

JobComponent.propTypes = propTypes;

export const Job = withStripes(injectIntl(JobComponent));
