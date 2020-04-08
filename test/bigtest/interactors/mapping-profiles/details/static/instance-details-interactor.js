// eslint-disable-next-line max-classes-per-file
import {
  AccordionInteractor,
  AccordionSetInteractor,
} from '@folio/stripes-components/lib/Accordion/tests/interactor';
import ExpandAllButtonInteractor from '@folio/stripes-components/lib/Accordion/tests/expand-all-button-interactor';
import KeyValueInteractor from '@folio/stripes-components/lib/KeyValue/tests/interactor';
import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';

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
  statisticalCodes = new MultiColumnListInteractor('#section-statistical-code-ids');
}

class TitleDataAccordion extends AccordionInteractor {
  resourceTitle = new KeyValueInteractor('[data-test-resource-title]');
  alternativeTitles = new MultiColumnListInteractor('#section-alternative-titles');
  indexTitle = new KeyValueInteractor('[data-test-index-title]');
  seriesStatement = new MultiColumnListInteractor('#section-series');
  precedingTitles = new MultiColumnListInteractor('#section-preceding-titles');
  succeedingTitles = new MultiColumnListInteractor('#section-succeeding-titles');
}

class IdentifierAccordion extends AccordionInteractor {
  identifiers = new MultiColumnListInteractor('#section-identifiers');
}

class ContributorAccordion extends AccordionInteractor {
  contributors = new MultiColumnListInteractor('#section-contributors');
}

class DescriptiveDataAccordion extends AccordionInteractor {
  publications = new MultiColumnListInteractor('#section-publications');
  editions = new MultiColumnListInteractor('#section-editions');
  physicalDescriptions = new MultiColumnListInteractor('#section-physical-descriptions');
  resourceType = new KeyValueInteractor('[data-test-resource-type]');
  natureOfContentTerms = new MultiColumnListInteractor('#section-nature-of-content');
  formats = new MultiColumnListInteractor('#section-instance-formats');
  languages = new MultiColumnListInteractor('#section-languages');
  publicationFrequencies = new MultiColumnListInteractor('#section-publication-frequency');
  publicationRange = new MultiColumnListInteractor('#section-publication-range');
}

class InstanceNotesAccordion extends AccordionInteractor {
  notes = new MultiColumnListInteractor('#section-instance-notes');
}

class ElectronicAccessAccordion extends AccordionInteractor {
  electronicAccess = new MultiColumnListInteractor('#section-electronic-access');
}

class SubjectAccordion extends AccordionInteractor {
  subjects = new MultiColumnListInteractor('#section-subjects');
}

class ClassificationAccordion extends AccordionInteractor {
  classifications = new MultiColumnListInteractor('#section-classification');
}

class InstanceRelationshipAccordion extends AccordionInteractor {
  parentInstances = new MultiColumnListInteractor('#section-parent-instances');
  childInstances = new MultiColumnListInteractor('#section-child-instances');
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
  instanceRelationshipAccordion = new InstanceRelationshipAccordion('#instance-relationship');
  relatedInstancesAccordion = new AccordionInteractor('#related-instances');
}
