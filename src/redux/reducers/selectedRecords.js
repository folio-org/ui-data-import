import * as ACTION from '../actions';

const initialState = {};

export const selectedRecordsReducer = (state = initialState, action) => {
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
