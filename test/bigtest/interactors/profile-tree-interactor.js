import {
  collection,
  count,
  text,
  isPresent,
  clickable,
  attribute,
  interactor,
} from '@bigtest/interactor';

@interactor
class ProfileBranchInteractor {
  hasSubBranches = isPresent('[class*="branch-tree-container---"]');
  subBranchesCount = count('[class*="branch-tree-container---"]');
  hasForMatchesSection = isPresent('[data-test-for-matches-section]');
  hasForNonMatchesSection = isPresent('[data-test-for-non-matches-section]');
}

@interactor
class ProfileLinkerInteractor {
  tooltipText = text('#linker-tooltip-text');
  isOpen = attribute('[aria-haspopup]', 'aria-expanded');
  clickLinker = clickable('[aria-haspopup]');
}

@interactor
export class ProfileTreeInteractor {
  static defaultScope = '[class*=profile-tree---]';

  branches = collection('[data-test-profile-branch]', ProfileBranchInteractor);
  branchesCount = count('[data-test-profile-branch]');
  plusSignButton = new ProfileLinkerInteractor('[data-test-plus-sign-button]');
}
