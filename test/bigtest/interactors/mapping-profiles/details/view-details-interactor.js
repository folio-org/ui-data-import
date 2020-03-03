import { AccordionInteractor, AccordionSetInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import KeyValueInteractor from '@folio/stripes-components/lib/KeyValue/tests/interactor';

import { MappedHeaderInteractor } from '../../mapped-header-interactor';

class AdministrativeDataAccordion extends AccordionInteractor {
  suppressFromDiscovery = new KeyValueInteractor('[data-test-suppress-from-discovery]');
  holdingsHRID = new KeyValueInteractor('[data-test-holdings-hrid]');
  formerHoldingsIdTable = new MultiColumnListInteractor('#mapping-details-former-holdings-id');
  holdingsType = new KeyValueInteractor('[data-test-holdings-type]');
  statisticalCodeTable = new MultiColumnListInteractor('#mapping-details-statistical-code');
}

class LocationAccordion extends AccordionInteractor {
  permanent = new KeyValueInteractor('[data-test-permanent]');
  temporary = new KeyValueInteractor('[data-test-temporary]');
  shelvingOrder = new KeyValueInteractor('[data-test-shelving-order]');
  shelvingTitle = new KeyValueInteractor('[data-test-shelving-title]');
  copyNumber = new KeyValueInteractor('[data-test-copy-number]');
  callNumberType = new KeyValueInteractor('[data-test-call-number-type]');
  callNumberPrefix = new KeyValueInteractor('[data-test-call-number-prefix]');
  callNumber = new KeyValueInteractor('[data-test-call-number]');
  callNumberSuffix = new KeyValueInteractor('[data-test-call-number-suffix]');
}

class DetailsAccordion extends AccordionInteractor {
  numberOfItems = new KeyValueInteractor('[data-test-number-of-items]');
  holdingsStatementsTable = new MultiColumnListInteractor('#mapping-details-holdings-statements');
  holdingsStatementsForSupplTable = new MultiColumnListInteractor('#mapping-details-statements-for-suppl');
  holdingsStatementsForIndexesTable = new MultiColumnListInteractor('#mapping-details-statements-for-indexes');
  illPolicy = new KeyValueInteractor('[data-test-ill-policy]');
  digitizationPolicy = new KeyValueInteractor('[data-test-digitization-policy]');
  retentionPolicy = new KeyValueInteractor('[data-test-retention-policy]');
}

class NotesAccordion extends AccordionInteractor {
  notesTable = new MultiColumnListInteractor('#mapping-details-notes');
}

class ElectronicAccessAccordion extends AccordionInteractor {
  electronicAccessTable = new MultiColumnListInteractor('#mapping-details-electronic-access');
}

class AcquisitionAccordion extends AccordionInteractor {
  acquisitionMethod = new KeyValueInteractor('[data-test-acquisition-method]');
  orderFormat = new KeyValueInteractor('[data-test-order-format]');
  receiptStatus = new KeyValueInteractor('[data-test-receipt-status]');
}

class ReceivingHistoryAccordion extends AccordionInteractor {
  receivingHistoryTable = new MultiColumnListInteractor('#mapping-details-receiving-history');
}

export class HoldingsDetailsAccordion extends AccordionSetInteractor {
  header = new MappedHeaderInteractor();
  adminDataAccordion = new AdministrativeDataAccordion('#mapping-profile-admin-data');
  locationAccordion = new LocationAccordion('#mapping-profile-location');
  holdingsDetailsAccordion = new DetailsAccordion('#mapping-profile-holdings-details');
  holdingsNotesAccordion = new NotesAccordion('#mapping-profile-holdings-notes');
  electronicAccessAccordion = new ElectronicAccessAccordion('#mapping-profile-electronic-access');
  acquisitionAccordion = new AcquisitionAccordion('#mapping-profile-acquisition');
  receivingHistoryAccordion = new ReceivingHistoryAccordion('#mapping-profile-receiving-history');
}
