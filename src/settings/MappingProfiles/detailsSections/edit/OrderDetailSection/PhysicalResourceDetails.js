import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  RepeatableField,
  TextField,
  Datepicker,
  Row,
  Col,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  FieldOrganization,
} from '../../../../../components';

import {
  CREATE_INVENTORY_TYPES,
  TRANSLATION_ID_PREFIX,
  WRAPPER_SOURCE_LINKS,
} from '../../constants';
import {
  getAcceptedValuesPath,
  getFieldName,
  getSubfieldName,
  onAdd,
  onRemove,
} from '../../utils';

export const PhysicalResourceDetails = ({
  volumes,
  materialSupplierId,
  initialFields,
  setReferenceTables,
  okapi,
}) => {
  const { formatMessage } = useIntl();

  const createInventoryOptions = [
    {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.instanceHoldingsItems` }),
      value: CREATE_INVENTORY_TYPES.INSTANCE_HOLDINGS_ITEM,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.instanceHoldings` }),
      value: CREATE_INVENTORY_TYPES.INSTANCE_HOLDINGS,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.instance` }),
      value: CREATE_INVENTORY_TYPES.INSTANCE,
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.none` }),
      value: CREATE_INVENTORY_TYPES.NONE,
    },
  ];

  const volumesFieldIndex = 67;

  return (
    <Accordion
      id="physical-resource-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.section`} />}
    >
      <Row left="xs">
        <Col xs={3}>
          <FieldOrganization
            id={materialSupplierId}
            setReferenceTables={setReferenceTables}
            name={getFieldName(62)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.materialSupplier`} />}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Datepicker}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.receiptDue`} />}
            name={getFieldName(63)}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Datepicker}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.expectedReceiptDate`} />}
            name={getFieldName(64)}
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(65)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.createInventory`} />}
            optionValue="value"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={createInventoryOptions}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={12}>
          <AcceptedValuesField
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.materialType`} />}
            name={getFieldName(66)}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: WRAPPER_SOURCE_LINKS.MATERIAL_TYPES,
              wrapperSourcePath: 'mtypes',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(66)}
            okapi={okapi}
          />
        </Col>
      </Row>
      <RepeatableField
        fields={volumes}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.volume.addLabel`} />}
        onAdd={() => onAdd(volumes, 'volumes', volumesFieldIndex, initialFields, setReferenceTables, 'order')}
        onRemove={index => onRemove(index, volumes, volumesFieldIndex, setReferenceTables, 'order')}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={12}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.volume`} />}
                name={getSubfieldName(volumesFieldIndex, 0, index)}
              />
            </Col>
          </Row>
        )}
      />
    </Accordion>
  );
};

PhysicalResourceDetails.propTypes = {
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.object.isRequired,
  volumes: PropTypes.arrayOf(PropTypes.object),
  materialSupplierId: PropTypes.string,
};

PhysicalResourceDetails.defaultProps = {
  volumes: [],
  materialSupplierId: null,
};
