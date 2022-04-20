import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';
import { ViewRepeatableField } from '../ViewRepeatableField';

import {
  getFieldValue,
  getBooleanLabelId,
  getValueById,
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
  const formerIdsRepeatableAction = getFieldValue(mappingDetails, 'formerIds', 'repeatableFieldAction');
  const statisticalCodes = getFieldValue(mappingDetails, 'statisticalCodeIds', 'subfields');
  const statisticalCodesRepeatableAction = getFieldValue(mappingDetails,
    'statisticalCodeIds', 'repeatableFieldAction');
  const administrativeNotes = getFieldValue(mappingDetails, 'administrativeNotes', 'subfields');
  const administrativeNotesRepeatableAction = getFieldValue(mappingDetails, 'administrativeNotes', 'repeatableFieldAction');
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
  const administrativeNotesVisibleColumns = ['administrativeNote'];

  const statisticalCodesMapping = {
    statisticalCodeId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCode`} />
    ),
  };
  const administrativeNotesMapping = {
    administrativeNote: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.administrativeData.field.administrativeNote`} />
    ),
  };

  const statisticalCodesFormatter = { statisticalCodeId: x => x?.statisticalCodeId || noValueElement };
  const administrativeNotesFormatter = { administrativeNote: x => x?.administrativeNote || noValueElement };

  const statisticalCodesFieldsMap = [
    {
      field: 'statisticalCodeId',
      key: 'value',
    },
  ];
  const administrativeNotesFieldsMap = [
    {
      field: 'administrativeNote',
      key: 'value',
    },
  ];

  const statisticalCodesData = transformSubfieldsData(statisticalCodes, statisticalCodesFieldsMap);
  const administrativeNotesData = transformSubfieldsData(administrativeNotes, administrativeNotesFieldsMap);

  return (
    <Accordion
      id="view-administrative-data"
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
            value={itemHrid || <ProhibitionIcon fieldName="administrative-data-hrid" />}
          />
        </Col>
        <Col
          data-test-barcode
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.barcode`} />}
            value={barcode}
          />
        </Col>
        <Col
          data-test-accession-number
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.accessionNumber`} />}
            value={accessionNumber}
          />
        </Col>
        <Col
          data-test-item-identifier
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.itemIdentifier`} />}
            value={itemIdentifier}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-former-ids
          xs={12}
          className={css.colWithTable}
        >
          <ViewRepeatableField
            columnIdPrefix="former-ids"
            repeatableAction={formerIdsRepeatableAction}
            fieldData={formerIdentifiersData}
            visibleColumns={formerIdentifiersVisibleColumns}
            columnMapping={formerIdentifiersMapping}
            formatter={formerIdentifiersFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.item.administrativeData.field.formerId.legend`}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statistical-codes
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="statistical-codes"
            repeatableAction={statisticalCodesRepeatableAction}
            fieldData={statisticalCodesData}
            visibleColumns={statisticalCodesVisibleColumns}
            columnMapping={statisticalCodesMapping}
            formatter={statisticalCodesFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.administrativeData.field.statisticalCodes.legend`}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="administrative-notes"
            repeatableAction={administrativeNotesRepeatableAction}
            fieldData={administrativeNotesData}
            visibleColumns={administrativeNotesVisibleColumns}
            columnMapping={administrativeNotesMapping}
            formatter={administrativeNotesFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.administrativeData.field.administrativeNotes.legend`}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

AdministrativeData.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
