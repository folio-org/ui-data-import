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
  instanceHRID = new InputInteractor('#mapping-profiles-form [data-test-instance-hrid]');
  metadataSource = new InputInteractor('#mapping-profiles-form [data-test-metadata-source]');
  catalogedDate = new TextFieldInteractor('#mapping-profiles-form [data-test-cataloged-date]');
  instanceStatusTerm = new TextFieldInteractor('#mapping-profiles-form [data-test-status-term]');
  modeOfIssuance = new InputInteractor('#mapping-profiles-form [data-test-mode-of-issuance]');
  statisticalCodes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-statistical-codes]');
}

class TitleDataAccordion extends AccordionInteractor {
  resourceTitle = new InputInteractor('#mapping-profiles-form [data-test-resource-title');
  alternativeTitles = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-alternative-titles]');
  indexTitle = new InputInteractor('#mapping-profiles-form [data-test-index-title]');
  seriesStatements = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-series-statements]');
  precedingTitles = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-preceding-titles]');
  succeedingTitles = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-succeeding-titles]');
}

class IdentifierAccordion extends AccordionInteractor {
  identifiers = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-identifiers]');
}

class ContributorAccordion extends AccordionInteractor {
  contributors = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-contributors]');
}

class DescriptiveDataAccordion extends AccordionInteractor {
  publications = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-publications]');
  editions = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-editions]');
  physicalDescriptions = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-physical-descriptions]');
  resourceType = new InputInteractor('#mapping-profiles-form [data-test-resource-type]');
  natureOfContentTerms = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-nature-of-content]');
  formats = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-formats]');
  languages = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-languages]');
  publicationFrequencies = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-publication-frequencies]');
  publicationRanges = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-publication-ranges]');
}

class InstanceNotesAccordion extends AccordionInteractor {
  notes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-notes]');
}

class ElectronicAccessAccordion extends AccordionInteractor {
  electronicAccess = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-electronic-access]');
}

class SubjectAccordion extends AccordionInteractor {
  subjects = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-subjects]');
}

class ClassificationAccordion extends AccordionInteractor {
  classifications = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-classifications]');
}

class InstanceRelationshipAccordion extends AccordionInteractor {
  parentInstances = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-parent-instances]');
  childInstances = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-child-instances]');
}

export class InstanceDetailsAccordion extends AccordionSetInteractor {
  header = new MappedHeaderInteractor('#mapping-profiles-form');
  expandAllButton = new ExpandAllButtonInteractor('#mapping-profiles-form [data-test-expand-all-button]');
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
