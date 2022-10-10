import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  NoValue,
} from '@folio/stripes/components';

import { ViewRepeatableField } from '../ViewRepeatableField';

import {
  getFieldValue,
  transformSubfieldsData,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const Location = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const locations = getFieldValue(mappingDetails, 'locations', 'subfields');

  const locationsVisibleColumns = ['locationId', 'quantityPhysical', 'quantityElectronic'];

  const locationsMapping = {
    locationId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.locationId`} />
    ),
    quantityPhysical: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.quantityPhysical`} />
    ),
    quantityElectronic: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.location.quantityElectronic`} />
    ),
  };

  const locationsFormatter = {
    locationId: x => x?.locationId || noValueElement,
    quantityPhysical: x => x?.quantityPhysical || noValueElement,
    quantityElectronic: x => x?.quantityElectronic || noValueElement,
  };

  const locationsFieldsMap = [
    {
      field: 'locationId',
      key: 'value',
    }, {
      field: 'quantityPhysical',
      key: 'value',
    }, {
      field: 'quantityElectronic',
      key: 'value',
    }
  ];

  const locationsData = transformSubfieldsData(locations, locationsFieldsMap);

  return (
    <Accordion
      id="view-order-location"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.location.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-locations
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="locations"
            fieldData={locationsData}
            visibleColumns={locationsVisibleColumns}
            columnMapping={locationsMapping}
            formatter={locationsFormatter}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Location.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
