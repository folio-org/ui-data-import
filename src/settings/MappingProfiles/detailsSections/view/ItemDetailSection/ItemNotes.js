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
  getBooleanLabelId,
  getContentData,
  getFieldValue,
  getValueById,
  transformSubfieldsData,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const ItemNotes = ({ mappingDetails }) => {
  const notes = getFieldValue(mappingDetails, 'notes', 'subfields');

  const notesVisibleColumns = ['itemNoteTypeId', 'note', 'staffOnly'];
  const notesMapping = {
    itemNoteTypeId: (
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
    itemNoteTypeId: x => x?.itemNoteTypeId || <NoValue />,
    note: x => x?.note || <NoValue />,
    staffOnly: x => {
      const staffOnlyLabelId = getBooleanLabelId(x?.staffOnly);

      return getValueById(staffOnlyLabelId);
    },
  };
  const notesFieldsMap = [
    {
      field: 'itemNoteTypeId',
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
      id="item-notes"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemNotes.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-item-notes
          id="section-item-notes"
          xs={12}
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

ItemNotes.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
