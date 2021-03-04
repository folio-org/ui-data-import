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

import { ViewRepeatableField } from '../ViewRepeatableField';

import {
  getFieldValue,
  transformSubfieldsData,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';
import css from '../../../MappingProfiles.css';

export const HoldingsDetails = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const numberOfItems = getFieldValue(mappingDetails, 'numberOfItems', 'value');
  const statements = getFieldValue(mappingDetails, 'holdingsStatements', 'subfields');
  const statementsRepeatableAction = getFieldValue(mappingDetails,
    'holdingsStatements', 'repeatableFieldAction');
  const statementsForSupplement = getFieldValue(mappingDetails, 'holdingsStatementsForSupplements', 'subfields');
  const statementsForSupplementRepeatableAction = getFieldValue(mappingDetails,
    'holdingsStatementsForSupplements', 'repeatableFieldAction');
  const statementsForIndexes = getFieldValue(mappingDetails, 'holdingsStatementsForIndexes', 'subfields');
  const statementsForIndexesRepeatableAction = getFieldValue(mappingDetails,
    'holdingsStatementsForIndexes', 'repeatableFieldAction');
  const illPolicy = getFieldValue(mappingDetails, 'illPolicyId', 'value');
  const digitizationPolicy = getFieldValue(mappingDetails, 'digitizationPolicy', 'value');
  const retentionPolicy = getFieldValue(mappingDetails, 'retentionPolicy', 'value');

  const statementsVisibleColumns = ['statement', 'note', 'staffNote'];
  const statementsMapping = {
    statement: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatement`} />
    ),
    note: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatementPublicNote`} />
    ),
    staffNote: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatementStaffNote`} />
    ),
  };
  const statementsFormatter = {
    statement: x => x?.statement || noValueElement,
    note: x => x?.note || noValueElement,
    staffNote: x => x?.staffNote || noValueElement,
  };
  const statementsFieldsMap = [
    {
      field: 'statement',
      key: 'value',
    }, {
      field: 'note',
      key: 'value',
    }, {
      field: 'staffNote',
      key: 'value',
    },
  ];
  const statementsData = transformSubfieldsData(statements, statementsFieldsMap);

  const statementsForSupplementVisibleColumns = ['statement', 'note', 'staffNote'];
  const statementsForSupplementMapping = {
    statement: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatement`} />
    ),
    note: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatementPublicNote`} />
    ),
    staffNote: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatementStaffNote`} />
    ),
  };
  const statementsForSupplementFormatter = {
    statement: x => x?.statement || noValueElement,
    note: x => x?.note || noValueElement,
    staffNote: x => x?.staffNote || noValueElement,
  };
  const statementsForSupplementFieldsMap = [
    {
      field: 'statement',
      key: 'value',
    }, {
      field: 'note',
      key: 'value',
    }, {
      field: 'staffNote',
      key: 'value',
    },
  ];
  const statementsForSupplementData = transformSubfieldsData(statementsForSupplement, statementsForSupplementFieldsMap);

  const statementsForIndexesVisibleColumns = ['statement', 'note', 'staffNote'];
  const statementsForIndexesMapping = {
    statement: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatement`} />
    ),
    note: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatementPublicNote`} />
    ),
    staffNote: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatementStaffNote`} />
    ),
  };
  const statementsForIndexesFormatter = {
    statement: x => x?.statement || noValueElement,
    note: x => x?.note || noValueElement,
    staffNote: x => x?.staffNote || noValueElement,
  };
  const statementsForIndexesFieldsMap = [
    {
      field: 'statement',
      key: 'value',
    }, {
      field: 'note',
      key: 'value',
    }, {
      field: 'staffNote',
      key: 'value',
    },
  ];
  const statementsForIndexesData = transformSubfieldsData(statementsForIndexes, statementsForIndexesFieldsMap);

  return (
    <Accordion
      id="holdings-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.details.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-number-of-items
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.details.field.numberOfItems`} />}
            value={numberOfItems}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statements
          id="section-holding-statements"
          xs={12}
          className={css.colWithTable}
        >
          <ViewRepeatableField
            repeatableAction={statementsRepeatableAction}
            fieldData={statementsData}
            visibleColumns={statementsVisibleColumns}
            columnMapping={statementsMapping}
            formatter={statementsFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.holdings.statements.field.holdingsStatement.legend`}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statements-for-supplement
          id="section-holding-statements-for-supplements"
          xs={12}
          className={css.colWithTable}
        >
          <ViewRepeatableField
            repeatableAction={statementsForSupplementRepeatableAction}
            fieldData={statementsForSupplementData}
            visibleColumns={statementsForSupplementVisibleColumns}
            columnMapping={statementsForSupplementMapping}
            formatter={statementsForSupplementFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.statements.field.holdingsStatementsForSupplements.legend`}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-statements-for-indexes
          id="section-holding-statements-for-indexes"
          xs={12}
          className={css.colWithTable}
        >
          <ViewRepeatableField
            repeatableAction={statementsForIndexesRepeatableAction}
            fieldData={statementsForIndexesData}
            visibleColumns={statementsForIndexesVisibleColumns}
            columnMapping={statementsForIndexesMapping}
            formatter={statementsForIndexesFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.statements.field.holdingsStatementsForIndexes.legend`}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-ill-policy
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.field.illPolicy`} />}
            value={illPolicy}
          />
        </Col>
        <Col
          data-test-digitization-policy
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.field.digitizationPolicy`} />}
            value={digitizationPolicy}
          />
        </Col>
        <Col
          data-test-retention-policy
          xs={4}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.field.retentionPolicy`} />}
            value={retentionPolicy}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

HoldingsDetails.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
