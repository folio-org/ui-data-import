import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';

import {
  getContentData,
  getFieldValue,
  transformSubfieldsData,
  getBooleanLabelId,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

import css from '../../../MappingProfiles.css';

export const HoldingsNotes = ({ mappingDetails }) => {
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
    noteType: x => x?.noteType || <NoValue />,
    note: x => x?.note || <NoValue />,
    staffOnly: x => {
      const staffOnlyLabelId = getBooleanLabelId(x?.staffOnly);

      return staffOnlyLabelId ? <FormattedMessage id={staffOnlyLabelId} /> : <NoValue />;
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
      id="holdings-notes"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.holdingsNotes.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-notes
          id="section-holding-statements"
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

HoldingsNotes.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape) };
