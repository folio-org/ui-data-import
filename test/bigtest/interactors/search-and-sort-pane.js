/* eslint-disable max-classes-per-file */
import {
  collection,
  fillable,
  interactor,
  is,
  isPresent,
  property,
  text,
  hasClass,
  clickable,
} from '@bigtest/interactor';

import SearchAndSortInteractor from '@folio/stripes-smart-components/lib/SearchAndSort/tests/interactor';
import SearchFieldInteractor from '@folio/stripes-components/lib/SearchField/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Selection/tests/interactor';
import css from '@folio/stripes-components/lib/Accordion/Accordion.css';

import { FILTERS } from '../../../src/routes/ViewAllLogs/constants';

@interactor
class Button {
  isButton = is('button');
  isDisabled = property('disabled');
}

@interactor
class FilterInteractor {
  static defaultScope = '[data-test-accordion-section]';

  label = text(`.${css.labelArea}`);
  isOpen = hasClass(`.${css.content}`, css.expanded);
  clickHeader = clickable('[id*="accordion-toggle-button-"]');
}

@interactor
class FiltersInteractor {
  static defaultScope = '[data-test-filter-logs]';

  items = collection('section', FilterInteractor);

  hasErrorMessage = isPresent('[data-test-invalid-date]');
  fillStartDate = fillable(`#${FILTERS.DATE} input[name="startDate"]`);
  fillEndDate = fillable(`#${FILTERS.DATE} input[name="endDate"]`);
  applyDateButton = new Button(`#${FILTERS.DATE} [data-test-apply-button]`);

  jobProfile = new SelectInteractor('[data-test-job-profiles-filter]');
  users = new SelectInteractor('[data-test-users-filter]');
}

class SearchAndSortPane extends SearchAndSortInteractor {
  resetButton = new Button('#clickable-reset-all');
  searchField = new SearchFieldInteractor();
  filters = new FiltersInteractor();
}

export const searchAndSort = new SearchAndSortPane('[data-test-logs-list]');
