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
  addRow = scoped('[data-test-marc-table-add]', IconButtonInteractor);
  removeRow = scoped('[data-test-marc-table-remove]', IconButtonInteractor);
  isTrashDisabled = property('[data-test-marc-table-remove]', 'disabled');
  moveRowUp = scoped('[data-test-marc-table-arrow-up]', IconButtonInteractor);
  moveRowDown = scoped('[data-test-marc-table-arrow-down]', IconButtonInteractor);
  action = scoped('[data-test-marc-table-action]', SelectInteractor);
  tag = scoped('[data-test-marc-table-tag]', TextFieldInteractor);
  indicator1 = scoped('[data-test-marc-table-indicator1]', TextFieldInteractor);
  indicator2 = scoped('[data-test-marc-table-indicator2]', TextFieldInteractor);
  subfield = scoped('[data-test-marc-table-subfield]', TextFieldInteractor);
  subaction = scoped('[data-test-marc-table-subaction]', SelectInteractor);
  dataTextField = scoped('[data-test-marc-table-data-text]', TextAreaInteractor);
  dataFindField = scoped('[data-test-marc-table-data-find]', TextAreaInteractor);
  dataReplaceField = scoped('[data-test-marc-table-data-replace]', TextAreaInteractor);
  dataTagField = scoped('[data-test-marc-table-data-field]', TextFieldInteractor);
  position = scoped('[data-test-marc-table-position]', SelectInteractor);
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
