import { AccordionSetInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import ExpandAllButtonInteractor from '@folio/stripes-components/lib/Accordion/tests/expand-all-button-interactor';

export class DetailsSection extends AccordionSetInteractor {
  expandAllButton = new ExpandAllButtonInteractor('#mapping-profiles-form [data-test-expand-all-button]');
}
