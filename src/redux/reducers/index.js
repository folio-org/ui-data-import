import { combineReducers } from 'redux';

import { settingsReducer } from './settings';
import { selectedRecordsReducer } from './selectedRecords';
import { STATE_MANAGEMENT } from '../../utils';

export const rootReducer = combineReducers({
  [STATE_MANAGEMENT.SETTINGS_REDUCER]: settingsReducer,
  [STATE_MANAGEMENT.SELECTED_RECORDS_REDUCER]: selectedRecordsReducer,
});
