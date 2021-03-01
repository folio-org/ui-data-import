import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

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
import {
  ITEM_CIRCULATION_NOTES_OPTIONS,
  mappingProfileFieldShape,
} from '../../../../../utils';

export const LoanAndAvailability = ({ mappingDetails }) => {
  const { formatMessage } = useIntl();

  const noValueElement = <NoValue />;

  const permanentLoanType = getFieldValue(mappingDetails, 'permanentLoanType.id', 'value');
  const temporaryLoanType = getFieldValue(mappingDetails, 'temporaryLoanType.id', 'value');
  const status = getFieldValue(mappingDetails, 'status.name', 'value');

  const circulationNotesMap = ITEM_CIRCULATION_NOTES_OPTIONS.reduce((obj, item) => {
    const key = `"${item.value}"`;
    const value = formatMessage({ id: item.label });

    return Object.assign(obj, { [key]: `"${value}"` });
  }, {});
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
    noteType: x => {
      if (x?.noteType) {
        return circulationNotesMap[x.noteType] || x.noteType;
      }

      return noValueElement;
    },
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
            value={permanentLoanType}
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
            value={temporaryLoanType}
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
            value={status}
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
