import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { TextLink } from '@folio/stripes/components';
import { useJobLogsProperties } from '@folio/stripes-data-transfer-components';
import { stripesShape } from '@folio/stripes-core';

import { listTemplate } from '../ListTemplate';

import {
  DEFAULT_JOB_LOG_COLUMNS_WIDTHS,
  checkboxListShape,
  getJobLogsListColumnMapping,
  statusCellFormatter,
  setVisibleColumns,
} from '../../utils';

export const JobLogsContainer = props => {
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

  const fileNameCellFormatter = record => (
    <TextLink
      to={`/data-import/job-summary/${record.id}`}
    >
      {record.fileName || formatMessage({ id: 'ui-data-import.noFileName' }) }
    </TextLink>
  );

  const customProperties = {
    visibleColumns: setVisibleColumns(stripes),
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
