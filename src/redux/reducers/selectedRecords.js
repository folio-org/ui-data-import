import * as ACTION from '../actions';

export const selectedRecordsReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION.SET_SELECTED_RECORDS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
