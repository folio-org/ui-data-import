import React from 'react';
import PropTypes from 'prop-types';

import { List } from '@folio/stripes/components';

import Job from '../Job';
import Preloader from '../../../Preloader';
import EndOfList from '../EndOfList';
import jobPropTypes from '../Job/jobPropTypes';

import css from './JobsList.css';

const JobsList = props => {
  const {
    jobs,
    hasLoaded,
    noJobsMessage,
  } = props;
  const itemFormatter = job => (
    <Job
      key={job.hrId}
      job={job}
    />
  );
  const EmptyMessage = (
    <span className={css.emptyMessage}>
      {noJobsMessage}
    </span>
  );
  const LoadedJobsList = (
    <List
      items={jobs}
      itemFormatter={itemFormatter}
      isEmptyMessage={EmptyMessage}
      listClass={css.list}
      marginBottom0
    />
  );

  return (
    <div className={css.listContainer}>
      {hasLoaded ? LoadedJobsList : <Preloader />}
      <EndOfList />
    </div>
  );
};

JobsList.propTypes = {
  jobs: PropTypes.arrayOf(jobPropTypes).isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  noJobsMessage: PropTypes.node,
};

JobsList.defaultProps = {
  noJobsMessage: '',
};

export default JobsList;
