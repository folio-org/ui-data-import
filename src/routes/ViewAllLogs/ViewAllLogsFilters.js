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
} from '@folio/stripes/components';
import {
  createClearFilterHandler,
  DATE_FORMAT,
} from '@folio/stripes-acq-components';
import {
  CheckboxFilter,
  DateRangeFilter,
} from '@folio/stripes/smart-components';

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
  console.log('jobProfiles', jobProfiles);
  const getJobProfileOptions = uniqBy(jobProfiles.filter(jobProfile => jobProfile).map(jobProfile => ({
    value: jobProfile?.id,
    label: jobProfile?.name,
  })), 'value');
  console.log('getJobProfileOptions', getJobProfileOptions);

  console.log('users', users);
  const getUsersOptions = uniqBy(users.filter(user => user).map(user => ({
    value: user.userId,
    label: `${user.firstName} ${user.lastName}`,
  })), 'value');

  console.log('getUsersOptions', getUsersOptions);

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
            <FormattedMessage id="ui-data-import.filter.chooseJobProfile">
              {([placeholder]) => (
                <Selection
                  dataOptions={getJobProfileOptions}
                  value={activeFilters[FILTERS.JOB_PROFILE] ? activeFilters[FILTERS.JOB_PROFILE][0] : ''}
                  onChange={onChangeSelectionFilter(onChange, FILTERS.JOB_PROFILE)}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
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
            <FormattedMessage id="ui-data-import.filter.chooseUser">
              {([placeholder]) => (
                <Selection
                  dataOptions={getUsersOptions}
                  value={activeFilters[FILTERS.USER] ? activeFilters[FILTERS.USER][0] : ''}
                  onChange={onChangeSelectionFilter(onChange, FILTERS.USER)}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </div>
        </Accordion>
        <Accordion
          id={FILTERS.SINGLE_RECORD_IMPORTS}
          closedByDefault={closedByDefault}
          displayClearButton={!!activeFilters[FILTERS.SINGLE_RECORD_IMPORTS]}
          header={FilterAccordionHeader}
          label={<FormattedMessage id="ui-data-import.filter.singleRecordImports" />}
          onClearFilter={createClearFilterHandler(onChange, FILTERS.SINGLE_RECORD_IMPORTS)}
        >
          <CheckboxFilter
            dataOptions={FILTER_OPTIONS.SINGLE_RECORD_IMPORTS}
            name={FILTERS.SINGLE_RECORD_IMPORTS}
            onChange={onChange}
            selectedValues={activeFilters[FILTERS.SINGLE_RECORD_IMPORTS]}
          />
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
