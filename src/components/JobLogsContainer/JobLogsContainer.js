import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Button } from '@folio/stripes/components';
import { useJobLogsProperties } from '@folio/stripes-data-transfer-components';

import { listTemplate } from '../ListTemplate';

import {
  DEFAULT_JOB_LOG_COLUMNS,
  DEFAULT_JOB_LOG_COLUMNS_WIDTHS,
  checkboxListShape,
  getJobLogsListColumnMapping,
} from '../../utils';

import sharedCss from '../../shared.css';
import { statusCellFormatter } from '../../utils/formatStatusCell';

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

  const customProperties = {
    visibleColumns: DEFAULT_JOB_LOG_COLUMNS,
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
};
