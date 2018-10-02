import React from 'react';
import classNames from 'classnames';
import { AccordionSet, Accordion, FilterAccordionHeader } from '@folio/stripes-components/lib/Accordion';
import { Icon } from '@folio/stripes-components';

import css from './ResultPanel.css';

const accordionsAmount = 4;

export default class ResultPanel extends React.Component {
  getAccordionLabeL() {
    return (
      <div className={classNames(css.accordionHeaderItem, css.accordionHeader)}>
        <Icon icon="calendar" />
        <div className={classNames(css.accordionHeaderItem, css.bold)}> Source record S1/354</div>
        <div>Title: The origin of species</div>
        <div className={css.accordionHeaderRecords}>
          <div className={css.accordionHeaderItem}><Icon icon="calendar" /> 2 new</div>
          <div className={css.accordionHeaderItem}><Icon icon="calendar" /> 2 new</div>
          <div className={css.accordionHeaderItem}><Icon icon="calendar" /> 2 new</div>
          <div className={classNames(css.accordionHeaderItem, css.accordionHeaderError)}>1 error</div>
        </div>
      </div>
    );
  }

  getAccordions(amount) {
    const result = [];

    for (let i = 0; i < amount; i++) {
      result.push(
        <Accordion
          label={this.getAccordionLabeL()}
          id={`ex-012${i}`}
          separator={false}
          header={FilterAccordionHeader}
        >
          <ul className={css.list}>
            <li className={css.listItem}>
              <div className={classNames(
                css.recordType,
                css.recordTypeOrange
              )}
              />
              <Icon icon="calendar" />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci, atque delectus.
            </li>
            <li className={css.listItem}>
              <div className={classNames(
                css.recordType,
                css.recordTypeRed
              )}
              />
              <Icon icon="calendar" />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci, atque delectus.
            </li>
            <li className={css.listItem}>
              <div className={classNames(
                css.recordType,
                css.recordTypeGreen
              )}
              />
              <Icon icon="calendar" />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci, atque delectus.
            </li>
            <li className={css.listItem}>
              <div className={classNames(
                css.recordType,
                css.recordTypeBlue
              )}
              />
              <Icon icon="calendar" />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci, atque delectus.
            </li>
            <li className={css.listItem}>
              <div className={classNames(
                css.recordType,
                css.recordTypeDeepskyblue
              )}
              />
              <Icon icon="calendar" />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci, atque delectus.
            </li>
            <li className={css.listItem}>
              <div className={classNames(
                css.recordType,
                css.recordTypeDarkslateblue
              )}
              />
              <Icon icon="calendar" />
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci, atque delectus.
            </li>
          </ul>
        </Accordion>
      );
    }

    return result;
  }

  render() {
    return (
      <AccordionSet>
        {this.getAccordions(accordionsAmount)}
      </AccordionSet>
    );
  }
}
