import * as ACTION from '../actions';

export const selectedRecordsReducer = (state = {}, action) => {
  if (action.type === ACTION.SET_SELECTED_RECORDS) {
    return {
      ...state,
      ...action.payload,
    };
  }

  return state;
};
