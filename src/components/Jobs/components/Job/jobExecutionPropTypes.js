import PropTypes from 'prop-types';

const compositeDetailsShape = {
  chunksCount: PropTypes.number,
  totalRecordsCount: PropTypes.number,
  currentlyProcessedCount: PropTypes.number,
};

export const jobExecutionPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  hrId: PropTypes.number.isRequired,
  jobProfileInfo: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    dataType: PropTypes.string,
  }).isRequired,
  parentJobId: PropTypes.string,
  subordinationType: PropTypes.string.isRequired,
  sourcePath: PropTypes.string.isRequired,
  fileName: PropTypes.string,
  runBy: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  progress: PropTypes.shape({
    jobExecutionId: PropTypes.string,
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  startedDate: PropTypes.string.isRequired,
  completedDate: PropTypes.string,
  status: PropTypes.string.isRequired,
  uiStatus: PropTypes.string.isRequired,
  userId: PropTypes.string,
  compositeDetails: PropTypes.shape({
    committedState: PropTypes.shape(compositeDetailsShape),
    newState: PropTypes.shape(compositeDetailsShape),
    fileUploadedState: PropTypes.shape(compositeDetailsShape),
    parsingInProgressState: PropTypes.shape(compositeDetailsShape),
    parsingFinishedState: PropTypes.shape(compositeDetailsShape),
    processingInProgressState: PropTypes.shape(compositeDetailsShape),
    processingFinishedState: PropTypes.shape(compositeDetailsShape),
    commitInProgressState:  PropTypes.shape(compositeDetailsShape),
    errorState: PropTypes.shape(compositeDetailsShape),
    discardedState: PropTypes.shape(compositeDetailsShape),
    cancelledState: PropTypes.shape(compositeDetailsShape),
  })
});
