import React, {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  RepeatableField,
  Row,
  Col,
} from '@folio/stripes/components';

import {
  FieldDonor,
  WithValidation,
} from '../../../../../components';
import { useFieldMappingRefValues } from '../../hooks';
import { useDonorsQuery } from '../../../../../hooks';

import { TRANSLATION_ID_PREFIX } from '../../constants';
import {
  getSubfieldName,
  onAdd,
  onRemove,
} from '../../utils';
import { DONORS_FIELD } from '../../../../../utils';

export const DonorInformation = ({
  initialFields,
  setReferenceTables,
}) => {
  const DONORS_INDEX = 44;
  const DONOR_INFORMATION_MAP = {
    DONOR_NAME: index => getSubfieldName(DONORS_INDEX, 0, index),
  };

  const [donors] = useFieldMappingRefValues([DONORS_FIELD]);
  const { data: allDonorsList } = useDonorsQuery();


  const handleDonorsAdd = useCallback(
    () => onAdd(donors, 'donorOrganizationIds', DONORS_INDEX, initialFields, setReferenceTables, 'order'),
    [DONORS_INDEX, initialFields, setReferenceTables, donors],
  );

  const handleDonorsClean = useCallback(
    index => onRemove(index, donors, DONORS_INDEX, setReferenceTables, 'order'),
    [DONORS_INDEX, setReferenceTables, donors],
  );

  return (
    <Accordion
      id="location"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.donorInformation.section`} />}
    >
      <RepeatableField
        fields={donors}
        addLabel={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.donorInformation.field.donors.addLabel`} />}
        onAdd={handleDonorsAdd}
        onRemove={handleDonorsClean}
        renderField={(field, index) => {
          return (
            <Row left="xs">
              <Col xs={12}>
                <WithValidation>
                  {validation => (
                    <FieldDonor
                      inputValue={field.fields[0].value}
                      name={DONOR_INFORMATION_MAP.DONOR_NAME(index)}
                      allDonors={allDonorsList}
                      setReferenceTables={setReferenceTables}
                      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.order.poLineDetails.field.donor`} />}
                      validate={[validation]}
                    />
                  )}
                </WithValidation>
              </Col>
            </Row>
          );
        }}
      />
    </Accordion>
  );
};

DonorInformation.propTypes = {
  initialFields: PropTypes.object.isRequired,
  setReferenceTables: PropTypes.func.isRequired,
};
