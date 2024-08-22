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
import { useDonorsQuery } from '../../../../../hooks';

import {
  getFieldValue,
  getMatchByUuidInQuotes,
  transformSubfieldsData,
} from '../../utils';
import {
  DONORS_FIELD,
  mappingProfileFieldShape,
} from '../../../../../utils';
import {
  TRANSLATION_ID_PREFIX,
  DONOR_INFORMATION_VISIBLE_COLUMNS,
} from '../../constants';

export const DonorInformation = ({ mappingDetails }) => {
  const { data } = useDonorsQuery();

  const { DONOR } = DONOR_INFORMATION_VISIBLE_COLUMNS;

  const noValueElement = <NoValue />;

  const donors = getFieldValue(mappingDetails, DONORS_FIELD, 'subfields');

  const donorsVisibleColumns = [DONOR];

  const donorsMapping = {
    [DONOR]: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.donorInformation.donor`} />
    ),
  };

  const donorsFormatter = { [DONOR]: donor => {
    const value = donor?.donorOrganizationIds;

    if (value) {
      const orgId = getMatchByUuidInQuotes(value);
      const organizationNameFromResponse = data?.find(item => item.id === orgId)?.name;

      return organizationNameFromResponse ? value.replace(orgId, organizationNameFromResponse) : value;
    }

    return noValueElement;
  } };

  const donorsFieldsMap = [
    {
      field: DONORS_FIELD,
      key: 'value',
    }
  ];

  const donorsData = transformSubfieldsData(donors, donorsFieldsMap);

  return (
    <Accordion
      id="view-order-donors"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.donorInformation.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-locations
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="donors"
            fieldData={donorsData}
            visibleColumns={donorsVisibleColumns}
            columnMapping={donorsMapping}
            formatter={donorsFormatter}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

DonorInformation.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
