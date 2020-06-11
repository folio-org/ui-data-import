// eslint-disable-next-line max-classes-per-file
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import RepeatableFieldInteractor from '@folio/stripes-components/lib/RepeatableField/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import DropdownInteractor from '@folio/stripes-components/lib/Dropdown/tests/interactor';

import { DetailsSection } from '../details-section';
import { InputInteractor } from '../../../input-interactor';

class AdministrativeDataAccordion extends AccordionInteractor {
  suppressFromDiscovery = new SelectInteractor('#mapping-profiles-form [data-test-suppress-from-discovery]');
  holdingsHRID = new InputInteractor('#mapping-profiles-form [data-test-holdings-hrid]');
  formerHoldings = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-former-holdings]');
  formerHoldingsRepeatable = new SelectInteractor('#mapping-profiles-form #section-former-ids [data-test-repeatable-decorator]');
  holdingsType = new TextFieldInteractor('#mapping-profiles-form [data-test-holdings-type]');
  holdingsTypeAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-holdings-type] [data-test-accepted-values-list]');
  statisticalCodes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-statistical-codes]');
  statisticalCodesRepeatable = new SelectInteractor('#mapping-profiles-form #section-statistical-code-ids [data-test-repeatable-decorator]');
  statisticalCode = new TextFieldInteractor('#mapping-profiles-form [data-test-statistical-code]');
  statisticalCodeAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-statistical-code] [data-test-accepted-values-list]');
}

class LocationAccordion extends AccordionInteractor {
  permanent = new TextFieldInteractor('#mapping-profiles-form [data-test-permanent]');
  permanentAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-permanent] [data-test-accepted-values-list]');
  temporary = new TextFieldInteractor('#mapping-profiles-form [data-test-temporary]');
  temporaryAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-temporary] [data-test-accepted-values-list]');
  shelvingOrder = new TextFieldInteractor('#mapping-profiles-form [data-test-shelving-order]');
  shelvingTitle = new TextFieldInteractor('#mapping-profiles-form [data-test-shelving-title]');
  copyNumber = new TextFieldInteractor('#mapping-profiles-form [data-test-copy-number]');
  callNumberType = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number-type]');
  callNumberTypeAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-call-number-type] [data-test-accepted-values-list]');
  callNumberPrefix = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number-prefix]');
  callNumber = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number]');
  callNumberSuffix = new TextFieldInteractor('#mapping-profiles-form [data-test-call-number-suffix]');
}

class DetailsAccordion extends AccordionInteractor {
  numberOfItems = new TextFieldInteractor('#mapping-profiles-form [data-test-number-of-items]');
  statements = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-statements]');
  statementsRepeatable = new SelectInteractor('#mapping-profiles-form #section-holding-statements [data-test-repeatable-decorator]');
  statementsForSupplement = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-statements-for-supplement]');
  statementsForSupplementRepeatable = new SelectInteractor('#mapping-profiles-form #section-holding-statements-for-supplements [data-test-repeatable-decorator]');
  statementsForIndexes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-statements-for-indexes]');
  statementsForIndexesRepeatable = new SelectInteractor('#mapping-profiles-form #section-holding-statements-for-indexes [data-test-repeatable-decorator]');
  illPolicy = new TextFieldInteractor('#mapping-profiles-form [data-test-ill-policy]');
  illPolicyAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-ill-policy] [data-test-accepted-values-list]');
  digitizationPolicy = new TextFieldInteractor('#mapping-profiles-form [data-test-digitization-policy]');
  retentionPolicy = new TextFieldInteractor('#mapping-profiles-form [data-test-retention-policy]');
}

class NotesAccordion extends AccordionInteractor {
  staffOnly = new SelectInteractor('#mapping-profiles-form [data-test-staff-only]');
  notes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-notes]');
  notesRepeatable = new SelectInteractor('#mapping-profiles-form #section-holdings-notes [data-test-repeatable-decorator]');
  note = new TextFieldInteractor('#mapping-profiles-form [data-test-note]');
  noteAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-note] [data-test-accepted-values-list]');
}

class ElectronicAccessAccordion extends AccordionInteractor {
  electronicAccess = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-electronic-access]');
  electronicAccessRepeatable = new SelectInteractor('#mapping-profiles-form #section-electronic-access [data-test-repeatable-decorator]');
  relationship = new TextFieldInteractor('#mapping-profiles-form [data-test-electronic-relationship]');
  relationshipAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-electronic-relationship] [data-test-accepted-values-list]');
}

class AcquisitionAccordion extends AccordionInteractor {
  acquisitionMethod = new TextFieldInteractor('#mapping-profiles-form [data-test-acquisition-method]');
  orderFormat = new TextFieldInteractor('#mapping-profiles-form [data-test-order-format]');
  receiptStatus = new TextFieldInteractor('#mapping-profiles-form [data-test-receipt-status]');
}

class ReceivingHistoryAccordion extends AccordionInteractor {
  publicDisplay = new SelectInteractor('#mapping-profiles-form [data-test-public-display]');
  note = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-receiving-history-note]');
  noteRepeatable = new SelectInteractor('#mapping-profiles-form #section-receiving-history [data-test-repeatable-decorator]');
}

export class HoldingsDetailsAccordion extends DetailsSection {
  adminDataAccordion = new AdministrativeDataAccordion('#administrative-data');
  locationAccordion = new LocationAccordion('#holdings-location');
  holdingsDetailsAccordion = new DetailsAccordion('#holdings-details');
  holdingsNotesAccordion = new NotesAccordion('#holdings-notes');
  electronicAccessAccordion = new ElectronicAccessAccordion('#holdings-electronic-access');
  acquisitionAccordion = new AcquisitionAccordion('#holdings-acquisition');
  receivingHistoryAccordion = new ReceivingHistoryAccordion('#holdings-receiving-history');
}
