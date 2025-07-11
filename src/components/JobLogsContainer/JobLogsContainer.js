import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  useJobLogsProperties,
  listTemplate,
} from '@folio/stripes-data-transfer-components';
import {
  stripesShape,
  withStripes,
} from '@folio/stripes/core';
import { UploadingJobsContext } from '../UploadingJobsContextProvider/UploadingJobsContext';

import {
  DEFAULT_JOB_LOG_COLUMNS_WIDTHS,
  DEFAULT_JOB_LOG_COLUMNS,
  checkboxListShape,
  getJobLogsListColumnMapping,
  statusCellFormatter,
  permissions,
  fieldsConfig,
  jobProfileNameCellFormatter,
  fileNameCellFormatter,
} from '../../utils';

const JobLogsContainer = props => {
  const {
    children,
    checkboxesDisabled = false,
    checkboxList: {
      isAllSelected,
      handleSelectAllCheckbox,
      selectRecord,
      selectedRecords,
    },
    stripes,
    ...rest
  } = props;

  const {
    formatMessage,
    formatNumber,
  } = useIntl();
  const location = useLocation();
  const { uploadConfiguration } = useContext(UploadingJobsContext);
  const hasDeletePermission = stripes.hasPerm(permissions.DELETE_LOGS);

  const getVisibleColumns = () => {
    const baseColumns = [...DEFAULT_JOB_LOG_COLUMNS];
    if (uploadConfiguration?.canUseObjectStorage) {
      baseColumns.splice(3, 0, 'jobParts');
    }
    return hasDeletePermission ? ['selected', ...baseColumns] : baseColumns;
  };

  const customProperties = {
    visibleColumns: getVisibleColumns(),
    columnWidths: DEFAULT_JOB_LOG_COLUMNS_WIDTHS,
  };

  const listProps = {
    ...useJobLogsProperties(customProperties),
    columnMapping: getJobLogsListColumnMapping({
      isAllSelected,
      handleSelectAllCheckbox,
      checkboxDisabled: checkboxesDisabled,
    }),
    resultsFormatter: {
      ...listTemplate({
        selectRecord,
        selectedRecords,
        checkboxDisabled: checkboxesDisabled,
        fieldsConfig,
        formatNumber,
      }),
      fileName: record => fileNameCellFormatter(record, location, false),
      status: statusCellFormatter(formatMessage),
      jobProfileName: jobProfileNameCellFormatter,
      jobParts: record => formatMessage({ id: 'ui-data-import.logViewer.partOfTotal' }, { number: record.jobPartNumber, total: record.totalJobParts }),
    },
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
  stripes: stripesShape.isRequired,
  checkboxesDisabled: PropTypes.bool,
};

export default withStripes(JobLogsContainer);
