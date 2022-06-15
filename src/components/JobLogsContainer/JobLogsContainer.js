import React from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { TextLink } from '@folio/stripes/components';
import { useJobLogsProperties } from '@folio/stripes-data-transfer-components';
import {
  stripesShape,
  withStripes,
} from '@folio/stripes/core';

import { listTemplate } from '../ListTemplate';

import {
  DEFAULT_JOB_LOG_COLUMNS_WIDTHS,
  DEFAULT_JOB_LOG_COLUMNS,
  checkboxListShape,
  getJobLogsListColumnMapping,
  statusCellFormatter,
  permissions,
} from '../../utils';

const JobLogsContainer = props => {
  const {
    children,
    checkboxList: {
      isAllSelected,
      handleSelectAllCheckbox,
      selectRecord,
      selectedRecords,
    },
    stripes,
    ...rest
  } = props;

  const { formatMessage } = useIntl();
  const {
    pathname,
    search,
  } = useLocation();

  const fileNameCellFormatter = record => (
    <TextLink
      to={{
        pathname: `/data-import/job-summary/${record.id}`,
        state: { from: `${pathname}${search}` },
      }}
    >
      {record.fileName || formatMessage({ id: 'ui-data-import.noFileName' }) }
    </TextLink>
  );
  const hasDeletePermission = stripes.hasPerm(permissions.DELETE_LOGS);

  const customProperties = {
    visibleColumns: hasDeletePermission ? ['selected', ...DEFAULT_JOB_LOG_COLUMNS] : DEFAULT_JOB_LOG_COLUMNS,
    columnWidths: DEFAULT_JOB_LOG_COLUMNS_WIDTHS,
  };

  const listProps = {
    ...useJobLogsProperties(customProperties),
    columnMapping: getJobLogsListColumnMapping({ isAllSelected, handleSelectAllCheckbox }),
    resultsFormatter: {
      ...listTemplate({
        selectRecord,
        selectedRecords,
      }),
      fileName: fileNameCellFormatter,
      status: statusCellFormatter(formatMessage),
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
};

export default withStripes(JobLogsContainer);
