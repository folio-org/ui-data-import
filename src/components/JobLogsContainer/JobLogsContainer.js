import React from 'react';
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

  const { formatMessage } = useIntl();

  const fileNameCellFormatter = record => (
    <TextLink
      to={`/data-import/job-summary/${record.id}`}
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
  checkboxesDisabled: PropTypes.bool,
};

export default withStripes(JobLogsContainer);
