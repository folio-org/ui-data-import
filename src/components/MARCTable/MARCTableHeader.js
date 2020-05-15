import React from 'react';
import { PropTypes } from 'prop-types';

import css from './MARCTable.css';

export const MARCTableHeader = ({
  columns,
  columnWidths,
  intl,
}) => {
  const headerLabels = {
    arrows: '',
    action: intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.action' }),
    field: intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.field' }),
    indicator1: intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.in1' }),
    indicator2: intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.in2' }),
    subfield: intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.subfield' }),
    subaction: intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.subaction' }),
    data: intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.data' }),
    position: intl.formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.position' }),
    addRemove: '',
  };

  const renderHeadline = (header, i) => {
    const headerStyle = {
      width: columnWidths[header],
      flexGrow: (header === 'data') && 1,
    };

    return (
      <div
        data-test-marc-table-column-header
        key={i}
        style={headerStyle}
        className={css.tableHeaderCell}
      >
        {headerLabels[header]}
      </div>
    );
  };

  return (
    <div className={css.tableHeader}>
      {columns.map(renderHeadline)}
    </div>
  );
};

MARCTableHeader.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  intl: PropTypes.object.isRequired,
  columnWidths: PropTypes.object,
};
