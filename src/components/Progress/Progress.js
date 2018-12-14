import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import { calculatePercentage } from '../../utils';

import css from './Progress.css';

const progressInfoFormatters = {
  percentage: (current, total) => `${calculatePercentage(current, total)}%`,
  messagedPercentage: (current, total, payload) => (
    <Fragment>
      {payload.message}
      {` ${calculatePercentage(current, total)}%`}
    </Fragment>
  ),
};

const Progress = props => {
  const {
    current,
    total,
    progressInfoType,
    payload,
    progressClassName,
    progressWrapperClassName,
    progressInfoClassName,
    progressCurrentClassName,
  } = props;

  const progressValue = calculatePercentage(current, total);
  const progressInfo = progressInfoFormatters[progressInfoType](current, total, payload);

  return (
    <div className={progressClassName}>
      <div className={progressWrapperClassName}>
        <div
          className={progressCurrentClassName}
          style={{ width: `${progressValue}%` }}
        />
      </div>
      <div className={progressInfoClassName}>{progressInfo}</div>
    </div>
  );
};

Progress.propTypes = {
  current: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  progressInfoType: PropTypes.string,
  payload: PropTypes.object,
  progressWrapperClassName: PropTypes.string,
  progressClassName: PropTypes.string,
  progressCurrentClassName: PropTypes.string,
  progressInfoClassName: PropTypes.string,
};

Progress.defaultProps = {
  progressInfoType: 'percentage',
  payload: {},
  progressWrapperClassName: css.progressWrapper,
  progressClassName: css.progress,
  progressCurrentClassName: css.progressCurrent,
  progressInfoClassName: css.progressInfo,
};

export default Progress;
