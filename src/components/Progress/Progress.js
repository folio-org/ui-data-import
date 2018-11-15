import React from 'react';
import PropTypes from 'prop-types';

import { calculatePercentage } from '../../utils';

import css from './Progress.css';

const progressInfoFormatters = {
  percentage: (current, total) => `${calculatePercentage(current, total)}%`,
  messagedPercentage: (current, total, message) => `${message} ${calculatePercentage(current, total)}%`,
};

const Progress = props => {
  const {
    current,
    total,
    progressInfoType,
    message,
    progressClassName,
    progressWrapperClassName,
    progressInfoClassName,
    progressCurrentClassName,
  } = props;
  const progressValue = calculatePercentage(current, total);
  let progressInfo;

  switch (progressInfoType) {
    case 'messagedPercentage':
      progressInfo = progressInfoFormatters[progressInfoType](current, total, message);
      break;
    default:
      progressInfo = progressInfoFormatters[progressInfoType](current, total);
  }

  return (
    <div className={progressClassName}>
      <div className={progressWrapperClassName}>
        <div
          className={progressCurrentClassName}
          style={{ width: `${progressValue}%` }}
        />
      </div>
      <div className={progressInfoClassName}>
        {progressInfo}
      </div>
    </div>
  );
};

Progress.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  progressInfoType: PropTypes.string,
  message: PropTypes.string,
  progressWrapperClassName: PropTypes.string,
  progressClassName: PropTypes.string,
  progressCurrentClassName: PropTypes.string,
  progressInfoClassName: PropTypes.string,
};

Progress.defaultProps = {
  progressInfoType: 'percentage',
  progressWrapperClassName: css.progressWrapper,
  progressClassName: css.progress,
  progressCurrentClassName: css.progressCurrent,
  progressInfoClassName: css.progressInfo,
};

export default Progress;
