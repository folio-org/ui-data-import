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
import TextFieldInteractor from '@folio/stripes-components/lib/TextField/tests/interactor';
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

class MARCTableRowBaseInteractor {
  cells = collection('[data-test-marc-table-cell]', MARCTableCellInteractor);
  addRow = new IconButtonInteractor('[data-test-marc-table-add]');
  removeRow = new IconButtonInteractor('[data-test-marc-table-remove]');
  isTrashDisabled = property('[data-test-marc-table-remove]', 'disabled');
  moveRowUp = new IconButtonInteractor('[data-test-marc-table-arrow-up]');
  moveRowDown = new IconButtonInteractor('[data-test-marc-table-arrow-down]');
  action = new SelectInteractor('[data-test-marc-table-action]');
  tag = new TextFieldInteractor('[data-test-marc-table-tag]');
  indicator1 = new TextFieldInteractor('[data-test-marc-table-indicator1]');
  indicator2 = new TextFieldInteractor('[data-test-marc-table-indicator2]');
  subfield = new TextFieldInteractor('[data-test-marc-table-subfield]');
  subaction = new SelectInteractor('[data-test-marc-table-subaction]');
  dataTextField = new TextAreaInteractor('[data-test-marc-table-data-text]');
  dataFindField = new TextAreaInteractor('[data-test-marc-table-data-find]');
  dataReplaceField = new TextAreaInteractor('[data-test-marc-table-data-replace]');
  dataTagField = new TextFieldInteractor('[data-test-marc-table-data-field]');
  position = new SelectInteractor('[data-test-marc-table-position]');
}

@interactor
class MARCTableSubfieldsRowInteractor extends MARCTableRowBaseInteractor {}

@interactor
class MARCTableRowInteractor extends MARCTableRowBaseInteractor {
  subfields = collection('[data-test-marc-subfield-row]', MARCTableSubfieldsRowInteractor);
  subfieldsCount = count('[data-test-marc-subfield-row]');
}

@interactor
export class MARCTableInteractor {
  tablePresent = isPresent('[data-test-marc-table]');
  rowCount = count('[data-test-marc-table-row]');
  columnCount = count('[data-test-marc-table-column-header]');
  rows = collection('[data-test-marc-table-row]', MARCTableRowInteractor);
  headers = collection('[data-test-marc-table-column-header]', MARCTableHeaderInteractor);
}
