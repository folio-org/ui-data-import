import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Row,
  Col,
  TextField,
  TextArea,
  Datepicker,
  RepeatableField,
} from '@folio/stripes/components';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  boolAcceptedValuesOptions,
  getFieldName,
  getRepeatableAcceptedValuesPath,
  getSubfieldName,
  onAdd,
  onRemove,
} from '../../utils';
import { AcceptedValuesField } from '../../../../../components';

export const ItemDetails = ({
  contributors,
  productIdentifiers,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Accordion
      id="item-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.section`} />}
    >
      <Row left="xs">
        <Col xs={12}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.title`} />}
            name={getFieldName(18)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <Field
            component={TextArea}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.receivingNote`} />}
            name={getFieldName(19)}
          />
        </Col>
        <Col xs={4}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(20)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.mustAcknowledgeReceivingNote`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={boolAcceptedValuesOptions(formatMessage)}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <Field
            component={Datepicker}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.subscriptionFrom`} />}
            dateFormat="MM-DD-YYYY"
            name={getFieldName(21)}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={Datepicker}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.subscriptionTo`} />}
            dateFormat="MM-DD-YYYY"
            name={getFieldName(22)}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.subscriptionInterval`} />}
            name={getFieldName(23)}
            type="number"
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.publicationDate`} />}
            name={getFieldName(24)}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.publisher`} />}
            name={getFieldName(25)}
          />
        </Col>
        <Col xs={4}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.edition`} />}
            name={getFieldName(26)}
          />
        </Col>
      </Row>
      <RepeatableField
        fields={contributors}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.contributor.addLabel`} />}
        onAdd={() => onAdd(contributors, 'contributors', 27, initialFields, setReferenceTables, 'order')}
        onRemove={index => onRemove(index, contributors, 27, setReferenceTables, 'order')}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={6}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.contributor`} />}
                name={getSubfieldName(27, 0, index)}
              />
            </Col>
            <Col xs={6}>
              <AcceptedValuesField
                component={TextField}
                name={getSubfieldName(27, 1, index)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.contributorType`} />}
                optionValue="name"
                optionLabel="name"
                wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                wrapperSources={[{
                  wrapperSourceLink: '/contributor-types?limit=2000&query=cql.allRecords=1 sortby name',
                  wrapperSourcePath: 'contributorTypes',
                }]}
                setAcceptedValues={setReferenceTables}
                acceptedValuesPath={getRepeatableAcceptedValuesPath(27, 1, index)}
                okapi={okapi}
              />
            </Col>
          </Row>
        )}
      />
      <RepeatableField
        fields={productIdentifiers}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.productIdentifiers.addLabel`} />}
        onAdd={() => onAdd(productIdentifiers, 'contributors', 28, initialFields, setReferenceTables, 'order')}
        onRemove={index => onRemove(index, productIdentifiers, 28, setReferenceTables, 'order')}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={4}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.productId`} />}
                name={getSubfieldName(28, 0, index)}
              />
            </Col>
            <Col xs={4}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.qualifier`} />}
                name={getSubfieldName(28, 1, index)}
              />
            </Col>
            <Col xs={4}>
              <AcceptedValuesField
                component={TextField}
                name={getSubfieldName(28, 2, index)}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.productIdType`} />}
                optionValue="name"
                optionLabel="name"
                wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
                wrapperSources={[{
                  wrapperSourceLink: '/identifier-types?limit=1000&query=cql.allRecords=1 sortby name',
                  wrapperSourcePath: 'identifierTypes',
                }]}
                setAcceptedValues={setReferenceTables}
                acceptedValuesPath={getRepeatableAcceptedValuesPath(28, 2, index)}
                okapi={okapi}
              />
            </Col>
          </Row>
        )}
      />
      <Row left="xs">
        <Col xs={12}>
          <Field
            component={TextArea}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.itemDetails.field.internalNote`} />}
            name={getFieldName(29)}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ItemDetails.propTypes = {
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.object.isRequired,
  contributors: PropTypes.arrayOf(PropTypes.object),
  productIdentifiers: PropTypes.arrayOf(PropTypes.object),
};
