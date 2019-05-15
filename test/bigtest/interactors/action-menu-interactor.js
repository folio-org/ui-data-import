import { interactor } from '@bigtest/interactor';

import ButtonInteractor from '@folio/stripes-components/lib/Button/tests/interactor';

@interactor
export class ActionMenuInteractor {
  newJobProfileButton = new ButtonInteractor('[data-test-new-item-menu-button]');
  exportSelectedButton = new ButtonInteractor('[data-test-export-selected-items-menu-button]');
  selectAllButton = new ButtonInteractor('[data-test-select-all-items-menu-button]');
  deselectAllButton = new ButtonInteractor('[data-test-deselect-all-items-menu-button]');
}
