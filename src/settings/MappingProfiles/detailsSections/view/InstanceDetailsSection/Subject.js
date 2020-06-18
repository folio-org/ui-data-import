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

export const Subject = ({ mappingDetails }) => {
  const subjects = getFieldValue(mappingDetails, 'subjects', 'subfields');

  const subjectsVisibleColumns = ['subject'];
  const subjectsMapping = {
    subject: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.descriptiveData.field.subjects`} />
    ),
  };
  const subjectsFormatter = { subject: x => x?.noteType || <ProhibitionIcon /> };
  const subjectsData = transformSubfieldsData(subjects, subjectsVisibleColumns);

  return (
    <Accordion
      id="subjects"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.subject.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-subjects
          xs={12}
        >
          <MultiColumnList
            contentData={getContentData(subjectsData)}
            visibleColumns={subjectsVisibleColumns}
            columnMapping={subjectsMapping}
            formatter={subjectsFormatter}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

Subject.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape) };
