import { isPresent } from '@bigtest/interactor';

import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import { AccordionInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';

import { FullScreenFormInteractor } from '../full-screen-form';
import { ProfileTreeInteractor } from '../profile-tree-interactor';

class NewJobProfileInteractor extends FullScreenFormInteractor {
  isLoaded = isPresent('[name="description"]');
  nameField = new TextFieldInteractor('[data-test-name-field]');
  dataTypeField = new SelectInteractor('[data-test-accepted-data-types-field]');
  descriptionField = new TextAreaInteractor('[data-test-description-field]');
  profileTree = new ProfileTreeInteractor();
  overviewAccordion = new AccordionInteractor('[data-test-job-profile-overview]');
  summaryAccordion = new AccordionInteractor('#job-profile-summary');

  whenLoaded() {
    return this.when(() => this.isLoaded).timeout(5000);
  }
}

export const jobProfileForm = new NewJobProfileInteractor('[data-test-full-screen-form]');
