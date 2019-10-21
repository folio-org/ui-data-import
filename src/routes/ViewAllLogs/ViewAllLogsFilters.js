import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { uniqBy } from 'lodash';

import {
  AccordionSet,
  Accordion,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes-components';
import {
  createClearFilterHandler,
  DATE_FORMAT,
} from '@folio/stripes-acq-components';
import {
  CheckboxFilter,
  DateRangeFilter,
} from '@folio/stripes-smart-components';

import {
  FILTERS,
  FILTER_OPTIONS,
} from './constants';

const getDateRange = filterValue => {
  let dateRange = {
    startDate: '',
    endDate: '',
  };

  if (filterValue) {
    const [startDateString, endDateString] = filterValue[0].split(':');
    const endDate = moment.utc(endDateString);
    const startDate = moment.utc(startDateString);

    dateRange = {
      startDate: startDate.isValid()
        ? startDate.format(DATE_FORMAT)
        : '',
      endDate: endDate.isValid()
        ? endDate.subtract(1, 'days').format(DATE_FORMAT)
        : '',
    };
  }

  return dateRange;
};

const getDateFilter = (startDate, endDate) => {
  const endDateCorrected = moment.utc(endDate).add(1, 'days').format(DATE_FORMAT);

  return `${startDate}:${endDateCorrected}`;
};

export const onChangeSelectionFilter = (onChange, filterName) => {
  return value => onChange({
    name: filterName,
    values: [value],
  });
};

const ViewAllLogsFilters = ({
  activeFilters,
  closedByDefault,
  onChange,
  jobProfiles,
  users,
}) => {
  const getJobProfileOptions = uniqBy(jobProfiles.map(jobProfile => ({
    value: jobProfile.id,
    label: jobProfile.name,
  })), 'value');

  const getUsersOptions = uniqBy(users.map(user => ({
    value: user.userId,
    label: `${user.firstName} ${user.lastName}`,
  })), 'value');

  return (
    <div data-test-filter-logs>
      <AccordionSet>
        <Accordion
          closedByDefault={false}
          displayClearButton={!!activeFilters[FILTERS.ERRORS]}
          header={FilterAccordionHeader}
          id={FILTERS.ERRORS}
          label={<FormattedMessage id="ui-data-import.filter.errors" />}
          onClearFilter={createClearFilterHandler(onChange, FILTERS.ERRORS)}
        >
          <CheckboxFilter
            dataOptions={FILTER_OPTIONS.ERRORS}
            name={FILTERS.ERRORS}
            onChange={onChange}
            selectedValues={activeFilters[FILTERS.ERRORS]}
          />
        </Accordion>
        <Accordion
          closedByDefault={closedByDefault}
          displayClearButton={!!activeFilters[FILTERS.DATE]}
          header={FilterAccordionHeader}
          id={FILTERS.DATE}
          label={<FormattedMessage id="ui-data-import.filter.date" />}
          onClearFilter={createClearFilterHandler(onChange, FILTERS.DATE)}
        >
          <DateRangeFilter
            name={FILTERS.DATE}
            selectedValues={getDateRange(activeFilters[FILTERS.DATE])}
            onChange={onChange}
            makeFilterString={getDateFilter}
            dateFormat={DATE_FORMAT}
          />
        </Accordion>
        <Accordion
          id={FILTERS.JOB_PROFILE}
          closedByDefault={closedByDefault}
          displayClearButton={!!activeFilters[FILTERS.JOB_PROFILE]}
          header={FilterAccordionHeader}
          label={<FormattedMessage id="ui-data-import.filter.jobProfile" />}
          onClearFilter={createClearFilterHandler(onChange, FILTERS.JOB_PROFILE)}
        >
          <div data-test-job-profiles-filter>
            <Selection
              dataOptions={getJobProfileOptions}
              value={activeFilters[FILTERS.JOB_PROFILE] ? activeFilters[FILTERS.JOB_PROFILE][0] : ''}
              onChange={onChangeSelectionFilter(onChange, FILTERS.JOB_PROFILE)}
            />
          </div>
        </Accordion>
        <Accordion
          id={FILTERS.USER}
          closedByDefault={closedByDefault}
          displayClearButton={!!activeFilters[FILTERS.USER]}
          header={FilterAccordionHeader}
          label={<FormattedMessage id="ui-data-import.filter.user" />}
          onClearFilter={createClearFilterHandler(onChange, FILTERS.USER)}
        >
          <div data-test-users-filter>
            <Selection
              dataOptions={getUsersOptions}
              value={activeFilters[FILTERS.USER] ? activeFilters[FILTERS.USER][0] : ''}
              onChange={onChangeSelectionFilter(onChange, FILTERS.USER)}
            />
          </div>
        </Accordion>
      </AccordionSet>
    </div>
  );
};

ViewAllLogsFilters.propTypes = {
  activeFilters: PropTypes.object,
  closedByDefault: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  jobProfiles: PropTypes.arrayOf(PropTypes.object),
  users: PropTypes.arrayOf(PropTypes.object),
};

ViewAllLogsFilters.defaultProps = {
  activeFilters: [],
  closedByDefault: true,
  jobProfiles: [],
  users: [],
};

export default ViewAllLogsFilters;
