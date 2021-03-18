import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  MultiColumnList,
} from '@folio/stripes/components';

import { ProhibitionIcon } from '../../../../../components';

import {
  getContentData,
  getFieldValue,
  transformSubfieldsData,
  getBooleanLabelId,
  getUnmappableValueById,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

import css from '../../../MappingProfiles.css';

export const Contributor = ({ mappingDetails }) => {
  const prohibitionIconElement = fieldName => <ProhibitionIcon fieldName={fieldName} />;

  const contributors = getFieldValue(mappingDetails, 'contributors', 'subfields');

  const contributorsVisibleColumns = ['contributorName', 'contributorNameTypeId', 'contributorTypeId',
    'contributorTypeText', 'primary'];
  const contributorsMapping = {
    contributorName: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.field.contributorName`} />
    ),
    contributorNameTypeId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.field.contributorNameTypeId`} />
    ),
    contributorTypeId: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.field.contributorTypeId`} />
    ),
    contributorTypeText: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.field.contributorTypeText`} />
    ),
    primary: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.field.primary`} />
    ),
  };
  const contributorsFormatter = {
    contributorName: x => x?.contributorName || prohibitionIconElement(`contributor-name-${x.rowIndex}`),
    contributorNameTypeId: x => x?.contributorNameTypeId || prohibitionIconElement(`contributor-name-type-id-${x.rowIndex}`),
    contributorTypeId: x => x?.contributorTypeId || prohibitionIconElement(`contributor-type-id-${x.rowIndex}`),
    contributorTypeText: x => x?.contributorTypeText || prohibitionIconElement(`contributor-type-text-${x.rowIndex}`),
    primary: x => {
      const primaryLabelId = getBooleanLabelId(x?.primary);

      return getUnmappableValueById(primaryLabelId, 'contributor-primary');
    },
  };
  const contributorsFieldsMap = [
    {
      field: 'contributorName',
      key: 'value',
    }, {
      field: 'contributorNameTypeId',
      key: 'value',
    }, {
      field: 'contributorTypeId',
      key: 'value',
    },
  ];
  const contributorsData = transformSubfieldsData(contributors, contributorsFieldsMap);

  return (
    <Accordion
      id="view-contributors"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-contributors
          xs={12}
          className={css.colWithTable}
        >
          <MultiColumnList
            columnIdPrefix="contributors"
            contentData={getContentData(contributorsData)}
            visibleColumns={contributorsVisibleColumns}
            columnMapping={contributorsMapping}
            formatter={contributorsFormatter}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Contributor.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
