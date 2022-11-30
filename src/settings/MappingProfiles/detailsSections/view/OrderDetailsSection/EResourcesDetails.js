import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Col,
  Row,
  KeyValue,
} from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getFieldValue,
  getFieldValueByPath,
  renderCheckbox,
} from '../../utils';
import { mappingProfileFieldShape } from '../../../../../utils';

const EResourcesDetails = ({
  mappingDetails,
  accessProviderId,
  mutator,
}) => {
  const [selectedOrganization, setSelectedOrganization] = useState({});
  const accessProviderValue = selectedOrganization?.name;

  useEffect(() => {
    if (accessProviderId && selectedOrganization.id !== accessProviderId) {
      mutator.fieldOrganizationOrg.GET()
        .then(setSelectedOrganization);
    } else {
      setSelectedOrganization({});
    }
  }, [accessProviderId]); // eslint-disable-line react-hooks/exhaustive-deps

  const activated = getFieldValue(mappingDetails, 'activationStatus', 'booleanFieldAction');
  const activationDue = getFieldValue(mappingDetails, 'activationDue', 'value');
  const createInventory = getFieldValueByPath(mappingDetails, 'order.poLine.eresource.createInventory', 'value');
  const materialType = getFieldValueByPath(mappingDetails, 'order.poLine.eresource.materialType', 'value');
  const trial = getFieldValue(mappingDetails, 'trial', 'booleanFieldAction');
  const expectedActivation = getFieldValue(mappingDetails, 'expectedActivation', 'value');
  const userLimit = getFieldValue(mappingDetails, 'userLimit', 'value');
  const resourceUrl = getFieldValue(mappingDetails, 'resourceUrl', 'value');

  const activatedCheckbox = renderCheckbox('order.eResourcesDetails.activated', activated);
  const trialCheckbox = renderCheckbox('order.eResourcesDetails.trial', trial);

  return (
    <Accordion
      id="view-e-resources-details"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-access-provider
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.accessProvider`} />}
            value={accessProviderValue}
          />
        </Col>
        <Col
          data-test-activated
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.activated`} />}
            value={activatedCheckbox}
          />
        </Col>
        <Col
          data-test-activation-due
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.activationDue`} />}
            value={activationDue}
          />
        </Col>
        <Col
          data-test-create-e-inventory
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.createInventory`} />}
            value={createInventory}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-material-type
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.materialType`} />}
            value={materialType}
          />
        </Col>
        <Col
          data-test-trial
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.trial`} />}
            value={trialCheckbox}
          />
        </Col>
        <Col
          data-test-expected-activation
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.expectedActivation`} />}
            value={expectedActivation}
          />
        </Col>
        <Col
          data-test-user-limit
          xs={3}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.userLimit`} />}
            value={userLimit}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-url
          xs={12}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.eResourcesDetails.resourceUrl`} />}
            value={resourceUrl}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

EResourcesDetails.propTypes = {
  mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired,
  mutator: PropTypes.object.isRequired,
  accessProviderId: PropTypes.string,
};

EResourcesDetails.manifest = Object.freeze({
  fieldOrganizationOrg: {
    type: 'okapi',
    path: 'organizations/organizations/!{accessProviderId}',
    throwErrors: false,
    accumulate: true,
    fetch: false,
  },
});

export default stripesConnect(EResourcesDetails);
