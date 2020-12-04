import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  useJobLogsProperties,
  useJobLogsListFormatter,
} from '@folio/stripes-data-transfer-components';
import { Button } from '@folio/stripes/components';

import { listTemplate } from '../ListTemplate';
import {
  DEFAULT_JOB_LOG_COLUMNS,
  FILE_STATUSES,
} from '../../utils';

import sharedCss from '../../shared.css';

const customProperties = {
  visibleColumns: DEFAULT_JOB_LOG_COLUMNS,
  columnWidths: {
    hrId: '60px',
    totalRecords: '80px',
  },
  columnMapping: {
    fileName: 'ui-data-import.fileName',
    status: 'ui-data-import.status',
    jobExecutionHrId: 'ui-data-import.jobExecutionHrId',
    jobProfileName: 'ui-data-import.jobProfileName',
    records: 'ui-data-import.records',
    jobCompletedDate: 'ui-data-import.jobCompletedDate',
    runBy: 'ui-data-import.runBy',
  },
};

export const JobLogsContainer = props => {
  const {
    children,
    ...rest
  } = props;

  const { formatMessage } = useIntl();

  const fileNameCellFormatter = record => (
    <Button
      buttonStyle="link"
      marginBottom0
      to={`/data-import/job-summary/${record.id}`}
      buttonClass={sharedCss.cellLink}
      onClick={e => e.stopPropagation()}
    >
      {record.fileName}
    </Button>
  );

  const statusCellFormatter = record => {
    const {
      status,
      progress,
    } = record;

    if (status === FILE_STATUSES.ERROR) {
      if (progress && progress.current > 0) {
        return formatMessage({ id: 'ui-data-import.completedWithErrors' });
      }

      return formatMessage({ id: 'ui-data-import.failed' });
    }

    return formatMessage({ id: 'ui-data-import.completed' });
  };

  const listProps = {
    ...useJobLogsProperties(customProperties),
    resultsFormatter: useJobLogsListFormatter(
      {
        ...listTemplate({}),
        status: statusCellFormatter,
        fileName: fileNameCellFormatter,
      },
    ),
  };

  return (
    <>
      {children({
        listProps,
        ...rest,
      })}
    </>
  );
};

JobLogsContainer.propTypes = { children: PropTypes.func.isRequired };
