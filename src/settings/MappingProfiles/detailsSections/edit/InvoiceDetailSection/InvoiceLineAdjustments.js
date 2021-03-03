import React from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import { Field } from 'redux-form';
import { noop } from 'lodash';

import {
  Accordion,
  Row,
  Col,
  Card,
  IconButton,
  RepeatableField,
  TextField,
  Checkbox,
} from '@folio/stripes/components';
import { TypeToggle } from '@folio/stripes-acq-components';

import { AcceptedValuesField } from '../../../../../components';

import {
  onAdd,
  onRemove,
  getSubfieldName,
  getInnerSubfieldsPath,
  getInnerSubfieldName,
  getInnerRepeatableFieldPath,
  getInnerBooleanFieldPath,
  handleRepeatableFieldAndActionAdd,
  handleRepeatableFieldAndActionClean,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  createOptionsList,
  mappingProfileSubfieldShape,
  okapiShape,
  INOVOICE_ADJUSTMENTS_RELATION_TO_TOTAL_OPTIONS,
  BOOLEAN_ACTIONS,
} from '../../../../../utils';

export const InvoiceLineAdjustments = ({
  lineAdjustments,
  currency,
  initialFields,
  mappingFields,
  setReferenceTables,
  okapi,
}) => {
  const { formatMessage } = useIntl();

  const relationToTotalList = createOptionsList(INOVOICE_ADJUSTMENTS_RELATION_TO_TOTAL_OPTIONS, formatMessage);

  const getPathToAddField = currentIndex => getInnerSubfieldsPath(currentIndex, 0, 15);
  const getPathToClearRepeatableAction = currentIndex => getSubfieldName(currentIndex, 15, 0);

  const onAdjustmentAdd = (fieldsPath, refTable, fieldIndex, isFirstSubfield) => {
    const repeatableFieldActionPath = getInnerRepeatableFieldPath(fieldIndex, 0, 15);

    handleRepeatableFieldAndActionAdd(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isFirstSubfield);
  };
  const onAdjustmentsClean = (fieldsPath, refTable, fieldIndex, isLastSubfield) => {
    const repeatableFieldActionPath = getInnerRepeatableFieldPath(fieldIndex, 0, 15);

    handleRepeatableFieldAndActionClean(repeatableFieldActionPath, fieldsPath, refTable, setReferenceTables, isLastSubfield);
  };

  const renderLineAdjustment = (field, index) => {
    const trashButton = (
      <IconButton
        data-test-repeatable-field-remove-item-button
        icon="trash"
        onClick={() => onRemove(index, lineAdjustments, 26, onAdjustmentsClean, 'order', getPathToAddField, getPathToClearRepeatableAction)}
        size="medium"
        ariaLabel={formatMessage({ id: 'stripes-components.deleteThisItem' })}
      />
    );

    const headerTitle = (
      <FormattedMessage
        id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.sectionTitle`}
        values={{ index: index + 1 }}
      />
    );

    const exportToAccountingCheckbox = mappingFields?.[26].subfields[0].fields[15].subfields[index].fields[4].booleanFieldAction;

    return (
      <Card
        headerEnd={trashButton}
        headerStart={headerTitle}
      >
        <Row left="xs">
          <Col xs={3}>
            <Field
              component={TextField}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.description`} />}
              name={getInnerSubfieldName(26, 0, 15, 0, index)}
            />
          </Col>
          <Col xs={2}>
            <Field
              component={TextField}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.amount`} />}
              name={getInnerSubfieldName(26, 0, 15, 1, index)}
            />
          </Col>
          <Col xs={2}>
            <Field
              component={TypeToggle}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.type`} />}
              name={getInnerSubfieldName(26, 0, 15, 2, index)}
              currency={currency}
            />
          </Col>
          <Col xs={3}>
            <AcceptedValuesField
              component={TextField}
              name={getInnerSubfieldName(26, 0, 15, 3, index)}
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.relationToTotal`} />}
              optionValue="value"
              optionLabel="label"
              isRemoveValueAllowed
              wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
              acceptedValuesList={relationToTotalList}
              validation={noop}
              okapi={okapi}
            />
          </Col>
          <Col xs={2}>
            <Field
              component={Checkbox}
              vertical
              label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.field.exportToAccounting`} />}
              name={getInnerBooleanFieldPath(26, 0, 15, 4, index)}
              parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
              checked={exportToAccountingCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
            />
          </Col>
        </Row>
      </Card>
    );
  };

  return (
    <Accordion
      id="invoice-line-adjustments"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceLineAdjustments.section`} />}
    >
      <Row left="xs">
        <Col
          xs={12}
        >
          <RepeatableField
            fields={lineAdjustments}
            addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.invoice.invoiceAdjustments.adjustments.addLabel`} />}
            onAdd={() => onAdd(lineAdjustments, 'invoiceLines.fields[15].subfields[0]', 26, initialFields, onAdjustmentAdd, 'order', getPathToAddField)}
            onRemove={null}
            renderField={renderLineAdjustment}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InvoiceLineAdjustments.propTypes = {
  lineAdjustments: PropTypes.arrayOf(mappingProfileSubfieldShape).isRequired,
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: okapiShape.isRequired,
  mappingFields: PropTypes.arrayOf(PropTypes.object),
  currency: PropTypes.string,
};

InvoiceLineAdjustments.defaultProps = { currency: '' };
