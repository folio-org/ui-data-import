// eslint-disable-next-line max-classes-per-file
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import RepeatableFieldInteractor from '@folio/stripes-components/lib/RepeatableField/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import DropdownInteractor from '@folio/stripes-components/lib/Dropdown/tests/interactor';
import DatepickerInteractor from '@folio/stripes-components/lib/Datepicker/tests/interactor';

import { DetailsSection } from '../details-section';
import { InputInteractor } from '../../../input-interactor';

class AdministrativeDataAccordion extends AccordionInteractor {
  suppressFromDiscovery = new SelectInteractor('#mapping-profiles-form [data-test-suppress-from-discovery]');
  staffSuppress = new SelectInteractor('#mapping-profiles-form [data-test-staff-suppress]');
  previouslyHeld = new SelectInteractor('#mapping-profiles-form [data-test-previously-held]');
  instanceHRID = new InputInteractor('#mapping-profiles-form [data-test-instance-hrid]');
  metadataSource = new InputInteractor('#mapping-profiles-form [data-test-metadata-source]');
  catalogedDate = new TextFieldInteractor('#mapping-profiles-form [data-test-cataloged-date]');
  catalogedDateAcceptedValues = new DropdownInteractor('#mapping-profiles-form [data-test-cataloged-date] [data-test-accepted-values-list]');
  catalogedDatePicker = new DatepickerInteractor('#mapping-profiles-form [data-test-cataloged-date] [data-test-date-picker]');
  instanceStatusTerm = new TextFieldInteractor('#mapping-profiles-form [data-test-status-term]');
  instanceStatusTermAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-status-term] [data-test-accepted-values-list]');
  modeOfIssuance = new InputInteractor('#mapping-profiles-form [data-test-mode-of-issuance]');
  statisticalCodes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-statistical-codes]');
  statisticalCodesRepeatable = new SelectInteractor('#mapping-profiles-form #administrative-data [data-test-repeatable-decorator]');
  statisticalCode = new TextFieldInteractor('#mapping-profiles-form [data-test-statistical-code]');
  statisticalCodeAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-statistical-code] [data-test-accepted-values-list]');
}

class TitleDataAccordion extends AccordionInteractor {
  resourceTitle = new InputInteractor('#mapping-profiles-form [data-test-resource-title');
  alternativeTitles = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-alternative-titles]');
  alternativeTitlesRepeatable = new SelectInteractor('#mapping-profiles-form #section-alternative-titles [data-test-repeatable-decorator]');
  indexTitle = new InputInteractor('#mapping-profiles-form [data-test-index-title]');
  seriesStatements = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-series-statements]');
  seriesStatementsRepeatable = new SelectInteractor('#mapping-profiles-form #section-series [data-test-repeatable-decorator]');
  precedingTitles = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-preceding-titles]');
  precedingTitlesRepeatable = new SelectInteractor('#mapping-profiles-form #section-preceding-titles [data-test-repeatable-decorator]');
  succeedingTitles = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-succeeding-titles]');
  succeedingTitlesRepeatable = new SelectInteractor('#mapping-profiles-form #section-succeeding-titles [data-test-repeatable-decorator]');;
}

class IdentifierAccordion extends AccordionInteractor {
  identifiers = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-identifiers]');
  identifiersRepeatable = new SelectInteractor('#mapping-profiles-form #section-identifiers [data-test-repeatable-decorator]');
}

class ContributorAccordion extends AccordionInteractor {
  primary = new SelectInteractor('#mapping-profiles-form [data-test-primary]');
  contributors = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-contributors]');
  contributorsRepeatable = new SelectInteractor('#mapping-profiles-form #section-contributors [data-test-repeatable-decorator]');
}

class DescriptiveDataAccordion extends AccordionInteractor {
  publications = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-publications]');
  publicationsRepeatable = new SelectInteractor('#mapping-profiles-form #section-publications [data-test-repeatable-decorator]');
  editions = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-editions]');
  editionsRepeatable = new SelectInteractor('#mapping-profiles-form #section-editions [data-test-repeatable-decorator]');
  physicalDescriptions = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-physical-descriptions]');
  physicalDescriptionsRepeatable = new SelectInteractor('#mapping-profiles-form #section-physical-descriptions [data-test-repeatable-decorator]');
  resourceType = new InputInteractor('#mapping-profiles-form [data-test-resource-type]');
  natureOfContentTerms = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-nature-of-content-terms]');
  natureOfContentTermsRepeatable = new SelectInteractor('#mapping-profiles-form #section-nature-of-content [data-test-repeatable-decorator]');
  natureOfContentTerm = new TextFieldInteractor('#mapping-profiles-form [data-test-nature-of-content-term]');
  natureOfContentTermAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-nature-of-content-term] [data-test-accepted-values-list]');
  formats = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-formats]');
  formatsRepeatable = new SelectInteractor('#mapping-profiles-form #section-instance-formats [data-test-repeatable-decorator]');
  languages = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-languages]');
  languagesRepeatable = new SelectInteractor('#mapping-profiles-form #section-languages [data-test-repeatable-decorator]');
  publicationFrequencies = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-publication-frequencies]');
  publicationFrequenciesRepeatable = new SelectInteractor('#mapping-profiles-form #section-publication-frequency [data-test-repeatable-decorator]');
  publicationRanges = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-publication-ranges]');
  publicationRangesRepeatable = new SelectInteractor('#mapping-profiles-form #section-publication-range [data-test-repeatable-decorator]');
}

class InstanceNotesAccordion extends AccordionInteractor {
  staffOnly = new SelectInteractor('#mapping-profiles-form [data-test-staff-only]');
  notes = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-notes]');
  notesRepeatable = new SelectInteractor('#mapping-profiles-form #section-instance-notes [data-test-repeatable-decorator]');
}

class ElectronicAccessAccordion extends AccordionInteractor {
  electronicAccess = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-electronic-access]');
  electronicAccessRepeatable = new SelectInteractor('#mapping-profiles-form #section-electronic-access [data-test-repeatable-decorator]');
  relationship = new TextFieldInteractor('#mapping-profiles-form [data-test-relationship]');
  relationshipAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-relationship] [data-test-accepted-values-list]');
}

class SubjectAccordion extends AccordionInteractor {
  subjects = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-subjects]');
  subjectsRepeatable = new SelectInteractor('#mapping-profiles-form #section-subjects [data-test-repeatable-decorator]');
}

class ClassificationAccordion extends AccordionInteractor {
  classifications = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-classifications]');
  classificationsRepeatable = new SelectInteractor('#mapping-profiles-form #section-classification [data-test-repeatable-decorator]');
}

class InstanceRelationshipAccordion extends AccordionInteractor {
  parentInstances = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-parent-instances]');
  parentInstancesRepeatable = new SelectInteractor('#mapping-profiles-form #section-parent-instances [data-test-repeatable-decorator]');
  parentTypeOfRelation = new TextFieldInteractor('#mapping-profiles-form [data-test-parent-type-of-relation]');
  parentTypeOfRelationAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-parent-type-of-relation] [data-test-accepted-values-list]');
  childInstances = new RepeatableFieldInteractor('#mapping-profiles-form [data-test-child-instances]');
  childInstancesRepeatable = new SelectInteractor('#mapping-profiles-form #section-child-instances [data-test-repeatable-decorator]');

  childTypeOfRelation = new TextFieldInteractor('#mapping-profiles-form [data-test-child-type-of-relation]');
  childTypeOfRelationAcceptedValues = new DropdownInteractor('#mapping-profile-details [data-test-child-type-of-relation] [data-test-accepted-values-list]');
}

export class InstanceDetailsAccordion extends DetailsSection {
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
