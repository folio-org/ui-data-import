import {
  interactor,
  isPresent,
  count,
  collection,
  text,
  property,
  scoped,
} from '@bigtest/interactor';

import IconButtonInteractor from '@folio/stripes-components/lib/IconButton/tests/interactor';
import SelectInteractor from '@folio/stripes-components/lib/Select/tests/interactor';
import TextFielInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
import TextAreaInteractor from '@folio/stripes-components/lib/TextArea/tests/interactor';

@interactor
class MARCTableHeaderInteractor {
  content = text();
}

@interactor
class MARCTableCellInteractor {
  hasContent() {
    return this.$root?.childNodes?.length !== 0;
  }
}

@interactor
class MARCTableRowInteractor {
  cells = collection('[data-test-marc-table-cell]', MARCTableCellInteractor);
  addRow = scoped('[data-test-marc-table-add]', IconButtonInteractor);
  removeRow = scoped('[data-test-marc-table-remove]', IconButtonInteractor);
  isTrashDisabled = property('[data-test-marc-table-remove]', 'disabled');
  moveRowUp = scoped('[data-test-marc-table-arrow-up]', IconButtonInteractor);
  moveRowDown = scoped('[data-test-marc-table-arrow-down]', IconButtonInteractor);
  action = scoped('[data-test-marc-table-action]', SelectInteractor);
  tag = scoped('[data-test-marc-table-tag]', TextFielInteractor);
  indicator1 = scoped('[data-test-marc-table-indicator1]', TextFielInteractor);
  indicator2 = scoped('[data-test-marc-table-indicator2]', TextFielInteractor);
  subfield = scoped('[data-test-marc-table-subfield]', TextFielInteractor);
  subaction = scoped('[data-test-marc-table-subaction]', SelectInteractor);
  dataTextField = scoped('[data-test-marc-table-data-text]', TextAreaInteractor);
  dataFindField = scoped('[data-test-marc-table-data-find]', TextAreaInteractor);
  dataReplaceField = scoped('[data-test-marc-table-data-replace]', TextAreaInteractor);
  position = scoped('[data-test-marc-table-position]', SelectInteractor);
}

@interactor
export class MARCTableInteractor {
  tablePresent = isPresent('[data-test-marc-table]');
  rowCount = count('[data-test-marc-table-row]');
  columnCount = count('[data-test-marc-table-column-header]');
  rows = collection('[data-test-marc-table-row]', MARCTableRowInteractor);
  headers = collection('[data-test-marc-table-column-header]', MARCTableHeaderInteractor);
}
