import React from 'react';

import { BaseLineCell } from '../utils';

export const RecordNumberCell = ({
  isEdifactType,
  sourceRecordOrder,
}) => {
  if (isEdifactType) return <BaseLineCell>{sourceRecordOrder}</BaseLineCell>;

  return <BaseLineCell>{parseInt(sourceRecordOrder, 10) + 1}</BaseLineCell>;
};
