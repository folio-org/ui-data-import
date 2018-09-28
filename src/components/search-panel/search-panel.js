import React from 'react';
import classNames from 'classnames';
import { AccordionSet, Accordion, FilterAccordionHeader } from '@folio/stripes-components/lib/Accordion';
import Checkbox from '@folio/stripes-components/lib/Checkbox';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';
import Icon from '@folio/stripes-components/lib/Icon';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import IconButton from '@folio/stripes-components/lib/IconButton';

import css from './search-panel.css';


export default function SearchPanel(props) {
  return (
    <AccordionSet>
      <Accordion
        label="Status"
        id="ex-1"
        separator={false}
        header={FilterAccordionHeader}
      >
        <div className={css['nested-container']}>
          <Checkbox
            name="checkbox_1"
            label="Succesful (25)"
          />
          <div className={css['nested-container']}>
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
          <div className={css['nested-container']}>
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
            <div className={css['nested-container']}>
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
        label="Resulting record type"
        id="ex-2"
        separator={false}
        header={FilterAccordionHeader}
      >
        <div className={css.container}>
          <Checkbox
            name="checkbox_1"
            label={(
              <div>
                <div className={classNames(
                  css['record-type'],
                  css['record-type--orange']
                )}
                />
                Instances (32)
              </div>
            )}
          />
          <Checkbox
            name="checkbox_1"
            label={(
              <div>
                <div className={classNames(
                  css['record-type'],
                  css['record-type--red']
                )}
                />
                Holdings (14)
              </div>
            )}
          />
          <Checkbox
            name="checkbox_1"
            label={(
              <div>
                <div className={classNames(
                  css['record-type'],
                  css['record-type--green']
                )}
                />
                Items (11)
              </div>
            )}
          />
          <Checkbox
            name="checkbox_1"
            label={(
              <div>
                <div className={classNames(
                  css['record-type'],
                  css['record-type--blue']
                )}
                />
                Orders (3)
              </div>
            )}
          />
          <Checkbox
            name="checkbox_1"
            label={(
              <div>
                <div className={classNames(
                  css['record-type'],
                  css['record-type--deepskyblue']
                )}
                />
                MARK bibs (42)
              </div>
            )}
          />
          <Checkbox
            name="checkbox_1"
            label={(
              <div>
                <div className={classNames(
                  css['record-type'],
                  css['record-type--darkslateblue']
                )}
                />
                Invaices (12)
              </div>
            )}
          />
        </div>
        <br />
      </Accordion>
      <Accordion
        label="Filter X"
        id="ex-3"
        separator={false}
        header={FilterAccordionHeader}
      >
        <div style={{ marginLeft: '1.5rem' }}>
          <Checkbox
            name="checkbox_1"
            label={(
              <div className={css.panel} />
            )}
          />
          <Checkbox
            name="checkbox_1"
            label={(
              <div className={css.panel} />
            )}
          />
          <Checkbox
            name="checkbox_1"
            label={(
              <div className={css.panel} />
            )}
          />
          <Checkbox
            name="checkbox_1"
            label={(
              <div className={css.panel} />
            )}
          />
          <Checkbox
            name="checkbox_1"
            label={(
              <div className={css.panel} />
            )}
          />
          <Checkbox
            name="checkbox_1"
            label={(
              <div className={css.panel} />
            )}
          />
        </div>
        <br />
      </Accordion>
    </AccordionSet>
  );
}
