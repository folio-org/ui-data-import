import {
  interactor,
  scoped,
  isPresent,
} from '@bigtest/interactor';

import MultiColumnListInteractor from '@folio/stripes-components/lib/MultiColumnList/tests/interactor';
import ConfirmationModalInteractor from '@folio/stripes-components/lib/ConfirmationModal/tests/interactor';
import CalloutInteractor from '@folio/stripes-components/lib/Callout/tests/interactor';

import { ProfileTreeInteractor } from '../profile-tree-interactor';
import { ActionMenuInteractor } from '../action-menu-interactor';

@interactor class JobProfileDetailsInteractor {
  actionMenu = new ActionMenuInteractor();
  headline = scoped('[data-test-headline]');
  acceptedDataType = scoped('[data-test-accepted-data-type]');
  description = scoped('[data-test-description]');
  isTagsPresent = isPresent('[data-test-tags-accordion]');
  isOverviewPresent = isPresent('#job-profile-overview');
  profileTree = new ProfileTreeInteractor();
  jobsUsingThisProfile = new MultiColumnListInteractor('#jobs-using-this-profile');
  confirmationModal = new ConfirmationModalInteractor('#delete-job-profile-modal');
  runConfirmationModal = new ConfirmationModalInteractor('#run-job-profile-modal');
  callout = new CalloutInteractor();
}

export const jobProfileDetails = new JobProfileDetailsInteractor('#pane-job-profile-details');
