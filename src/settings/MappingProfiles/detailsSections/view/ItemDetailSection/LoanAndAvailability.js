import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  Row,
  Col,
  NoValue,
  KeyValue,
} from '@folio/stripes/components';

import { ViewRepeatableField } from '../ViewRepeatableField';

import {
  getBooleanLabelId,
  getFieldValue,
  getValueById,
  transformSubfieldsData,
} from '../../utils';
import { TRANSLATION_ID_PREFIX } from '../../constants';
import { mappingProfileFieldShape } from '../../../../../utils';

export const LoanAndAvailability = ({ mappingDetails }) => {
  const noValueElement = <NoValue />;

  const permanentLoanType = getFieldValue(mappingDetails, 'permanentLoanType.id', 'value');
  const temporaryLoanType = getFieldValue(mappingDetails, 'temporaryLoanType.id', 'value');
  const status = getFieldValue(mappingDetails, 'status.name', 'value');
  const circulationNotes = getFieldValue(mappingDetails, 'circulationNotes', 'subfields');
  const circulationNotesRepeatableAction = getFieldValue(mappingDetails,
    'circulationNotes', 'repeatableFieldAction');

  const circulationNotesVisibleColumns = ['noteType', 'note', 'staffOnly'];
  const circulationNotesMapping = {
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
  const circulationNotesFormatter = {
    noteType: x => x?.noteType || noValueElement,
    note: x => x?.note || noValueElement,
    staffOnly: x => {
      const staffOnlyLabelId = getBooleanLabelId(x?.staffOnly);

      return getValueById(staffOnlyLabelId);
    },
  };
  const circulationNotesFieldsMap = [
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
  const circulationNotesData = transformSubfieldsData(circulationNotes, circulationNotesFieldsMap);

  return (
    <Accordion
      id="item-loans"
      label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemLoans.section`} />}
    >
      <Row left="xs">
        <Col
          data-test-permanent-loan-type
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemLoans.field.loanTypePermanentRequired`} />}
            value={permanentLoanType || noValueElement}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-temporary-loan-type
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemLoans.field.loanTypeTemporary`} />}
            value={temporaryLoanType || noValueElement}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-status
          xs={6}
        >
          <KeyValue
            label={<FormattedMessage id={`${TRANSLATION_ID_PREFIX}.item.itemLoans.field.loanStatus`} />}
            value={status || noValueElement}
          />
        </Col>
      </Row>
      <Row left="xs">
        <Col
          data-test-circulation-notes
          id="section-circulation-notes"
          xs={12}
        >
          <ViewRepeatableField
            repeatableAction={circulationNotesRepeatableAction}
            fieldData={circulationNotesData}
            visibleColumns={circulationNotesVisibleColumns}
            columnMapping={circulationNotesMapping}
            formatter={circulationNotesFormatter}
            labelId={`${TRANSLATION_ID_PREFIX}.item.field.circulationNotes.legend`}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

LoanAndAvailability.propTypes = { mappingDetails: PropTypes.arrayOf(mappingProfileFieldShape).isRequired };
