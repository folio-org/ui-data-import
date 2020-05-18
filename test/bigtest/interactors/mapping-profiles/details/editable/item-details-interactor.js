// eslint-disable-next-line max-classes-per-file
import {
  AccordionInteractor,
  AccordionSetInteractor,
} from '@folio/stripes-components/lib/Accordion/tests/interactor';
import ExpandAllButtonInteractor from '@folio/stripes-components/lib/Accordion/tests/expand-all-button-interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import RepeatableFieldInteractor from '@folio/stripes-components/lib/RepeatableField/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import DropdownInteractor from '@folio/stripes-components/lib/Dropdown/tests/interactor';
import DatepickerInteractor from '@folio/stripes-components/lib/Datepicker/tests/interactor';

import { InputInteractor } from '../../../input-interactor';
import { MappedHeaderInteractor } from '../../../mapped-header-interactor';

class AdministrativeDataAccordion extends AccordionInteractor {
  suppressFromDiscovery = new SelectInteractor('#mapping-profiles-form [data-test-suppress-from-discovery]');
  itemHRID = new InputInteractor('#mapping-profiles-form [data-test-item-hrid]');
  barcode = new TextFieldInteractor('#mapping-profiles-form [data-test-barcode]');
  accessionNumber = new TextFieldInteractor('#mapping-profiles-form [data-test-accession-number]');
  itemIdentifier = new TextFieldInteractor('#mapping-profiles-form [data-test-item-identifier]');
  formerIds = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-former-ids]');
  formerIdsRepeatable = new SelectInteractor('#mapping-profiles-form #section-former-ids [data-test-repeatable-decorator]');
  statisticalCodes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-statistical-codes]');
  statisticalCode = new TextFieldInteractor('#mapping-profiles-form [data-test-statistical-code]');
  statisticalCodeRepeatable = new SelectInteractor('#mapping-profiles-form #section-statistical-code-ids [data-test-repeatable-decorator]');
  statisticalCodeAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-statistical-code] [data-test-accepted-values-list]');
}

class ItemDataAccordion extends AccordionInteractor {
  materialType = new TextFieldInteractor('#mapping-profiles-form [data-test-material-type]');
  materialTypeAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-material-type] [data-test-accepted-values-list]');
  copyNumber = new TextFieldInteractor('#mapping-profiles-form [data-test-copy-number]');
  callNumberType = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number-type]');
  callNumberTypeAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-call-number-type] [data-test-accepted-values-list]');
  callNumberPrefix = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number-prefix]');
  callNumber = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number]');
  callNumberSuffix = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number-suffix]');
  numberOfPieces = new TextFieldInteractor('#mapping-profiles-form [data-test-number-of-pieces]');
  descriptionOfPieces = new TextFieldInteractor('#mapping-profiles-form [data-test-description-of-pieces]');
}

class EnumerationDataAccordion extends AccordionInteractor {
  enumeration = new TextFieldInteractor('#mapping-profiles-form [data-test-enumeration]');
  chronology = new TextFieldInteractor('#mapping-profiles-form [data-test-chronology]');
  volume = new TextFieldInteractor('#mapping-profiles-form [data-test-volume]');
  yearsAndCaptions = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-years-and-captions]');
  yearsAndCaptionsRepeatable = new SelectInteractor('#mapping-profiles-form #section-year-caption [data-test-repeatable-decorator]');
}

class ConditionAccordion extends AccordionInteractor {
  missingPiecesNumber = new TextFieldInteractor('#mapping-profiles-form [data-test-missing-pieces-number]');
  missingPieces = new TextFieldInteractor('#mapping-profiles-form [data-test-missing-pieces]');
  date = new TextFieldInteractor('#mapping-profiles-form [data-test-date]');
  dateAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-date] [data-test-accepted-values-list]');
  missingPiecesDate = new DatepickerInteractor('#mapping-profiles-form [data-test-date] [data-test-date-picker]');
  itemDamagedStatus = new TextFieldInteractor('#mapping-profiles-form [data-test-item-damaged-status]');
  itemDamagedStatusAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-item-damaged-status] [data-test-accepted-values-list]');
  date2 = new TextFieldInteractor('#mapping-profiles-form [data-test-date2]');
  date2AcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-date2] [data-test-accepted-values-list]');
  itemDamagedStatusDate = new DatepickerInteractor('#mapping-profiles-form [data-test-date2] [data-test-date-picker]');
}

class ItemNotesAccordion extends AccordionInteractor {
  staffOnly = new SelectInteractor('#mapping-profiles-form [data-test-staff-only]');
  notes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-item-notes]');
  notesRepeatable = new SelectInteractor('#mapping-profiles-form #section-item-notes [data-test-repeatable-decorator]');
  note = new TextFieldInteractor('#mapping-profiles-form [data-test-item-note]');
  noteAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-item-note] [data-test-accepted-values-list]');
}

class LoanAndAvailabilityAccordion extends AccordionInteractor {
  permanentLoanType = new TextFieldInteractor('#mapping-profiles-form [data-test-permanent-loan-type]');
  permanentLoanTypeAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-permanent-loan-type] [data-test-accepted-values-list]');
  temporaryLoanType = new TextFieldInteractor('#mapping-profiles-form [data-test-temporary-loan-type]');
  temporaryLoanTypeAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-temporary-loan-type] [data-test-accepted-values-list]');
  status = new TextFieldInteractor('#mapping-profiles-form [data-test-status]');
  statusAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-status] [data-test-accepted-values-list]');
  circulationNotes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-circulation-notes]');
  circulationNotesRepeatable = new SelectInteractor('#mapping-profiles-form #section-circulation-notes [data-test-repeatable-decorator]');
  circulationNote = new TextFieldInteractor('#mapping-profiles-form [data-test-circulation-note]');
  circulationNoteAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-circulation-note] [data-test-accepted-values-list]');
}

class LocationAccordion extends AccordionInteractor {
  staffOnly = new SelectInteractor('#mapping-profiles-form [data-test-staff-only]');
  permanent = new TextFieldInteractor('#mapping-profiles-form [data-test-permanent]');
  permanentAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-permanent] [data-test-accepted-values-list]');
  temporary = new TextFieldInteractor('#mapping-profiles-form [data-test-temporary]');
  temporaryAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-temporary] [data-test-accepted-values-list]');
}

class ElectronicAccessAccordion extends AccordionInteractor {
  electronicAccess = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-electronic-access]');
  electronicAccessRepeatable = new SelectInteractor('#mapping-profiles-form #section-electronic-access [data-test-repeatable-decorator]');
  electronicRelationship = new TextFieldInteractor('#mapping-profiles-form [data-test-electronic-relationship]');
  electronicRelationshipAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-electronic-relationship] [data-test-accepted-values-list]');
}

export class ItemDetailsAccordion extends AccordionSetInteractor {
  header = new MappedHeaderInteractor('#mapping-profiles-form');
  expandAllButton = new ExpandAllButtonInteractor('#mapping-profiles-form [data-test-expand-all-button]');
  adminDataAccordion = new AdministrativeDataAccordion('#administrative-data');
  itemDataAccordion = new ItemDataAccordion('#item-data');
  enumerationDataAccordion = new EnumerationDataAccordion('#enumeration-data');
  conditionAccordion = new ConditionAccordion('#item-condition');
  itemNotesAccordion = new ItemNotesAccordion('#item-notes');
  loanAndAvailabilityAccordion = new LoanAndAvailabilityAccordion('#item-loans');
  locationAccordion = new LocationAccordion('#item-location');
  electronicAccessAccordion = new ElectronicAccessAccordion('#item-electronic-access');
}
