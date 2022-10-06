import * as ACTION from './jobExecutionsActions';

export const addHrid = content => ({
  type: ACTION.ADD_HRID,
  payload: content,
});

export const deleteHrid = content => ({
  type: ACTION.DELETE_HRID,
  payload: content,
});

export const selectRecord = content => ({
  type: ACTION.SELECT_RECORD,
  payload: content,
});

export const deselectRecord = () => ({
  type: ACTION.DESELECT_RECORD,
});
