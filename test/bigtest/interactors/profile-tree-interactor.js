import {
  collection,
  count,
  text,
  isPresent,
  clickable,
  attribute,
  interactor,
} from '@bigtest/interactor';

import Button from '@folio/stripes-components/lib/Button/tests/interactor';

@interactor
class ProfileLinkerInteractor {
  tooltipText = text('#linker-tooltip-text');
  isOpen = attribute('[aria-haspopup]', 'aria-expanded');
  options = collection('[data-test-plugin-find-record-button]');
  optionsCount = count('[data-test-plugin-find-record-button]');
  clickLinker = clickable('[aria-haspopup]');
  addMatchButton = new Button('[id^="matchProfiles-plugin-button-"]');
  addActionButton = new Button('[id^="actionProfiles-plugin-button-"]');
}

@interactor
class SubSection {
  hasSubBranches = isPresent('[class*="branch-tree-container---"]');
  branches = collection('div[class^=profile-tree-container---] > [data-test-profile-branch]');
  branchesCount = count('[data-test-profile-branch]');
  plusSignButton = new ProfileLinkerInteractor('[data-test-plus-sign-button]');
}

@interactor
class ProfileBranchInteractor {
  hasSubBranches = isPresent('[class*="branch-tree-container---"]');
  matchesSection = new SubSection('[id^="accordion-match-"]');
  nonMatchesSection = new SubSection('[id^="accordion-non-match-"]');
}

@interactor
export class ProfileTreeInteractor {
  static defaultScope = '[class*=profile-tree---]';

  branches = collection('div[class^=profile-tree-container---] > [data-test-profile-branch]', ProfileBranchInteractor);
  rootBranchesCount = count('div[class^=profile-tree-container---] > [data-test-profile-branch]');
  allBranchesCount = count('[data-test-profile-branch]');
  plusSignButton = new ProfileLinkerInteractor('[data-test-plus-sign-button]');
}
