import PropTypes from 'prop-types';

const jobLogPropTypes = PropTypes.shape({
  fileName: PropTypes.string,
  jobProfileName: PropTypes.string,
  jobExecutionHrId: PropTypes.string,
  completedDate: PropTypes.string,
  runBy: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
  }),
});

export default jobLogPropTypes;
