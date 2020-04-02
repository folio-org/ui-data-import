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
  holdingsHRID = new InputInteractor('#mapping-profiles-form [data-test-holdings-hrid]');
  formerHoldings = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-former-holdings]');
  holdingsType = new TextFieldInteractor('#mapping-profiles-form [data-test-holdings-type]');
  statisticalCodes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-statistical-codes]');
}

class LocationAccordion extends AccordionInteractor {
  permanent = new TextFieldInteractor('#mapping-profiles-form [data-test-permanent]');
  temporary = new TextFieldInteractor('#mapping-profiles-form [data-test-temporary]');
  shelvingOrder = new TextFieldInteractor('#mapping-profiles-form [data-test-shelving-order]');
  shelvingTitle = new TextFieldInteractor('#mapping-profiles-form [data-test-shelving-title]');
  copyNumber = new TextFieldInteractor('#mapping-profiles-form [data-test-copy-number]');
  callNumberType = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number-type]');
  callNumberPrefix = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number-prefix]');
  callNumber = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number]');
  callNumberSuffix = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number-suffix]');
}

class DetailsAccordion extends AccordionInteractor {
  numberOfItems = new TextFieldInteractor('#mapping-profiles-form [data-test-number-of-items]');
  statements = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-statements]');
  statementsForSupplement = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-statements-for-supplement]');
  statementsForIndexes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-statements-for-indexes]');
  illPolicy = new TextFieldInteractor('#mapping-profiles-form [data-test-ill-policy]');
  digitizationPolicy = new TextFieldInteractor('#mapping-profiles-form [data-test-digitization-policy]');
  retentionPolicy = new TextFieldInteractor('#mapping-profiles-form [data-test-retention-policy]');
}

class NotesAccordion extends AccordionInteractor {
  notes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-notes]');
}

class ElectronicAccessAccordion extends AccordionInteractor {
  electronicAccess = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-electronic-access]');
}

class AcquisitionAccordion extends AccordionInteractor {
  acquisitionMethod = new TextFieldInteractor('#mapping-profiles-form [data-test-acquisition-method]');
  orderFormat = new TextFieldInteractor('#mapping-profiles-form [data-test-order-format]');
  receiptStatus = new TextFieldInteractor('#mapping-profiles-form [data-test-receipt-status]');
}

class ReceivingHistoryAccordion extends AccordionInteractor {
  note = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-receiving-history-note]');
}

export class HoldingsDetailsAccordion extends AccordionSetInteractor {
  header = new MappedHeaderInteractor('#mapping-profiles-form');
  expandAllButton = new ExpandAllButtonInteractor('#mapping-profiles-form [data-test-expand-all-button]');
  adminDataAccordion = new AdministrativeDataAccordion('#administrative-data');
  locationAccordion = new LocationAccordion('#holdings-location');
  holdingsDetailsAccordion = new DetailsAccordion('#holdings-details');
  holdingsNotesAccordion = new NotesAccordion('#holdings-notes');
  electronicAccessAccordion = new ElectronicAccessAccordion('#holdings-electronic-access');
  acquisitionAccordion = new AcquisitionAccordion('#holdings-acquisition');
  receivingHistoryAccordion = new ReceivingHistoryAccordion('#holdings-receiving-history');
}
