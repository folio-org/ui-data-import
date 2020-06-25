import { AccordionSetInteractor } from '@folio/stripes-components/lib/Accordion/tests/interactor';
import ExpandAllButtonInteractor from '@folio/stripes-components/lib/Accordion/tests/expand-all-button-interactor';

import { MappedHeaderInteractor } from '../../mapped-header-interactor';

export class DetailsSection extends AccordionSetInteractor {
  header = new MappedHeaderInteractor('#mapping-profiles-form');
  expandAllButton = new ExpandAllButtonInteractor('#mapping-profiles-form [data-test-expand-all-button]');
}
