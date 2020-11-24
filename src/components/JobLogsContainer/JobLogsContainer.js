import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import {
  useJobLogsProperties,
  useJobLogsListFormatter,
} from '@folio/stripes-data-transfer-components';
import {
  Button,
  Callout,
} from '@folio/stripes/components';

import { listTemplate } from '../ListTemplate';
import { DEFAULT_JOB_LOG_COLUMNS } from '../../utils';

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

  const calloutRef = useRef(null);

  const fileNameCellFormatter = record => (
    <Button
      buttonStyle="link"
      marginBottom0
      to={`/data-import/job-summary/${record.id}`}
      buttonClass={sharedCss.cellLink}
      target="_blank"
      onClick={e => e.stopPropagation()}
    >
      {record.fileName}
    </Button>
  );

  const listProps = {
    ...useJobLogsProperties(customProperties),
    resultsFormatter: useJobLogsListFormatter(
      {
        ...listTemplate({}),
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
      <Callout ref={calloutRef} />
    </>
  );
};

JobLogsContainer.propTypes = { children: PropTypes.func.isRequired };
