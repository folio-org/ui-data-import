import * as ACTION from '../actions';

const initialState = {
  selectedRecords: {},
};

export const selectedRecordsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION.SET_SELECTED_RECORDS:
      return {
        ...state,
        selectedRecords: {
          ...state.selectedRecords,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
