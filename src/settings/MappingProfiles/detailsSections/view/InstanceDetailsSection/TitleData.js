import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  KeyValue,
  MultiColumnList,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';

import {
  transformSubfieldsData,
  getContentData,
  getFieldValue,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

import css from '../../../MappingProfiles.css';

export const TitleData = ({ mappingDetails }) => {
  const prohibitionIconElement = <ProhibitionIcon />;

  const resourceTitle = getFieldValue(mappingDetails, 'title', 'value');
  const alternativeTitles = getFieldValue(mappingDetails, 'alternativeTitles', 'subfields');
  const indexTitle = getFieldValue(mappingDetails, 'indexTitle', 'value');
  const seriesStatements = getFieldValue(mappingDetails, 'series', 'subfields');
  const precedingTitles = getFieldValue(mappingDetails, 'precedingTitles', 'subfields');
  const succeedingTitles = getFieldValue(mappingDetails, 'succeedingTitles', 'subfields');

  const alternativeTitlesVisibleColumns = ['alternativeTitleTypeId', 'alternativeTitle'];
  const alternativeTitlesMapping = {
    alternativeTitleTypeId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.alternativeTitles.field.alternativeTitleTypeId`} />
    ),
    alternativeTitle: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.alternativeTitles.field.alternativeTitle`} />
    ),
  };
  const alternativeTitlesFormatter = {
    alternativeTitleTypeId: x => x?.alternativeTitleTypeId || prohibitionIconElement,
    alternativeTitle: x => x?.alternativeTitle || prohibitionIconElement,
  };
  const alternativeTitlesFieldsMap = [
    {
      field: 'alternativeTitleTypeId',
      key: 'value',
    }, {
      field: 'alternativeTitle',
      key: 'value',
    },
  ];
  const alternativeTitlesData = transformSubfieldsData(alternativeTitles, alternativeTitlesFieldsMap);

  const seriesStatementsVisibleColumns = ['source'];
  const seriesStatementsMapping = {
    source: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.series.field.series`} />
    ),
  };
  const seriesStatementsFormatter = { source: x => x?.source || prohibitionIconElement };
  const seriesStatementsFieldsMap = [
    {
      field: 'source',
      key: 'value',
    },
  ];
  const seriesStatementsData = transformSubfieldsData(seriesStatements, seriesStatementsFieldsMap);

  const precedingTitlesVisibleColumns = ['precedingTitlesTitle', 'precedingTitlesHrid', 'precedingTitlesIsbn',
    'precedingTitlesIssn'];
  const precedingTitlesMapping = {
    precedingTitlesTitle: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.precedingTitles.field.precedingTitlesTitle`} />
    ),
    precedingTitlesHrid: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.precedingTitles.field.precedingTitlesHrid`} />
    ),
    precedingTitlesIsbn: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.precedingTitles.field.precedingTitlesIsbn`} />
    ),
    precedingTitlesIssn: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.precedingTitles.field.precedingTitlesIssn`} />
    ),
  };
  const precedingTitlesFormatter = {
    precedingTitlesTitle: x => x?.precedingTitlesTitle || prohibitionIconElement,
    precedingTitlesHrid: x => x?.precedingTitlesHrid || prohibitionIconElement,
    precedingTitlesIsbn: x => x?.precedingTitlesIsbn || prohibitionIconElement,
    precedingTitlesIssn: x => x?.precedingTitlesIssn || prohibitionIconElement,
  };
  const precedingTitlesFieldsMap = [
    {
      field: 'precedingTitlesTitle',
      key: 'value',
    }, {
      field: 'precedingTitlesHrid',
      key: 'value',
    }, {
      field: 'precedingTitlesIsbn',
      key: 'value',
    }, {
      field: 'precedingTitlesIssn',
      key: 'value',
    },
  ];
  const precedingTitlesData = transformSubfieldsData(precedingTitles, precedingTitlesFieldsMap);

  const succeedingTitlesVisibleColumns = ['succeedingTitlesTitle', 'succeedingTitlesHrid', 'succeedingTitlesIsbn',
    'succeedingTitlesIssn'];
  const succeedingTitlesMapping = {
    succeedingTitlesTitle: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.succeedingTitles.field.succeedingTitlesTitle`} />
    ),
    succeedingTitlesHrid: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.succeedingTitles.field.succeedingTitlesHrid`} />
    ),
    succeedingTitlesIsbn: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.succeedingTitles.field.succeedingTitlesIsbn`} />
    ),
    succeedingTitlesIssn: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.succeedingTitles.field.succeedingTitlesIssn`} />
    ),
  };
  const succeedingTitlesFormatter = {
    succeedingTitlesTitle: x => x?.succeedingTitlesTitle || prohibitionIconElement,
    succeedingTitlesHrid: x => x?.succeedingTitlesHrid || prohibitionIconElement,
    succeedingTitlesIsbn: x => x?.succeedingTitlesIsbn || prohibitionIconElement,
    succeedingTitlesIssn: x => x?.succeedingTitlesIssn || prohibitionIconElement,
  };
  const succeedingTitlesFieldsMap = [
    {
      field: 'succeedingTitlesTitle',
      key: 'value',
    }, {
      field: 'succeedingTitlesHrid',
      key: 'value',
    }, {
      field: 'succeedingTitlesIsbn',
      key: 'value',
    }, {
      field: 'succeedingTitlesIssn',
      key: 'value',
    },
  ];
  const succeedingTitlesData = transformSubfieldsData(succeedingTitles, succeedingTitlesFieldsMap);

  return (
    <Accordion
      id="title-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.titleData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-resource-title
          xs={12}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.titleData.field.title`} />}
            value={resourceTitle || prohibitionIconElement}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-alternative-titles
          xs={12}
          className={css.colWithTable}
        >
          <KeyValue label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.alternativeTitles.legend`} />}>
            <MultiColumnList
              contentData={getContentData(alternativeTitlesData)}
              visibleColumns={alternativeTitlesVisibleColumns}
              columnMapping={alternativeTitlesMapping}
              formatter={alternativeTitlesFormatter}
            />
          </KeyValue>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-index-title
          xs={12}
          className={css.colWithTable}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.titleData.field.indexTitle`} />}
            value={indexTitle || prohibitionIconElement}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-series-statements
          xs={12}
          className={css.colWithTable}
        >
          <KeyValue label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.series.legend`} />}>
            <MultiColumnList
              contentData={getContentData(seriesStatementsData)}
              visibleColumns={seriesStatementsVisibleColumns}
              columnMapping={seriesStatementsMapping}
              formatter={seriesStatementsFormatter}
            />
          </KeyValue>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-preceding-titles
          xs={12}
          className={css.colWithTable}
        >
          <KeyValue label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.precedingTitles.legend`} />}>
            <MultiColumnList
              contentData={getContentData(precedingTitlesData)}
              visibleColumns={precedingTitlesVisibleColumns}
              columnMapping={precedingTitlesMapping}
              formatter={precedingTitlesFormatter}
            />
          </KeyValue>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-succeeding-titles
          xs={12}
          className={css.colWithTable}
        >
          <KeyValue label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.titleData.field.succeedingTitles.legend`} />}>
            <MultiColumnList
              contentData={getContentData(succeedingTitlesData)}
              visibleColumns={succeedingTitlesVisibleColumns}
              columnMapping={succeedingTitlesMapping}
              formatter={succeedingTitlesFormatter}
            />
          </KeyValue>
        </Col>
      </Row>
    </Accordion>
  );
};

TitleData.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
