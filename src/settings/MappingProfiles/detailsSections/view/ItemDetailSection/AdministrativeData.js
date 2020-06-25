import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  KeyValue,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';

import {
  getFieldValue,
  getBooleanLabelId,
  getValueById,
  getContentData,
  transformSubfieldsData,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

import css from '../../../MappingProfiles.css';

export const AdministrativeData = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const discoverySuppress = getFieldValue(mappingDetails, 'discoverySuppress', 'booleanFieldAction');
  const itemHrid = getFieldValue(mappingDetails, 'hrid', 'value');
  const barcode = getFieldValue(mappingDetails, 'barcode', 'value');
  const accessionNumber = getFieldValue(mappingDetails, 'accessionNumber', 'value');
  const itemIdentifier = getFieldValue(mappingDetails, 'itemIdentifier', 'value');
  const formerIds = getFieldValue(mappingDetails, 'formerIds', 'subfields');
  const statisticalCodes = getFieldValue(mappingDetails, 'statisticalCodeIds', 'subfields');

  const discoverySuppressLabelId = getBooleanLabelId(discoverySuppress);
  const discoverySuppressValue = getValueById(discoverySuppressLabelId);

  const formerIdentifiersVisibleColumns = ['formerId'];
  const formerIdentifiersMapping = {
    formerId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.formerId`} />
    ),
  };
  const formerIdentifiersFormatter = { formerId: x => x?.formerId || noValueElement };
  const formerIdentifiersFieldsMap = [
    {
      field: 'formerId',
      key: 'value',
    },
  ];
  const formerIdentifiersData = transformSubfieldsData(formerIds, formerIdentifiersFieldsMap);

  const statisticalCodesVisibleColumns = ['statisticalCodeId'];
  const statisticalCodesMapping = {
    statisticalCodeId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCode`} />
    ),
  };
  const statisticalCodesFormatter = { statisticalCodeId: x => x?.statisticalCodeId || noValueElement };
  const statisticalCodesFieldsMap = [
    {
      field: 'statisticalCodeId',
      key: 'value',
    },
  ];
  const statisticalCodesData = transformSubfieldsData(statisticalCodes, statisticalCodesFieldsMap);

  return (
    <Accordion
      id="administrative-data"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-suppress-from-discovery
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.discoverySuppress`} />}
            value={discoverySuppressValue}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-item-hrid
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.hrid`} />}
            value={itemHrid || <ProhibitionIcon />}
          />
        </Col>
        <Col
          data-test-barcode
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.barcode`} />}
            value={barcode || noValueElement}
          />
        </Col>
        <Col
          data-test-accession-number
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.accessionNumber`} />}
            value={accessionNumber || noValueElement}
          />
        </Col>
        <Col
          data-test-item-identifier
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.itemIdentifier`} />}
            value={itemIdentifier || noValueElement}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-former-ids
          id="section-former-ids"
          xs={12}
          className={css.colWithTable}
        >
          <KeyValue label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.formerId.legend`} />}>
            <MultiColumnList
              contentData={getContentData(formerIdentifiersData)}
              visibleColumns={formerIdentifiersVisibleColumns}
              columnMapping={formerIdentifiersMapping}
              formatter={formerIdentifiersFormatter}
            />
          </KeyValue>
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statistical-codes
          id="section-statistical-code-ids"
          xs={12}
          className={css.colWithTable}
        >
          <KeyValue label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.legend`} />}>
            <MultiColumnList
              contentData={getContentData(statisticalCodesData)}
              visibleColumns={statisticalCodesVisibleColumns}
              columnMapping={statisticalCodesMapping}
              formatter={statisticalCodesFormatter}
            />
          </KeyValue>
        </Col>
      </Row>
    </Accordion>
  );
};

AdministrativeData.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
