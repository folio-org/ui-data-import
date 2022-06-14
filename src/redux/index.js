import { combineReducers } from 'redux';

import { settingsReducer } from './reducers/settings';
import { selectedRecordsReducer } from './reducers/selectedRecords';
import { STATE_MANAGEMENT } from '../utils';

export const rootReducer = combineReducers({
  [STATE_MANAGEMENT.SETTINGS_REDUCER]: settingsReducer,
  [STATE_MANAGEMENT.SELECTED_RECORDS_REDUCER]: selectedRecordsReducer,
});

export * from './actions';
