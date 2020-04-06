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
  illPolicy = new KeyValueInteractor('[data-test-ill-policy]');
  digitizationPolicy = new KeyValueInteractor('[data-test-digitization-policy]');
  retentionPolicy = new KeyValueInteractor('[data-test-retention-policy]');
}

class ElectronicAccessAccordion extends AccordionInteractor {
  electronicAccessTable = new MultiColumnListInteractor('#mapping-details-electronic-access');
}

class AcquisitionAccordion extends AccordionInteractor {
  acquisitionMethod = new KeyValueInteractor('[data-test-acquisition-method]');
  orderFormat = new KeyValueInteractor('[data-test-order-format]');
  receiptStatus = new KeyValueInteractor('[data-test-receipt-status]');
}

export class HoldingsDetailsAccordion extends AccordionSetInteractor {
  header = new MappedHeaderInteractor();
  expandAllButton = new ExpandAllButtonInteractor('[data-test-expand-all-button]');
  adminDataAccordion = new AdministrativeDataAccordion('#administrative-data');
  locationAccordion = new LocationAccordion('#holdings-location');
  holdingsDetailsAccordion = new DetailsAccordion('#holdings-details');
  holdingsNotesAccordion = new AccordionInteractor('#holdings-notes');
  electronicAccessAccordion = new ElectronicAccessAccordion('#holdings-electronic-access');
  acquisitionAccordion = new AcquisitionAccordion('#holdings-acquisition');
  receivingHistoryAccordion = new AccordionInteractor('#holdings-receiving-history');
}
