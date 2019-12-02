import React, {
  useState,
  useRef,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import {
  isNumber,
  noop,
} from 'lodash';

import {
  Row,
  Col,
  Headline,
} from '@folio/stripes/components';

import { Triangle } from './Triangle';
import { RecordItem } from './RecordItem';
import { RecordSelect } from './RecordSelect';
import { getElement } from '../../LineBetween/utils';

import css from '../RecordTypesSelect.css';

const defaultSpacing = 50;
const maxCompareElemWidth = 100;
const maxHintElemWidth = 180;
const hintTriangleSize = 8;
const hintMargin = 8 + 4;
const compareElemMargin = 4;

export const CompareRecordSelect = ({
  id,
  incomingRecord,
  existingRecord,
  setExistingRecord,
  isEditable,
}) => {
  const [top, setTop] = useState();
  const [height, setHeight] = useState();
  const [compareElemWidth, setCompareElemWidth] = useState();
  const [hintElemWidth, setHintElemWidth] = useState();

  /** @type {React.RefObject<HTMLElement>} */
  const compareElemRef = useRef();
  /** @type {React.RefObject<HTMLElement>} */
  const hintElemRef = useRef();
  /** @type {React.RefObject<HTMLElement>} */
  const existingRecordsElemRef = useRef();

  useEffect(() => {
    setCompareElemWidth(Math.min(compareElemRef.current.getBoundingClientRect().width, maxCompareElemWidth));
    setHintElemWidth(Math.min(hintElemRef.current.getBoundingClientRect().width, maxHintElemWidth));
  }, []);

  useEffect(() => {
    const selectedExistingRecordElem = getElement(`#${existingRecord.type}`, existingRecordsElemRef.current);

    if (selectedExistingRecordElem) {
      setTop(selectedExistingRecordElem.offsetTop);
      setHeight(selectedExistingRecordElem.getBoundingClientRect().height);
    }
  }, [existingRecord, compareElemWidth, hintElemWidth]);

  const renderSelectedLine = isNumber(top);
  const spaceForHintElement = isNumber(hintElemWidth) && hintElemWidth + hintMargin + hintTriangleSize;
  const spaceForCompareElem = isNumber(compareElemWidth)
    ? Math.min((compareElemWidth / 2) + compareElemMargin, maxCompareElemWidth)
    : defaultSpacing;

  return (
    <section
      data-test-compare-record
      className={css.container}
    >
      <Row>
        <Col
          xs={4}
          className={classNames(css.headingCell)}
        >
          <Headline
            size="large"
            margin="none"
            tag="h3"
          >
            <FormattedMessage id="ui-data-import.incomingMarc" />
          </Headline>
        </Col>
        <Col
          xs
          className={classNames(css.headingCell, css.borderLeft)}
        >
          <Headline
            size="large"
            margin="none"
            tag="h3"
          >
            <FormattedMessage id="ui-data-import.existingRecords" />
          </Headline>
        </Col>
      </Row>
      <Row className={css.contentContainer}>
        <div
          className={css.selectedLine}
          style={{
            visibility: renderSelectedLine ? null : 'hidden',
            top,
            height: `calc(${height}px + ${css.cellPadding})`,
          }}
        >
          <div
            ref={hintElemRef}
            className={css.hint}
          >
            <Triangle
              size={hintTriangleSize}
              direction="left"
              color="#616161"
            />
            <div className={css.hintMessage}>
              <FormattedMessage id="ui-data-import.compareHint" />
            </div>
          </div>
        </div>
        <Col
          xs={4}
          className={classNames(css.cell)}
          style={{
            visibility: renderSelectedLine ? null : 'hidden',
            marginTop: top,
            paddingRight: spaceForCompareElem,
          }}
        >
          <RecordItem
            item={incomingRecord}
            className={css.incomingRecord}
            style={{ height }}
          />
          <div
            ref={compareElemRef}
            className={css.compare}
            style={{
              width: compareElemWidth,
              height: `calc(${height}px + ${css.cellPadding} - ${css.selectedLineBorderWidth} - ${css.selectedLineBorderWidth})`,
            }}
          >
            <Triangle />
            <span className={css.compareMessage}>
              <FormattedMessage id="ui-data-import.compare" />
            </span>
            <Triangle direction="left" />
          </div>
        </Col>
        <Col
          xs
          className={classNames(css.cell, css.borderLeft)}
          style={{
            paddingLeft: spaceForCompareElem,
            paddingRight: spaceForHintElement,
          }}
        >
          <div ref={existingRecordsElemRef}>
            {compareElemWidth && (
              <RecordSelect
                id={id}
                onSelect={isEditable ? setExistingRecord : noop}
              />
            )}
          </div>
        </Col>
      </Row>
    </section>
  );
};

CompareRecordSelect.propTypes = {
  id: PropTypes.string,
  incomingRecord: PropTypes.object.isRequired,
  existingRecord: PropTypes.object.isRequired,
  setExistingRecord: PropTypes.func.isRequired,
  isEditable: PropTypes.bool,
};
