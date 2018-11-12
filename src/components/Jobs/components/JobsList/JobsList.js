import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
  const LoadedJobsList = (
    <List
      items={sort(jobs)}
      itemFormatter={itemFormatter}
      isEmptyMessage={noJobsMessage}
      listClass={css.list}
      marginBottom0
    />
  );
  const Loading = (
    <div className={css.loading}>
      <FormattedMessage
        id="ui-data-import.loading"
      />
      <Icon
        icon="spinner-ellipsis"
        size="small"
      />
    </div>
  );

  return (
    <div className={css.listContainer}>
      {hasLoaded ? LoadedJobsList : Loading}
      <EndOfList />
    </div>
  );
};

JobsList.propTypes = {
  jobs: PropTypes.arrayOf(jobPropTypes).isRequired,
  hasLoaded: PropTypes.bool.isRequired,
  checkDateIsToday: PropTypes.func.isRequired,
  sort: PropTypes.func,
  noJobsMessage: PropTypes.node,
};

JobsList.defaultProps = {
  sort: identity,
  noJobsMessage: '',
};

export default JobsList;
