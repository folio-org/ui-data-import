import {
  collection,
  fillable,
  interactor,
  is,
  isPresent,
  property,
} from '@bigtest/interactor';

import SearchAndSortInteractor from '@folio/stripes-smart-components/lib/SearchAndSort/tests/interactor';
import SearchFieldInteractor from '@folio/stripes-components/lib/SearchField/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Selection/tests/interactor';
import { FILTERS } from '../../../src/routes/ViewAllLogs/constants';

@interactor
class Button {
  isButton = is('button');
  isDisabled = property('disabled');
}

@interactor
class FiltersInteractor {
  static defaultScope = '#pane-filter';

  labels = collection('[class*="labelArea---"]');
  hasErrorMessage = isPresent('[data-test-invalid-date]');
  fillDateOrderedStart = fillable(`#${FILTERS.DATE} input[name="startDate"]`);
  fillDateOrderedEnd = fillable(`#${FILTERS.DATE} input[name="endDate"]`);
  applyDateOrdered = new Button(`#${FILTERS.DATE} [data-test-apply-button]`);

  jobProfile = new SelectInteractor('[data-test-job-profiles-filter]');
  users = new SelectInteractor('[data-test-users-filter]');
}

class SearchAndSortPane extends SearchAndSortInteractor {
  resetButton = new Button('#clickable-reset-all');
  searchInput = new SearchFieldInteractor();
  filters = new FiltersInteractor();
}

export const searchAndSort = new SearchAndSortPane('[data-test-logs-list]');
