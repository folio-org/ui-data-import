import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  MultiColumnList,
} from '@folio/stripes-components';

import {
  MAPPING_REPEATABLE_FIELD_ACTIONS,
  REPEATABLE_ACTIONS,
} from '../../../../utils';
import { getContentData } from '../utils';

export const ViewRepeatableField = ({
  repeatableAction,
  fieldData,
  visibleColumns,
  columnMapping,
  formatter,
  labelId,
}) => {
  const repeatableActionValue = MAPPING_REPEATABLE_FIELD_ACTIONS.find(action => action.value === repeatableAction)?.label;
  const isTableVisible = repeatableAction !== REPEATABLE_ACTIONS.DELETE_EXISTING;

  const renderTable = () => (
    <MultiColumnList
      contentData={getContentData(fieldData)}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      formatter={formatter}
    />
  );

  return (
    <KeyValue label={<FormattedMessage id={labelId} />}>
      {repeatableActionValue && <FormattedMessage id={repeatableActionValue} />}
      {isTableVisible && renderTable()}
    </KeyValue>
  );
};

ViewRepeatableField.propTypes = {
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnMapping: PropTypes.object.isRequired,
  labelId: PropTypes.string.isRequired,
  repeatableAction: PropTypes.string,
  fieldData: PropTypes.arrayOf(PropTypes.object),
  formatter: PropTypes.object,
};
