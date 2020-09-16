import React from 'react';
import { PropTypes } from 'prop-types';
import { useIntl } from 'react-intl';

import css from './MARCTable.css';

export const MARCTableHeader = ({
  columns,
  columnWidths,
  isMarcFieldProtectionSettings,
}) => {
  const { formatMessage } = useIntl();

  const headerLabels = {
    arrows: '',
    action: formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.action' }),
    field: formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.field' }),
    indicator1: formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.indicator1' }),
    indicator2: formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.indicator2' }),
    subfield: formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.subfield' }),
    subaction: formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.subaction' }),
    data: formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.data' }),
    position: formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.position' }),
    override: formatMessage({ id: 'ui-data-import.settings.mappingProfile.marcTable.header.override' }),
    addRemove: '',
  };

  const renderHeadline = (header, i) => {
    const headerStyle = {
      width: columnWidths[header],
      flexGrow: (header === 'data') && !isMarcFieldProtectionSettings && 1,
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
  columnWidths: PropTypes.object.isRequired,
  isMarcFieldProtectionSettings: PropTypes.bool,
};
