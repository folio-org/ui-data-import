import PropTypes from 'prop-types';

const datePropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.objectOf(Date),
]);

const jobPropTypes = PropTypes.shape({
  jobExecutionId: PropTypes.string.isRequired,
  jobExecutionHrId: PropTypes.string.isRequired,
  jobProfileName: PropTypes.string.isRequired,
  fileName: PropTypes.string.isRequired,
  runBy: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
  }).isRequired,
  progress: PropTypes.shape({
    current: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
  }).isRequired,
  startedDate: datePropType.isRequired,
  completedDate: datePropType.isRequired,
  status: PropTypes.string.isRequired,
});

export default jobPropTypes;
