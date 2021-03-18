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
  getBooleanLabelId,
  getValueById,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const HoldingsNotes = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const notes = getFieldValue(mappingDetails, 'notes', 'subfields');
  const notesRepeatableAction = getFieldValue(mappingDetails, 'notes', 'repeatableFieldAction');

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
    noteType: x => x?.noteType || noValueElement,
    note: x => x?.note || noValueElement,
    staffOnly: x => {
      const staffOnlyLabelId = getBooleanLabelId(x?.staffOnly);

      return getValueById(staffOnlyLabelId);
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
      id="view-holdings-notes"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.holdings.holdingsNotes.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-notes
          xs={12}
        >
          <ViewRepeatableField
            columnIdPrefix="holding-notes"
            repeatableAction={notesRepeatableAction}
            fieldData={notesData}
            visibleColumns={notesVisibleColumns}
            columnMapping={notesMapping}
            formatter={notesFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.holdings.holdingsNotes.section`}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

HoldingsNotes.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
