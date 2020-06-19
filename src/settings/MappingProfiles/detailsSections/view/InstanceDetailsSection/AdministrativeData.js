import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  KeyValue,
  NoValue,
  MultiColumnList,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getFieldValue,
  transformSubfieldsData,
  getContentData,
  getBooleanLabelId,
  getValueById,
} from '../../utils';
import { mappingProfileFieldShape } from '../../../../../utils';

import css from '../../../MappingProfiles.css';

export const AdministrativeData = ({ mappingDetails }) => {
  const discoverySuppress = getFieldValue(mappingDetails, 'discoverySuppress', 'booleanFieldAction');
  const staffSuppress = getFieldValue(mappingDetails, 'staffSuppress', 'booleanFieldAction');
  const previouslyHeld = getFieldValue(mappingDetails, 'previouslyHeld', 'booleanFieldAction');
  const instanceHrid = getFieldValue(mappingDetails, 'hrid', 'value');
  const metadataSource = getFieldValue(mappingDetails, 'source', 'value');
  const catalogedDate = getFieldValue(mappingDetails, 'catalogedDate', 'value');
  const statusTerm = getFieldValue(mappingDetails, 'statusId', 'value');
  const modeOfIssuance = getFieldValue(mappingDetails, 'modeOfIssuanceId', 'value');
  const statisticalCodes = getFieldValue(mappingDetails, 'statisticalCodeIds', 'subfields');

  const discoverySuppressLabelId = getBooleanLabelId(discoverySuppress);
  const staffSuppressLabelId = getBooleanLabelId(staffSuppress);
  const previouslyHeldLabelId = getBooleanLabelId(previouslyHeld);

  const discoverySuppressValue = getValueById(discoverySuppressLabelId);
  const staffSuppressValue = getValueById(staffSuppressLabelId);
  const previouslyHeldValue = getValueById(previouslyHeldLabelId);

  const statisticalCodesVisibleColumns = ['statisticalCodeId'];
  const statisticalCodesMapping = {
    statisticalCodeId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCode`} />
    ),
  };
  const statisticalCodesFormatter = { statisticalCodeId: x => x?.statisticalCodeId || <NoValue /> };
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
        <Col
          data-test-staff-suppress
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.staffSuppress`} />}
            value={staffSuppressValue}
          />
        </Col>
        <Col
          data-test-previously-held
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.previouslyHeld`} />}
            value={previouslyHeldValue}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-instance-hrid
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.administrationData.field.hrid`} />}
            value={instanceHrid || <ProhibitionIcon />}
          />
        </Col>
        <Col
          data-test-metadata-source
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.administrationData.field.source`} />}
            value={metadataSource || <ProhibitionIcon />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-cataloged-date
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.administrationData.field.catalogedDate`} />}
            value={catalogedDate || <NoValue />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-status-term
          xs={12}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.administrationData.field.statusId`} />}
            value={statusTerm || <NoValue />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-mode-of-issuance
          xs={12}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.administrationData.field.modeOfIssuanceId`} />}
            value={modeOfIssuance || <ProhibitionIcon />}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statistical-codes
          xs={12}
          className={css.colWithTable}
        >
          <div className={css.tableLegend}>
            <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.legend`} />
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

AdministrativeData.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
