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

import { TRANSLATION_ID_PREFIX } from '../../constants';
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
      name: 'Instance, holdings, item',
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.instanceHoldings` }),
      name: 'Instance, holdings',
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.instance` }),
      name: 'Instance',
    }, {
      label: formatMessage({ id: `${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.none` }),
      name: 'None',
    },
  ];

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
            optionValue="name"
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
              wrapperSourceLink: '/material-types?limit=1000&query=cql.allRecords=1 sortby name',
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
        onAdd={() => onAdd(volumes, 'volumes', 67, initialFields, setReferenceTables, 'order')}
        onRemove={index => onRemove(index, volumes, 67, setReferenceTables, 'order')}
        renderField={(field, index) => (
          <Row left="xs">
            <Col xs={12}>
              <Field
                component={TextField}
                label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.physicalResourceDetails.field.volume`} />}
                name={getSubfieldName(67, 0, index)}
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
