import {
  interactor,
  isPresent,
  count,
  collection,
  text,
  property,
} from '@bigtest/interactor';

import IconButtonInteractor from '@folio/stripes-components/lib/IconButton/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';

@interactor
class MARCTableHeaderInteractor {
  content = text();
}

@interactor
class MARCTableCellInteractor {
  arrowUp = new IconButtonInteractor('[data-test-marc-table-arrow-up]');
  arrowDown = new IconButtonInteractor('[data-test-marc-table-arrow-down]');
  action = new SelectInteractor('[data-test-marc-table-action]');
  tag = new SelectInteractor('[data-test-marc-table-tag]');
  indicator1 = new SelectInteractor('[data-test-marc-table-indicator1]');
  indicator2 = new SelectInteractor('[data-test-marc-table-indicator2]');
  subfield = new SelectInteractor('[data-test-marc-table-subfield]');
  subaction = new SelectInteractor('[data-test-marc-table-subaction]');
  position = new SelectInteractor('[data-test-marc-table-position]');
  dataFindField = new TextAreaInteractor('[data-test-marc-table-data-find]');
  dataReplaceField = new TextAreaInteractor('[data-test-marc-table-data-replace]');
  addRow = new IconButtonInteractor('[data-test-marc-table-add]');
  removeRow = new IconButtonInteractor('[data-test-marc-table-remove]');

  hasContent() {
    return this.$root?.childNodes?.length !== 0;
  }
}

@interactor
class MARCTableRowInteractor {
  cells = collection('[data-test-marc-table-cell]', MARCTableCellInteractor);
  addRow = new IconButtonInteractor('[data-test-marc-table-add]');
  removeRow = new IconButtonInteractor('[data-test-marc-table-remove]');
  isTrashDisabled = property('[data-test-marc-table-remove]', 'disabled');
}

@interactor
export class MARCTableInteractor {
  tablePresent = isPresent('[data-test-marc-table]');
  rowCount = count('[data-test-marc-table-row]');
  columnCount = count('[data-test-marc-table-column-header]');
  rows = collection('[data-test-marc-table-row]', MARCTableRowInteractor);
  headers = collection('[data-test-marc-table-column-header]', MARCTableHeaderInteractor);
}
