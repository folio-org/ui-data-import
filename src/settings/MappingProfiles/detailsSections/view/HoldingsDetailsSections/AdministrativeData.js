import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  NoValue,
  KeyValue,
  MultiColumnList,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';

import {
  getFieldValue,
  getBooleanLabelId,
  getContentData,
  transformSubfieldsData,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

import css from '../../../MappingProfiles.css';

export const AdministrativeData = ({ mappingDetails }) => {
  const discoverySuppress = getFieldValue(mappingDetails, 'discoverySuppress', 'booleanFieldAction');
  const holdingsHrid = getFieldValue(mappingDetails, 'hrid', 'value');
  const formerIds = getFieldValue(mappingDetails, 'formerIds', 'subfields');
  const holdingsType = getFieldValue(mappingDetails, 'holdingsTypeId', 'value');
  const statisticalCodes = getFieldValue(mappingDetails, 'statisticalCodeIds', 'subfields');

  const discoverySuppressLabelId = getBooleanLabelId(discoverySuppress);
  const discoverySuppressValue = discoverySuppressLabelId ? <FormattedMessage id={discoverySuppressLabelId} /> : <NoValue />;

  const formerIdsVisibleColumns = ['formerId'];
  const formerIdsMapping = {
    formerId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.formerId`} />
    ),
  };
  const formerIdsFormatter = { formerId: x => x?.formerId || <NoValue /> };
  const formerIdsData = transformSubfieldsData(formerIds, formerIdsVisibleColumns);

  const statisticalCodesVisibleColumns = ['statisticalCodeId'];
  const statisticalCodesMapping = {
    statisticalCodeId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCode`} />
    ),
  };
  const statisticalCodesFormatter = { statisticalCodeId: x => x?.statisticalCodeId || <NoValue /> };
  const statisticalCodesData = transformSubfieldsData(statisticalCodes, statisticalCodesVisibleColumns);

  return (
    <Accordion
      id="administrative-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-suppress-from-discovery
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.discoverySuppress`} />}
            value={discoverySuppressValue}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-holdings-hrid
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.hrid`} />}
            value={holdingsHrid || <ProhibitionIcon />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          id="section-former-ids"
          xs={12}
          className={css.colWithTable}
        >
          <div>
            <strong>
              <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.formerId.legend`} />
            </strong>
          </div>
          <MultiColumnList
            contentData={getContentData(formerIdsData)}
            visibleColumns={formerIdsVisibleColumns}
            columnMapping={formerIdsMapping}
            formatter={formerIdsFormatter}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-holdings-type
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.holdingsTypeId`} />}
            value={holdingsType || <NoValue />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statistical-codes
          id="section-statistical-code-ids"
          xs={12}
        >
          <div>
            <strong>
              <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.legend`} />
            </strong>
          </div>
          <MultiColumnList
            contentData={getContentData(statisticalCodesData)}
            visibleColumns={statisticalCodesVisibleColumns}
            columnMapping={statisticalCodesMapping}
            formatter={statisticalCodesFormatter}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

AdministrativeData.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape) };
