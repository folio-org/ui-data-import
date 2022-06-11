import * as ACTION from './Actions';

export const setProfileTreeContent = content => ({
  type: ACTION.PROFILE_TREE_CONTENT,
  payload: content,
});

export const clearProfileTreeContent = () => ({
  type: ACTION.PROFILE_TREE_CONTENT,
  payload: [],
});

export const setCurrentProfileTreeContent = content => ({
  type: ACTION.CURRENT_PROFILE_TREE_CONTENT,
  payload: content,
});

export const clearCurrentProfileTreeContent = () => ({
  type: ACTION.CLEAR_CURRENT_PROFILE_TREE_CONTENT,
});

export const setSelectedRecords = content => ({
  type: ACTION.SET_SELECTED_RECORDS,
  payload: content,
});
