import {
  interactor,
  is,
  collection,
} from '@bigtest/interactor';

import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import KeyValueInteractor from '@folio/stripes-components/lib/KeyValue/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import { InputInteractor } from './input-interactor';

import { SectionInteractor } from './section-interactor';
import { CheckboxInteractor } from './checkbox-interactor';

@interactor
class MatchCriterion {
  isSection = is('section');
  dropdown = new SelectInteractor('#criterion1-criterion-type');
}

@interactor
class RecordSections {
  children = collection('section', SectionInteractor);
}
export class MatchCriteriaInteractor extends AccordionInteractor {
  matchCriterionSection = new MatchCriterion('[class*="criterion--"] div');

  incomingMarcRecord = new SectionInteractor('section[class*=incoming]');
  fieldMain = new KeyValueInteractor('[data-test-field-main]');
  fieldIn1 = new KeyValueInteractor('[data-test-field-in1]');
  fieldIn2 = new KeyValueInteractor('[data-test-field-in2]');
  fieldSubfield = new KeyValueInteractor('[data-test-field-subfield');
  inputMain = new InputInteractor('[data-test-field-main]');
  inputIn1 = new InputInteractor('[data-test-field-in1]');
  inputIn2 = new InputInteractor('[data-test-field-in2]');
  inputSubfield = new InputInteractor('[data-test-field-subfield');
  incomingMarcRecordSections = new RecordSections('section[class*=incoming]');
  incomingMarcRecordQualifierCheckbox = new CheckboxInteractor('section[class*=incoming] [class*="qualifier---"]');
  incomingMarcRecordPartCheckbox = new CheckboxInteractor('section[class*=incoming] [class*="part---"]');

  matchCriterion = new SectionInteractor('section[class*=" criterion"]');
  matchCriterionField = new KeyValueInteractor('[data-test-match-criterion]');

  existingRecord = new SectionInteractor('section[class*=existing]');
  existingRecordSections = new RecordSections('section[class*=existing]');
  existingRecordQualifierCheckbox = new CheckboxInteractor('section[class*=existing] [class*="qualifier---"]');
  existingRecordPartCheckbox = new CheckboxInteractor('section[class*=existing] [class*="part---"]');
}
