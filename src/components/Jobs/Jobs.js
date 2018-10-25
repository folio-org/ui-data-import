import React from 'react';

import { stripesShape } from '@folio/stripes/core';
import { AccordionSet, Accordion } from '@folio/stripes/components';

import Job from './components/Job';
import EndOfList from './components/EndOfList';
import jobsMocks from './jobsMocks'; // TODO: to be replaced with real data in further stories

import css from './Jobs.css';

export default class Jobs extends React.Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
  };

  checkDateIsToday = date => {
    const { formatDate } = this.props.stripes.intl;

    return formatDate(new Date()) === formatDate(date);
  };

  render() {
    const { formatMessage } = this.props.stripes.intl;

    return (
      <div className={css.jobsPane}>
        <AccordionSet>
          <Accordion
            label={formatMessage({ id: 'ui-data-import.previewJobs' })}
            separator={false}
          >
            <div className={css.jobList}>
              <Job
                job={jobsMocks[0]}
                checkDateIsToday={this.checkDateIsToday}
              />
            </div>
            <EndOfList />
          </Accordion>
          <Accordion
            label={formatMessage({ id: 'ui-data-import.runningJobs' })}
            separator={false}
          >
            <div className={css.jobList}>
              <Job
                job={jobsMocks[1]}
                checkDateIsToday={this.checkDateIsToday}
              />
            </div>
            <EndOfList />
          </Accordion>
        </AccordionSet>
      </div>
    );
  }
}
