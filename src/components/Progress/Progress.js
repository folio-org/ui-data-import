import React, {
  Fragment,
  memo,
} from 'react';
import PropTypes from 'prop-types';

import { calculatePercentage } from '../../utils';
import { Preloader } from '../Preloader';

import css from './Progress.css';

const progressInfoFormatters = {
  percentage: (current, total) => `${calculatePercentage(current, total)}%`,
  messagedPercentage: (current, total, payload) => {
    const { message } = payload;
    const percentage = calculatePercentage(current, total);
    const isCompleted = percentage === 100;

    return (
      <Fragment>
        {isCompleted
          ? (
            <Preloader
              preloaderClassName={css.preloader}
              message={message}
            />
          )
          : (
            <Fragment>
              {message}
              {` ${percentage}%`}
            </Fragment>
          )
        }
      </Fragment>
    );
  }
  ,
};

export const Progress = memo(({
  current,
  total,
  progressInfoType = 'percentage',
  payload = {},
  progressClassName = css.progress,
  progressWrapperClassName = css.progressWrapper,
  progressInfoClassName = css.progressInfo,
  progressCurrentClassName = css.progressCurrent,
}) => {
  const progressValue = calculatePercentage(current, total);
  const progressInfo = progressInfoFormatters[progressInfoType](current, total, payload);

  return (
    <div
      className={progressClassName}
      data-test-progress-bar
    >
      <div className={progressWrapperClassName}>
        <div
          className={progressCurrentClassName}
          style={{ width: `${progressValue}%` }}
        />
      </div>
      <div className={progressInfoClassName}>{progressInfo}</div>
    </div>
  );
});

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
