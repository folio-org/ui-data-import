import {
  interactor,
  collection,
} from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

import { CheckboxInteractor } from './checkbox-interactor';

@interactor
export class AssociatedProfilesInteractor {
  checkBoxes = collection('[data-test-select-item]', CheckboxInteractor);
  links = collection('[data-test-profile-link]', ButtonInteractor);
  unlinkButtons = collection('[data-test-profile-unlink]', ButtonInteractor);
}
