// eslint-disable-next-line max-classes-per-file
import {
  AccordionInteractor,
  AccordionSetInteractor,
} from '@folio/stripes-components/lib/Accordion/tests/interactor';
import ExpandAllButtonInteractor from '@folio/stripes-components/lib/Accordion/tests/expand-all-button-interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import RepeatableFieldInteractor from '@folio/stripes-components/lib/RepeatableField/tests/interactor';

import { InputInteractor } from '../../../input-interactor';
import { MappedHeaderInteractor } from '../../../mapped-header-interactor';

class AdministrativeDataAccordion extends AccordionInteractor {
  itemHRID = new InputInteractor('#mapping-profiles-form [data-test-item-hrid]');
  barcode = new TextFieldInteractor('#mapping-profiles-form [data-test-barcode]');
  accessionNumber = new TextFieldInteractor('#mapping-profiles-form [data-test-accession-number]');
  itemIdentifier = new TextFieldInteractor('#mapping-profiles-form [data-test-item-identifier]');
  formerIds = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-former-ids]');
  statisticalCodes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-statistical-codes]');
}

class ItemDataAccordion extends AccordionInteractor {
  materialType = new TextFieldInteractor('#mapping-profiles-form [data-test-material-type]');
  copyNumber = new TextFieldInteractor('#mapping-profiles-form [data-test-copy-number]');
  callNumberType = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number-type]');
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
}

class ConditionAccordion extends AccordionInteractor {
  missingPiecesNumber = new TextFieldInteractor('#mapping-profiles-form [data-test-missing-pieces-number]');
  missingPieces = new TextFieldInteractor('#mapping-profiles-form [data-test-missing-pieces]');
  date = new TextFieldInteractor('#mapping-profiles-form [data-test-date]');
  itemDamagedStatus = new TextFieldInteractor('#mapping-profiles-form [data-test-item-damaged-status]');
  date2 = new TextFieldInteractor('#mapping-profiles-form [data-test-date2]');
}

class ItemNotesAccordion extends AccordionInteractor {
  notes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-item-notes]');
}

class LoanAndAvailabilityAccordion extends AccordionInteractor {
  permanentLoanType = new TextFieldInteractor('#mapping-profiles-form [data-test-permanent-loan-type]');
  temporaryLoanType = new TextFieldInteractor('#mapping-profiles-form [data-test-temporary-loan-type]');
  status = new TextFieldInteractor('#mapping-profiles-form [data-test-status]');
  circulationNotes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-circulation-notes]');
}

class LocationAccordion extends AccordionInteractor {
  permanent = new TextFieldInteractor('#mapping-profiles-form [data-test-permanent]');
  temporary = new TextFieldInteractor('#mapping-profiles-form [data-test-temporary]');
}

class ElectronicAccessAccordion extends AccordionInteractor {
  electronicAccess = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-electronic-access]');
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
