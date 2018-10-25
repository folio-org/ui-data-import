import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  calculatePercentage,
  formatValuesWithDelimiter,
} from '../../../../utils';

import css from './Progress.css';

const progressInfoFormatters = {
  percentage: (current, total) => `${calculatePercentage(current, total)}%`,
  default: (current, total) => formatValuesWithDelimiter([current, total]),
};

const Progress = props => {
  const {
    current,
    total,
    progressInfoType,
  } = props;
  const progressValue = calculatePercentage(current, total);

  return (
    <div className={css.progress}>
      <div className={css.progressWrapper}>
        <div
          className={css.progressCurrent}
          style={{ width: `${progressValue}%` }}
        />
      </div>
      <div className={css.progressInfo}>
        <FormattedMessage id="ui-data-import.progressRunning" /> {progressInfoFormatters[progressInfoType](current, total)}
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
  progressInfoType: 'default'
};

export default Progress;
