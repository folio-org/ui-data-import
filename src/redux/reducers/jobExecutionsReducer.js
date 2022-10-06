import * as ACTION from '../actions/jobExecutionsActions';

const initialState = {
  hrIds: [],
  selectedJob: null,
};

export const jobExecutionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION.ADD_HRID:
      if (!state.hrIds.includes(action.payload)) {
        return {
          ...state,
          hrIds: [...state.hrIds, action.payload],
        };
      }
      return state;
    case ACTION.DELETE_HRID:
      return {
        ...state,
        hrIds: [...state.hrIds.filter(hrId => hrId !== action.payload)]
      };
    case ACTION.SELECT_RECORD:
      return {
        ...state,
        selectedJob: action.payload,
      };
    case ACTION.DESELECT_RECORD:
      return {
        ...state,
        selectedJob: null,
      };
    default:
      return state;
  }
};
