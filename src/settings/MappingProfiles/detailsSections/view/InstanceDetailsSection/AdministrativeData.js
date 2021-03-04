import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';
import { ViewRepeatableField } from '../ViewRepeatableField';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getFieldValue,
  transformSubfieldsData,
  getBooleanLabelId,
  getValueById,
} from '../../utils';
import { mappingProfileFieldShape } from '../../../../../utils';

export const AdministrativeData = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;
  const prohibitionIconElement = fieldName => <ProhibitionIcon fieldName={fieldName} />;

  const discoverySuppress = getFieldValue(mappingDetails, 'discoverySuppress', 'booleanFieldAction');
  const staffSuppress = getFieldValue(mappingDetails, 'staffSuppress', 'booleanFieldAction');
  const previouslyHeld = getFieldValue(mappingDetails, 'previouslyHeld', 'booleanFieldAction');
  const instanceHrid = getFieldValue(mappingDetails, 'hrid', 'value');
  const metadataSource = getFieldValue(mappingDetails, 'source', 'value');
  const catalogedDate = getFieldValue(mappingDetails, 'catalogedDate', 'value');
  const statusTerm = getFieldValue(mappingDetails, 'statusId', 'value');
  const modeOfIssuance = getFieldValue(mappingDetails, 'modeOfIssuanceId', 'value');
  const statisticalCodes = getFieldValue(mappingDetails, 'statisticalCodeIds', 'subfields');
  const statisticalCodesRepeatableAction = getFieldValue(mappingDetails, 'statisticalCodeIds', 'repeatableFieldAction');

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
            value={instanceHrid || prohibitionIconElement('instance-hrid')}
          />
        </Col>
        <Col
          data-test-metadata-source
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.administrationData.field.source`} />}
            value={metadataSource || prohibitionIconElement('instance-source')}
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
            value={catalogedDate}
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
            value={statusTerm}
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
            value={modeOfIssuance || prohibitionIconElement('instance-mode-of-issuance-id')}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statistical-codes
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
