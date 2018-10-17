import React from 'react';
import { stripesShape } from '@folio/stripes/core';
import { AccordionSet, Accordion } from '@folio/stripes/components';

export default class Jobs extends React.Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
  };

  render() {
    const { formatMessage } = this.props.stripes.intl;

    return (
      <AccordionSet>
        <Accordion
          label={formatMessage({ id: 'ui-data-import.previewJobs' })}
          separator={false}
        />
        <Accordion
          label={formatMessage({ id: 'ui-data-import.runningJobs' })}
          separator={false}
        />
      </AccordionSet>
    );
  }
}
