export const ACTION_TYPES = {
  CREATE: {
    type: 'CREATE',
    iconKey: 'plus-sign',
    captionId: 'ui-data-import.create',
  },
  MODIFY: {
    type: 'MODIFY',
    iconKey: 'edit',
    captionId: 'ui-data-import.modify',
  },
  UPDATE: {
    type: 'UPDATE',
    iconKey: 'replace',
    captionId: 'ui-data-import.update',
  },
};

export const ACTION_TYPES_SELECT = {
  CREATE: {
    ...ACTION_TYPES.CREATE,
    captionId: 'ui-data-import.selectAction.create',
  },
  MODIFY: {
    ...ACTION_TYPES.MODIFY,
    captionId: 'ui-data-import.selectAction.modify',
  },
  UPDATE: {
    ...ACTION_TYPES.UPDATE,
    captionId: 'ui-data-import.selectAction.update',
  },
};
