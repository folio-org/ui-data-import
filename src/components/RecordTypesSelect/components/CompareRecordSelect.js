import React, {
  memo,
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
import { getElement } from '../../TreeLine/utils';

import css from '../RecordTypesSelect.css';

const defaultSpacing = 50;
const maxCompareElemWidth = 100;
const maxHintElemWidth = 180;
const hintTriangleSize = 8;
const hintMargin = 8 + 4;
const compareElemMargin = 4;

export const CompareRecordSelect = memo(({
  id,
  incomingRecordOptions,
  incomingRecord = null,
  existingRecord = null,
  setExistingRecord = noop,
  setIncomingRecord = noop,
  isEditable = true,
  isLocalLTR = true,
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
    const selectedExistingRecordElem = getElement(`[data-id=${existingRecord.type}]`, existingRecordsElemRef.current);

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
      data-test-compare-record={existingRecord.type}
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
            <FormattedMessage id="ui-data-import.incomingRecords" />
          </Headline>
        </Col>
        <Col
          xs
          className={classNames(css.headingCell, { [css.borderLeft]: isLocalLTR }, { [css.borderRight]: !isLocalLTR })}
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
              direction={isLocalLTR ? 'left' : 'right'}
              color="#616161"
            />
            <div
              className={css.hintMessage}
              style={{ [isLocalLTR ? 'marginLeft' : 'marginRight']: 0 }}
            >
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
            [isLocalLTR ? 'paddingRight' : 'paddingLeft']: spaceForCompareElem,
          }}
        >
          <RecordItem
            item={incomingRecord}
            onClick={setIncomingRecord}
            className={css.incomingRecord}
            style={{ height }}
            isEditable={isEditable}
            incomingRecordOptions={incomingRecordOptions}
          />
          <div
            ref={compareElemRef}
            className={css.compare}
            style={{
              width: compareElemWidth,
              height: `calc(${height}px + ${css.cellPadding} - ${css.selectedLineBorderWidth} - ${css.selectedLineBorderWidth})`,
              right: isLocalLTR ? 0 : null,
              left: !isLocalLTR ? `-${compareElemWidth}px` : null,
            }}
          >
            <Triangle direction={isLocalLTR ? 'right' : 'left'} />
            <span className={css.compareMessage}>
              <FormattedMessage id="ui-data-import.compare" />
            </span>
            <Triangle direction={isLocalLTR ? 'left' : 'right'} />
          </div>
        </Col>
        <Col
          xs
          className={classNames(css.cell, { [css.borderLeft]: isLocalLTR }, { [css.borderRight]: !isLocalLTR })}
          style={{
            paddingLeft: isLocalLTR ? spaceForCompareElem : spaceForHintElement,
            paddingRight: isLocalLTR ? spaceForHintElement : spaceForCompareElem,
          }}
        >
          <div ref={existingRecordsElemRef}>
            {compareElemWidth && (
              <RecordSelect
                id={id}
                onSelect={setExistingRecord}
                isEditable={isEditable}
                isLocalLTR={isLocalLTR}
              />
            )}
          </div>
        </Col>
      </Row>
    </section>
  );
});

CompareRecordSelect.propTypes = {
  id: PropTypes.string,
  setExistingRecord: PropTypes.func,
  setIncomingRecord: PropTypes.func,
  incomingRecord: PropTypes.object,
  existingRecord: PropTypes.object,
  incomingRecordOptions: PropTypes.object,
  isEditable: PropTypes.bool,
  isLocalLTR: PropTypes.bool,
};
