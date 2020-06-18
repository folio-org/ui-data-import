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
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

import css from '../../../MappingProfiles.css';

export const Contributor = ({ mappingDetails }) => {
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
    contributorName: x => x?.contributorName || <ProhibitionIcon />,
    contributorNameTypeId: x => x?.contributorNameTypeId || <ProhibitionIcon />,
    contributorTypeId: x => x?.contributorTypeId || <ProhibitionIcon />,
    contributorTypeText: x => x?.contributorTypeText || <ProhibitionIcon />,
    primary: x => {
      const primaryLabelId = getBooleanLabelId(x?.primary);

      return primaryLabelId ? <FormattedMessage id={primaryLabelId} /> : <ProhibitionIcon />;
    },
  };
  const contributorsData = transformSubfieldsData(contributors, contributorsVisibleColumns);

  return (
    <Accordion
      id="contributors"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.contributors.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-contributors
          xs={12}
          className={css.colWithTable}
        >
          <MultiColumnList
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

Contributor.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape) };
