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
  alternativeTitleType = new KeyValueInteractor('[data-test-alternative-title-type');
  alternativeTitle = new KeyValueInteractor('[data-test-alternative-title');
  indexTitle = new KeyValueInteractor('[data-test-index-title');
  seriesStatements = new KeyValueInteractor('[data-test-series-statements]');
}

class IdentifierAccordion extends AccordionInteractor {
  identifierType = new KeyValueInteractor('[data-test-identifier-type');
  identifierValue = new KeyValueInteractor('[data-test-identifier-value');
}

class ContributorAccordion extends AccordionInteractor {
  name = new KeyValueInteractor('[data-test-name]');
  nameType = new KeyValueInteractor('[data-test-name-type]');
  type = new KeyValueInteractor('[data-test-type]');
  typeFreeText = new KeyValueInteractor('[data-test-type-free-text]');
  primary = new KeyValueInteractor('[data-test-primary]');
}

class DescriptiveDataAccordion extends AccordionInteractor {
  publisher = new KeyValueInteractor('[data-test-publisher]');
  publisherRole = new KeyValueInteractor('[data-test-publisher-role]');
  place = new KeyValueInteractor('[data-test-place]');
  publicationDate = new KeyValueInteractor('[data-test-publication-date]');
  edition = new KeyValueInteractor('[data-test-edition]');
  physicalDescription = new KeyValueInteractor('[data-test-physical-description]');
  resourceType = new KeyValueInteractor('[data-test-resource-type]');
  format = new KeyValueInteractor('[data-test-format]');
  language = new KeyValueInteractor('[data-test-language]');
  publicationFrequency = new KeyValueInteractor('[data-test-publication-frequency]');
  publicationRange = new KeyValueInteractor('[data-test-publication-range]');
}

class InstanceNotesAccordion extends AccordionInteractor {
  noteType = new KeyValueInteractor('[data-test-note-type]');
  note = new KeyValueInteractor('[data-test-note]');
  staffOnly = new KeyValueInteractor('[data-test-staff-only]');
}

class ElectronicAccessAccordion extends AccordionInteractor {
  relationship = new KeyValueInteractor('[data-test-relationship]');
  uri = new KeyValueInteractor('[data-test-uri]');
  linkText = new KeyValueInteractor('[data-test-link-text]');
  materialsSpecified = new KeyValueInteractor('[data-test-materials-specified]');
  urlPublicNote = new KeyValueInteractor('[data-test-url-public-note]');
}

class SubjectAccordion extends AccordionInteractor {
  subjects = new KeyValueInteractor('[data-test-subjects-field]');
}

class ClassificationAccordion extends AccordionInteractor {
  classificationIdentifierType = new KeyValueInteractor('[data-test-classification-identifier-type]');
  classification = new KeyValueInteractor('[data-test-classification]');
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
