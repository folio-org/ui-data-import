import {
  interactor,
  property,
} from '@bigtest/interactor';

import SearchAndSortInteractor from '@folio/stripes-smart-components/lib/SearchAndSort/tests/interactor';
import SearchFieldInteractor from '@folio/stripes-components/lib/SearchField/tests/interactor';

@interactor
class ResetAllButton {
  isDisabled = property('disabled');
}

class SearchAndSortPane extends SearchAndSortInteractor {
  resetButton = new ResetAllButton('#clickable-reset-all');
  searchInput = new SearchFieldInteractor();
}

export const searchAndSort = new SearchAndSortPane('[data-test-logs-list]');
