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

export const InstanceNotes = ({ mappingDetails }) => {
  const notes = getFieldValue(mappingDetails, 'notes', 'subfields');

  const notesVisibleColumns = ['noteType', 'note', 'staffOnly'];
  const notesMapping = {
    noteType: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.noteType`} />
    ),
    note: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.note`} />
    ),
    staffOnly: (
      <FormattedMessage id={`${TRANSLATION_ID_PREFIX}.field.notes.staffOnly`} />
    ),
  };
  const notesFormatter = {
    noteType: x => x?.noteType || <ProhibitionIcon />,
    note: x => x?.note || <ProhibitionIcon />,
    staffOnly: x => {
      const staffOnlyLabelId = getBooleanLabelId(x?.staffOnly);

      return getUnmappableValueById(staffOnlyLabelId);
    },
  };
  const notesFieldsMap = [
    {
      field: 'noteType',
      key: 'value',
    }, {
      field: 'note',
      key: 'value',
    }, {
      field: 'staffOnly',
      key: 'booleanFieldAction',
    },
  ];
  const notesData = transformSubfieldsData(notes, notesFieldsMap);

  return (
    <Accordion
      id="instance-notes"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.instance.instanceNotes.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-notes
          xs={12}
          className={css.colWithTable}
        >
          <MultiColumnList
            contentData={getContentData(notesData)}
            visibleColumns={notesVisibleColumns}
            columnMapping={notesMapping}
            formatter={notesFormatter}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

InstanceNotes.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
