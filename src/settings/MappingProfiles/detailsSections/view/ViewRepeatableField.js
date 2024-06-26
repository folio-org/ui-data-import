import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  KeyValue,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  MAPPING_REPEATABLE_FIELD_ACTIONS,
  REPEATABLE_ACTIONS,
  repeatableFieldActionShape,
} from '../../../../utils';
import { getContentData } from '../utils';

export const ViewRepeatableField = ({
  repeatableAction,
  repeatableFieldActions = MAPPING_REPEATABLE_FIELD_ACTIONS,
  repeatableActionToDelete = REPEATABLE_ACTIONS.DELETE_EXISTING,
  fieldData,
  visibleColumns,
  columnMapping,
  formatter,
  labelId,
  columnIdPrefix,
}) => {
  const repeatableActionValue = repeatableFieldActions.find(action => action.value === repeatableAction)?.label;
  const isTableVisible = repeatableAction !== repeatableActionToDelete;

  const renderTable = () => (
    <MultiColumnList
      columnIdPrefix={columnIdPrefix}
      contentData={getContentData(fieldData)}
      visibleColumns={visibleColumns}
      columnMapping={columnMapping}
      formatter={formatter}
    />
  );

  return (
    <KeyValue label={labelId && <FormattedMessage id={labelId} />}>
      {repeatableActionValue && <FormattedMessage id={repeatableActionValue} />}
      {isTableVisible && renderTable()}
    </KeyValue>
  );
};

ViewRepeatableField.propTypes = {
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  columnMapping: PropTypes.object.isRequired,
  labelId: PropTypes.string,
  repeatableAction: PropTypes.string,
  repeatableActionToDelete: PropTypes.string,
  repeatableFieldActions: PropTypes.arrayOf(repeatableFieldActionShape),
  fieldData: PropTypes.arrayOf(PropTypes.object),
  formatter: PropTypes.object,
  columnIdPrefix: PropTypes.string,
};
