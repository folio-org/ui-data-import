// eslint-disable-next-line max-classes-per-file
import {
  AccordionInteractor,
  AccordionSetInteractor,
} from '@folio/stripes-components/lib/Accordion/tests/interactor';
import ExpandAllButtonInteractor from '@folio/stripes-components/lib/Accordion/tests/expand-all-button-interactor';
import KeyValueInteractor from '@folio/stripes-components/lib/KeyValue/tests/interactor';

import { MappedHeaderInteractor } from '../../../mapped-header-interactor';

class AdministrativeDataAccordion extends AccordionInteractor {
  suppressFromDiscovery = new KeyValueInteractor('[data-test-suppress-from-discovery]');
  staffSuppress = new KeyValueInteractor('[data-test-staff-suppress]');
  previouslyHeld = new KeyValueInteractor('[data-test-previously-held]');
  instanceHRID = new KeyValueInteractor('[data-test-instance-hrid]');
  metadataSource = new KeyValueInteractor('[data-test-metadata-source]');
  catalogedDate = new KeyValueInteractor('[data-test-cataloged-date]');
  instanceStatusTerm = new KeyValueInteractor('[data-test-status-term]');
  modeOfIssuance = new KeyValueInteractor('[data-test-mode-of-issuance]');
}

class TitleDataAccordion extends AccordionInteractor {
  resourceTitle = new KeyValueInteractor('[data-test-resource-title');
  indexTitle = new KeyValueInteractor('[data-test-index-title');
}

class IdentifierAccordion extends AccordionInteractor {
}

class ContributorAccordion extends AccordionInteractor {
}

class DescriptiveDataAccordion extends AccordionInteractor {
  resourceType = new KeyValueInteractor('[data-test-resource-type]');
}

class InstanceNotesAccordion extends AccordionInteractor {
}

class ElectronicAccessAccordion extends AccordionInteractor {
}

class SubjectAccordion extends AccordionInteractor {
}

class ClassificationAccordion extends AccordionInteractor {
}

export class InstanceDetailsAccordion extends AccordionSetInteractor {
  header = new MappedHeaderInteractor();
  expandAllButton = new ExpandAllButtonInteractor('[data-test-expand-all-button]');
  adminDataAccordion = new AdministrativeDataAccordion('#administrative-data');
  titleDataAccordion = new TitleDataAccordion('#title-data');
  identifierAccordion = new IdentifierAccordion('#identifiers');
  contributorAccordion = new ContributorAccordion('#contributors');
  descriptiveDataAccordion = new DescriptiveDataAccordion('#descriptive-data');
  instanceNotesAccordion = new InstanceNotesAccordion('#instance-notes');
  electronicAccessAccordion = new ElectronicAccessAccordion('#instance-electronic-access');
  subjectAccordion = new SubjectAccordion('#subjects');
  classificationAccordion = new ClassificationAccordion('#classification');
  instanceRelationshipAccordion = new AccordionInteractor('#instance-relationship');
  relatedInstancesAccordion = new AccordionInteractor('#related-instances');
}
