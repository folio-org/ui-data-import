import PropTypes from 'prop-types';

const jobPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  hrId: PropTypes.string.isRequired,
  jobProfileName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  uiStatus: PropTypes.string.isRequired,
  runBy: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  progress: PropTypes.shape({
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  startedDate: PropTypes.string.isRequired,
  completedDate: PropTypes.string,
});

export default jobPropTypes;
