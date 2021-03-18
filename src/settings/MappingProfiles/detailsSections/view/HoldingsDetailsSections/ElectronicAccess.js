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

export const ElectronicAccess = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const electronicAccess = getFieldValue(mappingDetails, 'electronicAccess', 'subfields');
  const electronicAccessRepeatableAction = getFieldValue(mappingDetails,
    'electronicAccess', 'repeatableFieldAction');

  const electronicAccessVisibleColumns = ['relationshipId', 'uri', 'linkText', 'materialsSpecification', 'publicNote'];
  const electronicAccessMapping = {
    relationshipId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.relationship`} />
    ),
    uri: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.uri`} />
    ),
    linkText: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.linkText`} />
    ),
    materialsSpecification: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.materialsSpecified`} />
    ),
    publicNote: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.field.urlPublicNote`} />
    ),
  };
  const electronicAccessFormatter = {
    relationshipId: x => x?.relationshipId || noValueElement,
    uri: x => x?.uri || noValueElement,
    linkText: x => x?.linkText || noValueElement,
    materialsSpecification: x => x?.materialsSpecification || noValueElement,
    publicNote: x => x?.publicNote || noValueElement,
  };
  const electronicAccessFieldsMap = [
    {
      field: 'relationshipId',
      key: 'value',
    }, {
      field: 'uri',
      key: 'value',
    }, {
      field: 'linkText',
      key: 'value',
    }, {
      field: 'materialsSpecification',
      key: 'value',
    }, {
      field: 'publicNote',
      key: 'value',
    },
  ];
  const electronicAccessData = transformSubfieldsData(electronicAccess, electronicAccessFieldsMap);

  return (
    <Accordion
      id="view-holdings-electronic-access"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.EAccess.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-electronic-access
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="electronic-access"
            repeatableAction={electronicAccessRepeatableAction}
            fieldData={electronicAccessData}
            visibleColumns={electronicAccessVisibleColumns}
            columnMapping={electronicAccessMapping}
            formatter={electronicAccessFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.EAccess.section`}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ElectronicAccess.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
