import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  NoValue,
  KeyValue,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';
import { ViewRepeatableField } from '../ViewRepeatableField';

import {
  getFieldValue,
  getBooleanLabelId,
  transformSubfieldsData,
  getValueById,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

import css from '../../../MappingProfiles.css';

export const AdministrativeData = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const discoverySuppress = getFieldValue(mappingDetails, 'discoverySuppress', 'booleanFieldAction');
  const holdingsHrid = getFieldValue(mappingDetails, 'hrid', 'value');
  const formerIds = getFieldValue(mappingDetails, 'formerIds', 'subfields');
  const formerIdsRepeatableAction = getFieldValue(mappingDetails, 'formerIds', 'repeatableFieldAction');
  const holdingsType = getFieldValue(mappingDetails, 'holdingsTypeId', 'value');
  const statisticalCodes = getFieldValue(mappingDetails, 'statisticalCodeIds', 'subfields');
  const statisticalCodesRepeatableAction = getFieldValue(mappingDetails, 'statisticalCodeIds', 'repeatableFieldAction');

  const discoverySuppressLabelId = getBooleanLabelId(discoverySuppress);
  const discoverySuppressValue = getValueById(discoverySuppressLabelId);

  const formerIdsVisibleColumns = ['formerId'];
  const formerIdsMapping = {
    formerId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.formerId`} />
    ),
  };
  const formerIdsFormatter = { formerId: x => x?.formerId || noValueElement };
  const formerIdentifiersFieldsMap = [
    {
      field: 'formerId',
      key: 'value',
    },
  ];
  const formerIdsData = transformSubfieldsData(formerIds, formerIdentifiersFieldsMap);

  const statisticalCodesVisibleColumns = ['statisticalCodeId'];
  const statisticalCodesMapping = {
    statisticalCodeId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCode`} />
    ),
  };
  const statisticalCodesFieldsMap = [
    {
      field: 'statisticalCodeId',
      key: 'value',
    },
  ];
  const statisticalCodesFormatter = { statisticalCodeId: x => x?.statisticalCodeId || noValueElement };
  const statisticalCodesData = transformSubfieldsData(statisticalCodes, statisticalCodesFieldsMap);

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
            value={holdingsHrid || <ProhibitionIcon fieldName="administrative-data-hrid" />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          id="section-former-ids"
          xs={12}
          className={css.colWithTable}
        >
          <ViewRepeatableField
            repeatableAction={formerIdsRepeatableAction}
            fieldData={formerIdsData}
            visibleColumns={formerIdsVisibleColumns}
            columnMapping={formerIdsMapping}
            formatter={formerIdsFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.holdings.administrativeData.field.formerId.legend`}
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
            value={holdingsType}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statistical-codes
          id="section-statistical-code-ids"
          xs={12}
        >
          <ViewRepeatableField
            repeatableAction={statisticalCodesRepeatableAction}
            fieldData={statisticalCodesData}
            visibleColumns={statisticalCodesVisibleColumns}
            columnMapping={statisticalCodesMapping}
            formatter={statisticalCodesFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.legend`}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

AdministrativeData.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
