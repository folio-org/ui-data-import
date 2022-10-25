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
  Checkbox,
  Datepicker,
} from '@folio/stripes/components';

import {
  AcceptedValuesField,
  FieldOrganization
} from '../../../../../components';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getAcceptedValuesPath,
  getBoolFieldName,
  getFieldName,
} from '../../utils';
import { BOOLEAN_ACTIONS } from '../../../../../utils';

export const EResourcesDetails = ({
  activationStatusCheckbox,
  trialCheckbox,
  accessProviderId,
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
      id="e-resources-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.section`} />}
    >
      <Row left="xs">
        <Col xs={3}>
          <FieldOrganization
            id={accessProviderId}
            setReferenceTables={setReferenceTables}
            name={getFieldName(68)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.accessProvider`} />}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.activationStatus`} />}
            name={getBoolFieldName(69)}
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={activationStatusCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
            type="checkbox"
            vertical
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Datepicker}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.activationDue`} />}
            name={getFieldName(70)}
          />
        </Col>
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            name={getFieldName(71)}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.createInventory`} />}
            optionValue="name"
            optionLabel="label"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            acceptedValuesList={createInventoryOptions}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col xs={3}>
          <AcceptedValuesField
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.materialType`} />}
            name={getFieldName(72)}
            optionValue="name"
            optionLabel="name"
            wrapperLabel={`${TRANSLATION_ID_PREFIX}.wrapper.acceptedValues`}
            wrapperSources={[{
              wrapperSourceLink: '/material-types?limit=1000&query=cql.allRecords=1 sortby name',
              wrapperSourcePath: 'mtypes',
            }]}
            setAcceptedValues={setReferenceTables}
            acceptedValuesPath={getAcceptedValuesPath(72)}
            okapi={okapi}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Checkbox}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.trial`} />}
            name={getBoolFieldName(73)}
            type="checkbox"
            parse={value => (value ? BOOLEAN_ACTIONS.ALL_TRUE : BOOLEAN_ACTIONS.ALL_FALSE)}
            checked={trialCheckbox === BOOLEAN_ACTIONS.ALL_TRUE}
            vertical
          />
        </Col>
        <Col xs={3}>
          <Field
            component={Datepicker}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.expectedActivation`} />}
            name={getFieldName(74)}
          />
        </Col>
        <Col xs={3}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.userLimit`} />}
            name={getFieldName(75)}
            type="number"
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Field
            component={TextField}
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.field.url`} />}
            name={getFieldName(76)}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

EResourcesDetails.propTypes = {
  setReferenceTables: PropTypes.func.isRequired,
  okapi: PropTypes.object.isRequired,
  activationStatusCheckbox: PropTypes.string,
  trialCheckbox: PropTypes.string,
  accessProviderId: PropTypes.string,
};
