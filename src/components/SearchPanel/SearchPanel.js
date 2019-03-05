/* istanbul ignore file */
import React from 'react';
import classNames from 'classnames';
import {
  AccordionSet,
  Accordion,
  FilterAccordionHeader,
  Checkbox,
  SearchField,
} from '@folio/stripes/components';

import css from './SearchPanel.css';

const resultRecordTypes = [
  'Instances (32)',
  'Holdings (14)',
  'Items (11)',
  'Orders (3)',
  'MARK bibs (42)',
  'Invoices (12)',
];

export const SearchPanel = () => (
  <AccordionSet>
    <Accordion
      label="Search"
      id="ex-0"
      separator={false}
      header={FilterAccordionHeader}
    >
      <SearchField id="input-search" />
    </Accordion>
    <Accordion
      label="Status"
      id="ex-1"
      separator={false}
      header={FilterAccordionHeader}
    >
      <div className={css.nestedContainer}>
        <Checkbox
          name="checkbox_1"
          label="Succesful (25)"
        />
        <div className={css.nestedContainer}>
          <Checkbox
            name="checkbox_1-1"
            label="overlays (2330)"
          />
          <Checkbox
            name="checkbox_1-2"
            label="Deletes (3)"
          />
        </div>
        <Checkbox
          name="checkbox_2"
          label="Review (98)"
        />
        <div className={css.nestedContainer}>
          <Checkbox
            name="checkbox_2-1"
            label="Non-matches (20)"
          />
          <Checkbox
            name="checkbox_2-2"
            label="Double-matches (4)"
          />
          <Checkbox
            name="checkbox_2-3"
            label="Matching problems/ errors?"
          />
          <div className={css.nestedContainer}>
            <Checkbox
              name="checkbox_2-3-1"
              label="found error"
            />
            <Checkbox
              name="checkbox_2-3-2"
              label="Invalid input"
            />
            <Checkbox
              name="checkbox_2-3-3"
              label="Etc."
            />
            <Checkbox
              name="checkbox_2-3-4"
              label="Etc."
            />
          </div>
        </div>
      </div>
      <br />
    </Accordion>
    <Accordion
      id="ex-2"
      label="Resulting record type"
      separator={false}
      header={FilterAccordionHeader}
    >
      <div className={css.container}>
        {resultRecordTypes.map((type, i) => (
          <Checkbox
            key={i}
            name={`checkbox_${i}`}
            label={(
              <div>
                <div className={classNames(
                  css.recordType,
                  css.recordTypeDarkslateblue
                )}
                />
                {type}
              </div>
            )}
          />
        ))}
      </div>
      <br />
    </Accordion>
    <Accordion
      id="ex-3"
      label="Filter X"
      separator={false}
      header={FilterAccordionHeader}
    >
      <div className={css.container}>
        {resultRecordTypes.map((_, i) => (
          <Checkbox
            key={i}
            name={`checkbox_${i}`}
            label={<div className={css.panel} />}
          />
        ))}
      </div>
      <br />
    </Accordion>
  </AccordionSet>
);
