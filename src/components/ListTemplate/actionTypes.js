export const ACTION_TYPES = {
  CREATE: {
    type: 'CREATE',
    iconKey: 'plus-sign',
    captionId: 'ui-data-import.create',
  },
  COMBINE: {
    type: 'COMBINE',
    iconKey: 'combine',
    captionId: 'ui-data-import.combine',
  },
  MODIFY: {
    type: 'MODIFY',
    iconKey: 'edit',
    captionId: 'ui-data-import.modify',
  },
  REPLACE: {
    type: 'REPLACE',
    iconKey: 'replace',
    captionId: 'ui-data-import.replace',
  },
};

export const ACTION_TYPES_SELECT = {
  CREATE: {
    ...ACTION_TYPES.CREATE,
    captionId: 'ui-data-import.actionSelect.create',
  },
  COMBINE: {
    ...ACTION_TYPES.COMBINE,
    captionId: 'ui-data-import.actionSelect.combine',
  },
  MODIFY: {
    ...ACTION_TYPES.MODIFY,
    captionId: 'ui-data-import.actionSelect.modify',
  },
  REPLACE: {
    ...ACTION_TYPES.REPLACE,
    captionId: 'ui-data-import.actionSelect.replace',
  },
};
