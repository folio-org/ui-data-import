import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Label,
  Col,
  Row,
} from '@folio/stripes-components';

import {
  getFieldValue,
  getSubfieldValue,
  getSubfields,
} from './utils';

export const initialHoldingsFields = {
  formerHoldingsId: [],
  statisticalCode: [],
  holdingsStatements: [],
  statementsForSuppl: [],
  statementsForIndexes: [],
  notes: [],
  electronicAccess: [],
  receivingHistory: [],
};

const getRepeatableProps = (fieldType, fields, setFields) => ({
  onAdd: () => {
    const updatedFields = { ...fields };

    updatedFields[fieldType] = [...updatedFields[fieldType], {}];
    setFields(updatedFields);
  },
  onRemove: index => {
    const updatedFields = { ...fields };

    updatedFields[fieldType].splice(index, 1);
    setFields(updatedFields);
  },
});

export const getViewHoldingsDetails = mappingFields => ({
  discoverySuppress: getFieldValue(mappingFields, 'discoverySuppress'),
  hrid: getFieldValue(mappingFields, 'hrid'),
  holdingsTypeId: getFieldValue(mappingFields, 'holdingsTypeId'),
  permanentLocationId: getFieldValue(mappingFields, 'permanentLocationId'),
  temporaryLocationId: getFieldValue(mappingFields, 'temporaryLocationId'),
  shelvingOrder: getFieldValue(mappingFields, 'shelvingOrder'),
  shelvingTitle: getFieldValue(mappingFields, 'shelvingTitle'),
  copyNumber: getFieldValue(mappingFields, 'copyNumber'),
  callNumberTypeId: getFieldValue(mappingFields, 'callNumberTypeId'),
  callNumberPrefix: getFieldValue(mappingFields, 'callNumberPrefix'),
  callNumber: getFieldValue(mappingFields, 'callNumber'),
  callNumberSuffix: getFieldValue(mappingFields, 'callNumberSuffix'),
  numberOfItems: getFieldValue(mappingFields, 'numberOfItems'),
  illPolicyId: getFieldValue(mappingFields, 'illPolicyId'),
  digitizationPolicy: getFieldValue(mappingFields, 'digitizationPolicy'),
  retentionPolicy: getFieldValue(mappingFields, 'retentionPolicy'),
  acquisitionMethod: getFieldValue(mappingFields, 'acquisitionMethod'),
  acquisitionFormat: getFieldValue(mappingFields, 'acquisitionFormat'),
  receiptStatus: getFieldValue(mappingFields, 'receiptStatus'),
});

// TODO: Rewrite this method, pass arg to function and use it instead of mappingFields
export const getViewHoldingsFormatter = mappingFields => ({
  formerHoldingsId: () => getSubfieldValue(mappingFields, 'formerIds', 'id'),
  statisticalCode: () => getSubfieldValue(mappingFields, 'statisticalCodeIds', 'statisticalCode'),
  holdingsStatement: () => getSubfieldValue(mappingFields, 'holdingsStatements', 'statements'),
  holdingsStatementNote: () => getSubfieldValue(mappingFields, 'holdingsStatements', 'note'),
  holdingsStatementForSuppl: () => getSubfieldValue(mappingFields, 'holdingsStatementsForSupplements', 'statement'),
  holdingsStatementForSupplNote: () => getSubfieldValue(mappingFields, 'holdingsStatementsForSupplements', 'note'),
  holdingsStatementForIndexes: () => getSubfieldValue(mappingFields, 'holdingsStatementsForIndexes', 'statement'),
  holdingsStatementForIndexesNote: () => getSubfieldValue(mappingFields, 'holdingsStatementsForIndexes', 'note'),
  noteType: () => getSubfieldValue(mappingFields, 'notes', 'instanceNoteTypeId'),
  note: () => getSubfieldValue(mappingFields, 'notes', 'note'),
  staffOnly: () => getSubfieldValue(mappingFields, 'notes', 'staffOnly'),
  relationship: () => getSubfieldValue(mappingFields, 'electronicAccess', 'relationshipId'),
  uri: () => getSubfieldValue(mappingFields, 'electronicAccess', 'uri'),
  linkText: () => getSubfieldValue(mappingFields, 'electronicAccess', 'linkText'),
  materialSpecified: () => getSubfieldValue(mappingFields, 'electronicAccess', 'materialsSpecification'),
  urlPublicNote: () => getSubfieldValue(mappingFields, 'electronicAccess', 'publicNote'),
  publicDisplay: () => getSubfieldValue(mappingFields, 'receivingHistory', 'publicDisplay'),
  enumeration: () => getSubfieldValue(mappingFields, 'receivingHistory', 'enumeration'),
  chronology: () => getSubfieldValue(mappingFields, 'receivingHistory', 'chronology'),
});

export const getViewHoldingsProps = mappingFields => ({
  'mapping-details-former-holdings-id': {
    contentData: getSubfields(mappingFields, 'formerIds'),
    visibleColumns: ['formerHoldingsId'],
    columnMapping: { formerHoldingsId: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.formerHoldingsId" />) },
    formatter: getViewHoldingsFormatter(mappingFields),
  },
  'mapping-details-statistical-code': {
    contentData: getSubfields(mappingFields, 'statisticalCodeIds'),
    visibleColumns: ['statisticalCode'],
    columnMapping: { statisticalCode: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.statisticalCode" />) },
    formatter: getViewHoldingsFormatter(mappingFields),
  },
  'mapping-details-holdings-statements': {
    contentData: getSubfields(mappingFields, 'holdingsStatements'),
    visibleColumns: ['holdingsStatement', 'holdingsStatementNote'],
    columnMapping: {
      holdingsStatement: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.holdingsStatement" />),
      holdingsStatementNote: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.holdingsStatementNote" />),
    },
    formatter: getViewHoldingsFormatter(mappingFields),
    columnWidths: {
      holdingsStatement: '50%',
      holdingsStatementNote: '50%',
    },
  },
  'mapping-details-statements-for-suppl': {
    contentData: getSubfields(mappingFields, 'holdingsStatementsForSupplements'),
    visibleColumns: ['holdingsStatementForSuppl', 'holdingsStatementForSupplNote'],
    columnMapping: {
      holdingsStatementForSuppl: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.holdingsStatementForSuppl" />),
      holdingsStatementForSupplNote: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.holdingsStatementForSupplNote" />),
    },
    formatter: getViewHoldingsFormatter(mappingFields),
    columnWidths: {
      holdingsStatementForSuppl: '50%',
      holdingsStatementForSupplNote: '50%',
    },
  },
  'mapping-details-statements-for-indexes': {
    contentData: getSubfields(mappingFields, 'holdingsStatementsForIndexes'),
    visibleColumns: ['holdingsStatementForIndexes', 'holdingsStatementForIndexesNote'],
    columnMapping: {
      holdingsStatementForIndexes: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.holdingsStatementForIndexes" />),
      holdingsStatementForIndexesNote: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.holdingsStatementForIndexesNote" />),
    },
    formatter: getViewHoldingsFormatter(mappingFields),
    columnWidths: {
      holdingsStatementForIndexes: '50%',
      holdingsStatementForIndexesNote: '50%',
    },
  },
  'mapping-details-notes': {
    contentData: getSubfields(mappingFields, 'notes'),
    visibleColumns: ['noteType', 'note', 'staffOnly'],
    columnMapping: {
      noteType: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.noteType" />),
      note: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.note" />),
      staffOnly: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.staffOnly" />),
    },
    formatter: getViewHoldingsFormatter(mappingFields),
    columnWidths: {
      noteType: `${100 / 3}%`,
      note: `${100 / 3}%`,
      staffOnly: `${100 / 3}%`,
    },
  },
  'mapping-details-electronic-access': {
    contentData: getSubfields(mappingFields, 'electronicAccess'),
    visibleColumns: ['relationship', 'uri', 'linkText', 'materialSpecified', 'urlPublicNote'],
    columnMapping: {
      relationship: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.relationship" />),
      uri: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.uri" />),
      linkText: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.linkText" />),
      materialSpecified: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.materialSpecified" />),
      urlPublicNote: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.urlPublicNote" />),
    },
    formatter: getViewHoldingsFormatter(mappingFields),
  },
  'mapping-details-receiving-history': {
    contentData: getSubfields(mappingFields, 'receivingHistory'),
    visibleColumns: ['publicDisplay', 'enumeration', 'chronology'],
    columnMapping: {
      publicDisplay: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.publicDisplay" />),
      enumeration: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.enumeration" />),
      chronology: (<FormattedMessage id="ui-data-import.settings.mappingProfiles.chronology" />),
    },
    formatter: getViewHoldingsFormatter(mappingFields),
  },
});

export const getHoldingsProps = (mappingFields, holdingsFields, setHoldingsFields) => ({
  'mapping-details-former-holdings-id': {
    ...getRepeatableProps('formerHoldingsId', holdingsFields, setHoldingsFields),
    headLabels: (
      <Row>
        <Col xs={8}>
          <Label id="formerHoldingsId">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.formerHoldingsId" />
          </Label>
        </Col>
      </Row>
    ),
  },
  'mapping-details-statistical-code': {
    ...getRepeatableProps('statisticalCode', holdingsFields, setHoldingsFields),
    headLabels: (
      <Row>
        <Col xs={8}>
          <Label id="statisticalCode">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.statisticalCode" />
          </Label>
        </Col>
      </Row>
    ),
  },
  'mapping-details-holdings-statements': {
    ...getRepeatableProps('holdingsStatements', holdingsFields, setHoldingsFields),
    headLabels: (
      <Row>
        <Col xs={6}>
          <Label id="holdingsStatement">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.holdingsStatement" />
          </Label>
        </Col>
        <Col xs={6}>
          <Label id="holdingsStatementNote">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.holdingsStatementNote" />
          </Label>
        </Col>
      </Row>
    ),
  },
  'mapping-details-statements-for-suppl': {
    ...getRepeatableProps('statementsForSuppl', holdingsFields, setHoldingsFields),
    headLabels: (
      <Row>
        <Col xs={6}>
          <Label id="holdingsStatementForSuppl">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.holdingsStatementForSuppl" />
          </Label>
        </Col>
        <Col xs={6}>
          <Label id="holdingsStatementForSupplNote">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.holdingsStatementForSupplNote" />
          </Label>
        </Col>
      </Row>
    ),
  },
  'mapping-details-statements-for-indexes': {
    ...getRepeatableProps('statementsForIndexes', holdingsFields, setHoldingsFields),
    headLabels: (
      <Row>
        <Col xs={6}>
          <Label id="holdingsStatementForIndexes">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.holdingsStatementForIndexes" />
          </Label>
        </Col>
        <Col xs={6}>
          <Label id="holdingsStatementForIndexesNote">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.holdingsStatementForIndexesNote" />
          </Label>
        </Col>
      </Row>
    ),
  },
  'mapping-details-notes': {
    ...getRepeatableProps('notes', holdingsFields, setHoldingsFields),
    headLabels: (
      <Row>
        <Col xs={4}>
          <Label id="noteType">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.noteType" />
          </Label>
        </Col>
        <Col xs={4}>
          <Label id="note">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.note" />
          </Label>
        </Col>
        <Col xs={4}>
          <Label id="staffOnly">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.staffOnly" />
          </Label>
        </Col>
      </Row>
    ),
  },
  'mapping-details-electronic-access': {
    ...getRepeatableProps('electronicAccess', holdingsFields, setHoldingsFields),
    headLabels: (
      <Row bottom="xs">
        <Col xs={2.4}>
          <Label id="relationship">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.relationship" />
          </Label>
        </Col>
        <Col xs={2.4}>
          <Label id="uri">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.uri" />
          </Label>
        </Col>
        <Col xs={2.4}>
          <Label id="linkText">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.linkText" />
          </Label>
        </Col>
        <Col xs={2.4}>
          <Label id="materialSpecified">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.materialSpecified" />
          </Label>
        </Col>
        <Col xs={2.4}>
          <Label id="urlPublicNote">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.urlPublicNote" />
          </Label>
        </Col>
      </Row>
    ),
  },
  'mapping-details-receiving-history': {
    ...getRepeatableProps('receivingHistory', holdingsFields, setHoldingsFields),
    headLabels: (
      <Row>
        <Col xs={4}>
          <Label id="publicDisplay">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.publicDisplay" />
          </Label>
        </Col>
        <Col xs={4}>
          <Label id="enumeration">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.enumeration" />
          </Label>
        </Col>
        <Col xs={4}>
          <Label id="chronology">
            <FormattedMessage id="ui-data-import.settings.mappingProfiles.chronology" />
          </Label>
        </Col>
      </Row>
    ),
  },
});
