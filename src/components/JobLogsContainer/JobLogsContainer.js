import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  useJobLogsProperties,
  useJobLogsListFormatter,
  DEFAULT_JOB_LOGS_COLUMNS,
} from '@folio/stripes-data-transfer-components';
import { Button } from '@folio/stripes/components';

import {
  CheckboxHeader,
  listTemplate,
} from '../ListTemplate';
import {
  DEFAULT_JOB_LOG_COLUMNS,
  FILE_STATUSES,
  checkboxListShape,
} from '../../utils';

import sharedCss from '../../shared.css';

export const JobLogsContainer = props => {
  const {
    children,
    checkboxList: {
      isAllSelected,
      handleSelectAllCheckbox,
      selectRecord,
      selectedRecords,
    },
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
      {record.fileName || formatMessage({ id: 'ui-data-import.noFileName' }) }
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
  const customProperties = {
    visibleColumns: DEFAULT_JOB_LOG_COLUMNS,
    columnWidths: {
      selected: '40px',
      hrId: '60px',
      totalRecords: '80px',
    },
  };
  const columnMapping = {
    selected: (
      <CheckboxHeader
        checked={isAllSelected}
        onChange={handleSelectAllCheckbox}
      />
    ),
    fileName: formatMessage({ id: 'ui-data-import.fileName' }),
    status: formatMessage({ id: 'ui-data-import.status' }),
    totalRecords: formatMessage({ id: 'ui-data-import.records' }),
    jobProfileName: formatMessage({ id: 'ui-data-import.jobProfileName' }),
    completedDate: formatMessage({ id: 'ui-data-import.jobCompletedDate' }),
    runBy: formatMessage({ id: 'ui-data-import.runBy' }),
    hrId: formatMessage({ id: 'ui-data-import.jobExecutionHrId' }),
  };

  const listProps = {
    ...useJobLogsProperties(customProperties),
    columnMapping,
    resultsFormatter: useJobLogsListFormatter(
      {
        ...listTemplate({
          selectRecord,
          selectedRecords,
        }),
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

JobLogsContainer.propTypes = {
  children: PropTypes.func.isRequired,
  checkboxList: checkboxListShape.isRequired,
};
