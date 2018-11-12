import React from 'react';
import PropTypes from 'prop-types';
import identity from 'lodash/identity';

import {
  List,
  Icon,
} from '@folio/stripes/components';

import Job from '../Job';
import jobPropTypes from '../Job/jobPropTypes';
import EndOfList from '../EndOfList';

import css from './JobsList.css';

const JobsList = ({
  jobs,
  hasLoaded,
  checkDateIsToday,
  sort,
  noJobsMessage,
}) => {
  const itemFormatter = job => (
    <Job
      key={job.jobExecutionHrId}
      job={job}
      checkDateIsToday={checkDateIsToday}
    />
  );
  const jobsList = (
    <List
      items={sort(jobs)}
      itemFormatter={itemFormatter}
      isEmptyMessage={noJobsMessage}
      listClass={css.list}
      marginBottom0
    />
  );
  const loading = (
    <div className={css.loading}>
      Loading <Icon icon="spinner-ellipsis" size="small" />
    </div>
  );

  return (
    <div className={css.listContainer}>
      {hasLoaded ? jobsList : loading}
      <EndOfList />
    </div>
  );
};

JobsList.propTypes = {
  jobs: PropTypes.arrayOf(jobPropTypes).isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  checkDateIsToday: PropTypes.func.isRequired,
  sort: PropTypes.func,
  noJobsMessage: PropTypes.string,
};

JobsList.defaultProps = {
  sort: identity,
  noJobsMessage: '',
};

export default JobsList;
