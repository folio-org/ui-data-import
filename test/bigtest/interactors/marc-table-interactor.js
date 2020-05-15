import {
  interactor,
  isPresent,
  count,
  collection,
  text,
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
  hasContent = isPresent('*:last-child:not([data-test-marc-table-cell])');
  action = new SelectInteractor('[data-test-marc-table-action]');
  tag = new SelectInteractor('[data-test-marc-table-tag]');
  in1 = new SelectInteractor('[data-test-marc-table-in1]');
  in2 = new SelectInteractor('[data-test-marc-table-in2]');
  subfield = new SelectInteractor('[data-test-marc-table-subfield]');
  subaction = new SelectInteractor('[data-test-marc-table-subaction]');
  position = new SelectInteractor('[data-test-marc-table-position]');
  dataFindField = new TextAreaInteractor('[data-test-marc-table-data-find]');
  dataReplaceField = new TextAreaInteractor('[data-test-marc-table-data-replace]');
  addRow = new IconButtonInteractor('[data-test-marc-table-add]');
  removeRow = new IconButtonInteractor('[data-test-marc-table-remove]');
}

@interactor
class MARCTableRowInteractor {
  cells = collection('[data-test-marc-table-cell]', MARCTableCellInteractor);
}

@interactor
export class MARCTableInteractor {
  tablePresent = isPresent('[data-test-marc-table]');
  rowCount = count('[data-test-marc-table-row]');
  columnCount = count('[data-test-marc-table-column-header]');
  rows = collection('[data-test-marc-table-row]', MARCTableRowInteractor);
  headers = collection('[data-test-marc-table-column-header]', MARCTableHeaderInteractor);
}
