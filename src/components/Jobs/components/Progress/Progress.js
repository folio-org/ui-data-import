import React from 'react';
import PropTypes from 'prop-types';

import { calculatePercentage } from '../../../../utils';

import css from './Progress.css';

const progressInfoFormatters = {
  percentage: (current, total) => `${calculatePercentage(current, total)}%`,
};

const Progress = props => {
  const {
    current,
    total,
    progressInfoType,
  } = props;
  const progressValue = calculatePercentage(current, total);
  const progressInfo = progressInfoFormatters[progressInfoType](current, total);

  return (
    <div className={css.progress}>
      <div className={css.progressWrapper}>
        <div
          className={css.progressCurrent}
          style={{ width: `${progressValue}%` }}
        />
      </div>
      <div className={css.progressInfo}>
        {progressInfo}
      </div>
    </div>
  );
};

Progress.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  progressInfoType: PropTypes.string,
};

Progress.defaultProps = {
  progressInfoType: 'percentage',
};

export default Progress;
