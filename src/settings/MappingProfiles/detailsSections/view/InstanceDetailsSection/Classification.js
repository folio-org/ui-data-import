import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  MultiColumnList,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components/ProhibitionIcon';

import {
  transformSubfieldsData,
  getContentData,
  getFieldValue,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const Classification = ({ mappingDetails }) => {
  const prohibitionIconElement = fieldName => <ProhibitionIcon fieldName={fieldName} />;

  const classifications = getFieldValue(mappingDetails, 'classifications', 'subfields');

  const classificationsVisibleColumns = ['classificationTypeId', 'classificationNumber'];
  const classificationsMapping = {
    classificationTypeId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.classificationTypeId`} />
    ),
    classificationNumber: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.classificationNumber`} />
    ),
  };
  const classificationsFormatter = {
    classificationTypeId: x => x?.classificationTypeId || prohibitionIconElement(`classification-type-id-${x.rowIndex}`),
    classificationNumber: x => x?.classificationNumber || prohibitionIconElement(`classification-number-${x.rowIndex}`),
  };
  const classificationsFieldsMap = [
    {
      field: 'classificationTypeId',
      key: 'value',
    }, {
      field: 'classificationNumber',
      key: 'value',
    },
  ];
  const classificationsData = transformSubfieldsData(classifications, classificationsFieldsMap);

  return (
    <Accordion
      id="view-classification"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.classifications.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-classifications
          xs={12}
        >
          <MultiColumnList
            columnIdPrefix="classifications"
            contentData={getContentData(classificationsData)}
            visibleColumns={classificationsVisibleColumns}
            columnMapping={classificationsMapping}
            formatter={classificationsFormatter}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Classification.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
