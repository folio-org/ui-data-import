import { buildUrl } from '@folio/stripes/smart-components';

export const getCRUDActions = ({
  finishedResourceName,
  mutator: { [finishedResourceName]: resourceMutator },
  location,
  history,
  match: { path },
  onUpdateRecordError,
  onDeleteSuccess,
  onDeleteError,
}) => {
  const transitionToParams = params => {
    const url = buildUrl(location, params);

    history.push(url);
  };

  const createRecord = record => resourceMutator.POST(record)
    .catch(error => {
      onUpdateRecordError(record, error);

      throw error;
    });

  const editRecord = record => resourceMutator.PUT(record)
    .catch(error => {
      onUpdateRecordError(record, error);

      throw error;
    });

  const deleteRecord = async record => {
    try {
      await resourceMutator.DELETE(record);

      transitionToParams({
        _path: `${path}/view`,
        layer: null,
      });

      onDeleteSuccess(record);
    } catch (error) {
      onDeleteError(record, error);
    }
  };

  const handleUpdateRecordSuccess = (record, dispatch, properties) => {
    const { reset: resetForm } = properties;

    resetForm();

    transitionToParams({
      _path: `${path}/view/${record.id}`,
      layer: null,
    });
  };

  return {
    onCreate: createRecord,
    onEdit: editRecord,
    onDelete: deleteRecord,
    handleCreateSuccess: handleUpdateRecordSuccess,
    handleEditSuccess: handleUpdateRecordSuccess,
  };
};
