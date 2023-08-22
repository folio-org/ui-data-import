import React from 'react';

import { getRecordActionStatusLabel } from '../utils';

export const SRSMarcCell = ({ sourceRecordActionStatus }) => getRecordActionStatusLabel(sourceRecordActionStatus);
