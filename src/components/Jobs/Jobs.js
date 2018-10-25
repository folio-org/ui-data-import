import React from 'react';

import { stripesShape } from '@folio/stripes/core';
import {
  AccordionSet,
  Accordion,
} from '@folio/stripes/components';

import Job from './components/Job';
import EndOfList from './components/EndOfList';
import jobsMocks from './jobsMocks'; // TODO: to be replaced with real data in further stories (UIDATIMP-23, UIDATIMP-27)

import css from './Jobs.css';

export default class Jobs extends React.Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
  };

  checkDateIsToday = date => {
    const { formatDate } = this.props.stripes.intl;

    return formatDate(new Date()) === formatDate(date);
  };

  renderPreviewJobs() {
    return (
      <div>
        {
          jobsMocks.preview.map(job => (
            <Job
              key={job.jobExecutionHRID}
              job={job}
              checkDateIsToday={this.checkDateIsToday}
            />
          ))
        }
      </div>
    );
  }

  renderRunningJobs() {
    return (
      <div>
        {
          jobsMocks.running.map(job => (
            <Job
              key={job.jobExecutionHRID}
              job={job}
              checkDateIsToday={this.checkDateIsToday}
            />
          ))
        }
      </div>
    );
  }

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
              {this.renderPreviewJobs()}
            </div>
            <EndOfList />
          </Accordion>
          <Accordion
            label={formatMessage({ id: 'ui-data-import.runningJobs' })}
            separator={false}
          >
            <div className={css.jobList}>
              {this.renderRunningJobs()}
            </div>
            <EndOfList />
          </Accordion>
        </AccordionSet>
      </div>
    );
  }
}
