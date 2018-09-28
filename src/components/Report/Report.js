import React from 'react';
import PropTypes from 'prop-types';
import TitleManager from '@folio/stripes-core/src/components/TitleManager';
import {
  Accordion,
  AccordionSet,
  Pane,
  Paneset,
} from '@folio/stripes-components';
import { Row, Col } from '@folio/stripes-components/lib/LayoutGrid';

import RecordItem from './components/RecordItem';
import css from './Report.css';

const record = {
  title: 'Some record',
  name: 'Source record 31/354',
  type: 'Bibliographic MARC record: "The origin of Species"',
  resultingRecords: [
    {
      id: '2198',
      type: 'instance'
    },
    {
      id: '2199',
      type: 'holding'
    },
    {
      id: '2200',
      type: 'item'
    },
    {
      id: '2201',
      type: 'bib'
    },
    {
      id: '2202',
      type: 'order'
    },
  ],
};

class Report extends React.Component {
  static propTypes = {
    paneWidth: PropTypes.string,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    paneWidth: '50%',
    onClose: () => {
    },
  };

  constructor(props) {
    super(props);

    this.state = {
      accordions: {
        'request-info': false,
        'item-info': false,
        'requester-info': false,
      },
    };
  }

  onToggleSection = ({ id }) => {
    this.setState(({ accordions }) => {
      return {
        accordions: {
          ...accordions,
          [id]: !accordions[id]
        }
      };
    });
  };

  renderResultingRecords = (records) => {
    return (
      <div>
        {records.map(item => <RecordItem key={item.id} record={item} />)}
      </div>
    );
  };

  render() {
    return (
      <Paneset>
        <Pane
          defaultWidth={this.props.paneWidth}
          paneTitle="Source record 51/354"
          dismissible
          onClose={this.props.onClose}
        >
          <div className={css.recordHeader}>
            <span>{record.name}</span>
            <h4>{record.type}</h4>
          </div>
          <AccordionSet accordionStatus={this.state.accordions} onToggle={this.onToggleSection}>
            <TitleManager record={record} />
            <Accordion
              id="record-details"
              label="Batch details for this record"
            >
              <div className={css.recordContent}>
                <div className={css.recordDetails}>
                  <div>12341234</div>
                  <div>Successful overlay</div>
                  <div>20.03.19, 05:30:03PM</div>
                </div>
              </div>
            </Accordion>
            <Accordion
              id="record-preview"
              label="Incoming Marc preview"
            >
              <div className={css.recordContent}>
                Something
              </div>
            </Accordion>
            <Accordion
              id="resulting-records"
              label="Resulting records"
            >
              <div className={css.recordContent}>
                <Row>
                  <Col xs={12}>
                    {this.renderResultingRecords(record.resultingRecords)}
                  </Col>
                </Row>
              </div>
            </Accordion>
          </AccordionSet>
        </Pane>
      </Paneset>
    );
  }
}

export default Report;
