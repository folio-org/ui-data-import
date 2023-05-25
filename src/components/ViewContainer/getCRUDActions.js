import { STATUS_CODES } from '../../utils';

export const getCRUDActions = ({
  entityKey,
  mutator: {
    [entityKey]: resourceMutator,
    restoreDefaults,
  },
  onSuccess,
  onError,
}) => {
  const createRecord = record => resourceMutator.POST(record)
    .then(response => {
      onSuccess('create', record, response);

      return response;
    })
    .catch(error => {
      onError('create', record, error);
      throw error;
    });

  const editRecord = record => resourceMutator.PUT(record)
    .then(response => {
      onSuccess('update', record, response);

      return response;
    })
    .catch(error => {
      onError('update', record, error);
      throw error;
    });

  const deleteRecord = record => resourceMutator.DELETE(record)
    .then(response => {
      onSuccess('delete', record, response);

      return response || { ok: true };
    })
    .catch(error => {
      if (error.status !== STATUS_CODES.CONFLICT) {
        onError('delete', record, error);
      }

      return error;
    });

  const restoreRecords = record => restoreDefaults.POST(record)
    .then(response => {
      onSuccess('reset', record, response);

      return response;
    })
    .catch(error => {
      onError('reset', record, error);

      return error;
    });

  return {
    onCreate: createRecord,
    onEdit: editRecord,
    onDelete: deleteRecord,
    onRestoreDefaults: restoreRecords,
  };
};
