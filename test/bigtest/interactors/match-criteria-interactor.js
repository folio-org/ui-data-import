import {
  interactor,
  is,
} from '@bigtest/interactor';
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import KeyValueInteractor from '@folio/stripes-components/lib/KeyValue/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import { InputInteractor } from './input-interactor';

@interactor
class MatchCriterion {
  isSection = is('section');
  dropdown = new SelectInteractor('#criterion1-criterion-type');
}

export class MatchCriteriaInteractor extends AccordionInteractor {
  fieldMain = new KeyValueInteractor('[data-test-field-main]');
  fieldIn1 = new KeyValueInteractor('[data-test-field-in1]');
  fieldIn2 = new KeyValueInteractor('[data-test-field-in2]');
  fieldSubfield = new KeyValueInteractor('[data-test-field-subfield');
  inputMain = new InputInteractor('[data-test-field-main]');
  inputIn1 = new InputInteractor('[data-test-field-in1]');
  inputIn2 = new InputInteractor('[data-test-field-in2]');
  inputSubfield = new InputInteractor('[data-test-field-subfield');
  matchCriterionSection = new MatchCriterion('[class*="criterion--"] div');
  matchCriterionField = new KeyValueInteractor('[data-test-match-criterion]');
}
