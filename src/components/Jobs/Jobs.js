import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  AccordionSet,
  Accordion,
} from '@folio/stripes/components';

import PreviewsJobs from './components/PreviewsJobs';
import RunningJobs from './components/RunningJobs';

import css from './Jobs.css';

class Jobs extends Component {
  render() {
    return (
      <div className={css.jobsPane}>
        <AccordionSet>
          <Accordion
            label={<FormattedMessage id="ui-data-import.previewJobs" />}
            separator={false}
          >
            <PreviewsJobs />
          </Accordion>
          <Accordion
            label={<FormattedMessage id="ui-data-import.runningJobs" />}
            separator={false}
          >
            <RunningJobs />
          </Accordion>
        </AccordionSet>
      </div>
    );
  }
}

export default Jobs;
