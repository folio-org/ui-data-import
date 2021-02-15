import React from 'react';
import PropTypes from 'prop-types';
import {
  useIntl,
  FormattedMessage,
} from 'react-intl';
import { Field } from 'redux-form';

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
  getFundDistributionFieldsPath,
  getInnerSubfieldName,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  createOptionsList,
  mappingProfileSubfieldShape,
  okapiShape,
  INOVOICE_ADJUSTMENTS_RELATION_TO_TOTAL_OPTIONS,
} from '../../../../../utils';

export const InvoiceLineAdjustments = ({
  lineAdjustments,
  currency,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  const { formatMessage } = useIntl();

  const relationToTotalList = createOptionsList(INOVOICE_ADJUSTMENTS_RELATION_TO_TOTAL_OPTIONS, formatMessage);

  const getActualPath = function (currentIndex) {
    getFundDistributionFieldsPath(currentIndex, 0, 14);
  };

  const renderLineAdjustment = (field, index) => {
    const trashButton = (
      <IconButton
        data-test-repeatable-field-remove-item-button
        icon="trash"
        onClick={() => onRemove(index, lineAdjustments, 14, setReferenceTables, 'order', getActualPath)}
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
              name={getInnerSubfieldName(26, 0, 14, 0, index)}
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
            onAdd={() => onAdd(lineAdjustments, 'lineAdjustments', 26, initialFields, setReferenceTables, 'order', getActualPath)}
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
  currency: PropTypes.string,
};

InvoiceLineAdjustments.defaultProps = { currency: '' };
