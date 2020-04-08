// eslint-disable-next-line max-classes-per-file
import {
  AccordionInteractor,
  AccordionSetInteractor,
} from '@folio/stripes-components/lib/Accordion/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import KeyValueInteractor from '@folio/stripes-components/lib/KeyValue/tests/interactor';
import ExpandAllButtonInteractor from '@folio/stripes-components/lib/Accordion/tests/expand-all-button-interactor';

import { MappedHeaderInteractor } from '../../../mapped-header-interactor';

class AdministrativeDataAccordion extends AccordionInteractor {
  suppressFromDiscovery = new KeyValueInteractor('[data-test-suppress-from-discovery]');
  holdingsHRID = new KeyValueInteractor('[data-test-holdings-hrid]');
  formerHoldings = new MultiColumnListInteractor('#section-former-ids');
  holdingsType = new KeyValueInteractor('[data-test-holdings-type]');
  statisticalCodes = new MultiColumnListInteractor('#section-statistical-code-ids');
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
  statements = new MultiColumnListInteractor('#section-holding-statements');
  statementsForSuppl = new MultiColumnListInteractor('#section-holding-statements-for-supplements');
  statementsForNotes = new MultiColumnListInteractor('#section-holding-statements-for-indexes');
  illPolicy = new KeyValueInteractor('[data-test-ill-policy]');
  digitizationPolicy = new KeyValueInteractor('[data-test-digitization-policy]');
  retentionPolicy = new KeyValueInteractor('[data-test-retention-policy]');
}

class HoldingsNotesAccordion extends AccordionInteractor {
  notes = new MultiColumnListInteractor('#section-holdings-notes');
}

class ElectronicAccessAccordion extends AccordionInteractor {
  electronicAccess = new MultiColumnListInteractor('#section-electronic-access');
}

class AcquisitionAccordion extends AccordionInteractor {
  acquisitionMethod = new KeyValueInteractor('[data-test-acquisition-method]');
  orderFormat = new KeyValueInteractor('[data-test-order-format]');
  receiptStatus = new KeyValueInteractor('[data-test-receipt-status]');
}

class ReceivingHistoryAccordion extends AccordionInteractor {
  receivingHistory = new MultiColumnListInteractor('#section-receiving-history');
}

export class HoldingsDetailsAccordion extends AccordionSetInteractor {
  header = new MappedHeaderInteractor();
  expandAllButton = new ExpandAllButtonInteractor('[data-test-expand-all-button]');
  adminDataAccordion = new AdministrativeDataAccordion('#administrative-data');
  locationAccordion = new LocationAccordion('#holdings-location');
  holdingsDetailsAccordion = new DetailsAccordion('#holdings-details');
  holdingsNotesAccordion = new HoldingsNotesAccordion('#holdings-notes');
  electronicAccessAccordion = new ElectronicAccessAccordion('#holdings-electronic-access');
  acquisitionAccordion = new AcquisitionAccordion('#holdings-acquisition');
  receivingHistoryAccordion = new ReceivingHistoryAccordion('#holdings-receiving-history');
}
