import * as ACTION from '../actions';

const initialState = {
  profileTreeData: [],
  jobProfiles: {},
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTION.PROFILE_TREE_CONTENT:
      return {
        ...state,
        profileTreeData: action.payload,
      };
    case ACTION.CURRENT_PROFILE_TREE_CONTENT:
      return {
        ...state,
        jobProfiles: {
          ...state.jobProfiles,
          ...action.payload
        },
      };
    case ACTION.CLEAR_CURRENT_PROFILE_TREE_CONTENT:
      return {
        ...state,
        jobProfiles: {},
      };
    default:
      return state;
  }
};
