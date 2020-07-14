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
  statisticalCodes = new MultiColumnListInteractor('[data-test-statistical-codes]');
}

class TitleDataAccordion extends AccordionInteractor {
  resourceTitle = new KeyValueInteractor('[data-test-resource-title]');
  alternativeTitles = new MultiColumnListInteractor('[data-test-alternative-titles]');
  indexTitle = new KeyValueInteractor('[data-test-index-title]');
  seriesStatement = new MultiColumnListInteractor('[data-test-series-statements]');
  precedingTitles = new MultiColumnListInteractor('[data-test-preceding-titles]');
  succeedingTitles = new MultiColumnListInteractor('[data-test-succeeding-titles]');
}

class IdentifierAccordion extends AccordionInteractor {
  identifiers = new MultiColumnListInteractor('[data-test-identifiers]');
}

class ContributorAccordion extends AccordionInteractor {
  contributors = new MultiColumnListInteractor('[data-test-contributors]');
}

class DescriptiveDataAccordion extends AccordionInteractor {
  publications = new MultiColumnListInteractor('[data-test-publications]');
  editions = new MultiColumnListInteractor('[data-test-editions]');
  physicalDescriptions = new MultiColumnListInteractor('[data-test-physical-descriptions]');
  resourceType = new KeyValueInteractor('[data-test-resource-type]');
  natureOfContentTerms = new MultiColumnListInteractor('[data-test-nature-of-content-terms]');
  formats = new MultiColumnListInteractor('[data-test-formats]');
  languages = new MultiColumnListInteractor('[data-test-languages]');
  publicationFrequencies = new MultiColumnListInteractor('[data-test-publication-frequencies]');
  publicationRange = new MultiColumnListInteractor('[data-test-publication-ranges]');
}

class InstanceNotesAccordion extends AccordionInteractor {
  notes = new MultiColumnListInteractor('[data-test-notes]');
}

class ElectronicAccessAccordion extends AccordionInteractor {
  electronicAccess = new MultiColumnListInteractor('[data-test-electronic-access]');
}

class SubjectAccordion extends AccordionInteractor {
  subjects = new MultiColumnListInteractor('[data-test-subjects]');
}

class ClassificationAccordion extends AccordionInteractor {
  classifications = new MultiColumnListInteractor('[data-test-classifications]');
}

class InstanceRelationshipAccordion extends AccordionInteractor {
  parentInstances = new MultiColumnListInteractor('[data-test-parent-instances]');
  childInstances = new MultiColumnListInteractor('[data-test-child-instances]');
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
  electronicAccessAccordion = new ElectronicAccessAccordion('[data-test-electronic-access]');
  subjectAccordion = new SubjectAccordion('#subjects');
  classificationAccordion = new ClassificationAccordion('#classification');
  instanceRelationshipAccordion = new InstanceRelationshipAccordion('#instance-relationship');
  relatedInstancesAccordion = new AccordionInteractor('#related-instances');
}
