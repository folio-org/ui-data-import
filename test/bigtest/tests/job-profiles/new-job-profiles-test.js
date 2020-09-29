import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';
import { Response } from 'miragejs';

import { setupApplication } from '../../helpers';
import {
  jobProfiles,
  jobProfileForm,
  ProfileBranchInteractor,
} from '../../interactors';
import { snapshotWrappers } from '../../mocks/job-profiles-child-wrappers';
import translations from '../../../../translations/ui-data-import/en';

const getProfileSnapshot = withChildren => (schema, request) => {
  const { params: { id } } = request;

  return {
    profileId: id,
    contentType: 'MATCH_PROFILE',
    childSnapshotWrappers: withChildren ? snapshotWrappers[0].childSnapshotWrappers : [],
    content: {
      id,
      name: 'Test match profile',
    },
  };
};

async function setupFormSubmitErrorScenario(server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  server.post('/data-import-profiles/jobProfiles', () => new Response(status, headers, response));
  await jobProfileForm.nameField.fillAndBlur('Valid name');
  await jobProfileForm.dataTypeField.selectAndBlur('MARC');
  await jobProfileForm.submitFormButton.click();
}

describe('Job profile form', () => {
  setupApplication({ scenarios: ['fetch-job-profiles-success', 'fetch-profile-snapshot-success', 'fetch-users', 'fetch-tags', 'tags-enabled'] });

  describe('appears', () => {
    beforeEach(async function () {
      this.visit('/settings/data-import/job-profiles');
      await jobProfiles.actionMenu.click();
      await jobProfiles.actionMenu.newProfileButton.click();
    });

    it('upon click on new job profile button', () => {
      expect(jobProfileForm.isPresent).to.be.true;
    });
  });

  describe('when open', () => {
    beforeEach(function () {
      this.visit('/settings/data-import/job-profiles?layer=create');
    });

    it('when not filled then the submit button is disabled', () => {
      expect(jobProfileForm.submitFormButtonDisabled).to.be.true;
    });

    describe('when filled correctly', () => {
      beforeEach(async () => {
        await jobProfileForm.nameField.fillAndBlur('Valid name');
        await jobProfileForm.dataTypeField.selectAndBlur('MARC');
        await jobProfileForm.descriptionField.fillAndBlur('Valid description');
      });

      it('the submit button is not disabled', () => {
        expect(jobProfileForm.submitFormButtonDisabled).to.be.false;
      });
    });
  });
});

describe('When job profile form', () => {
  setupApplication();

  beforeEach(async function () {
    this.visit('/settings/data-import/job-profiles?layer=create');
  });

  describe('is open', () => {
    describe('Summary section', () => {
      it('is present', () => {
        expect(jobProfileForm.summaryAccordion.isPresent).to.be.true;
      });
    });

    describe('Overview section', () => {
      it('is present', () => {
        expect(jobProfileForm.overviewAccordion.isPresent).to.be.true;
      });

      describe('when there is no associated match or action profile', () => {
        it('then profile tree is empty', () => {
          expect(jobProfileForm.profileTree.rootBranchesCount).to.be.equal(0);
        });

        it('there is plus sign button', () => {
          expect(jobProfileForm.profileTree.plusSignButton.isPresent).to.be.true;
        });

        it('followed by a "Click here to get started" message', () => {
          expect(jobProfileForm.profileTree.plusSignButton.tooltipText).to.be.equal(translations['settings.getStarted']);
        });

        describe('when the plus sign is clicked', () => {
          beforeEach(async () => {
            await jobProfileForm.profileTree.plusSignButton.clickLinker();
          });

          it('then display options to pick a profile', () => {
            expect(jobProfileForm.profileTree.plusSignButton.isOpen).to.be.equal('true');
          });

          it('and there are two options', () => {
            expect(jobProfileForm.profileTree.plusSignButton.optionsCount).to.be.equal(2);
          });
        });

        describe('when add Match profile', () => {
          describe('without children', () => {
            beforeEach(async function () {
              this.server.get('/data-import-profiles/profileSnapshots/:id', getProfileSnapshot(false));
              await sessionStorage.clear();
              await jobProfileForm.profileTree.plusSignButton.addMatchButton.click();
            });

            it('match profile appears', () => {
              expect(jobProfileForm.profileTree.rootBranchesCount).to.be.equal(1);
            });

            it('has "For matches" section', () => {
              expect(jobProfileForm.profileTree.branches(0).matchesSection.isPresent).to.be.true;
            });

            it('has "For non-matches" section', () => {
              expect(jobProfileForm.profileTree.branches(0).nonMatchesSection.isPresent).to.be.true;
            });

            it('does not have initial filled sub-branches', () => {
              expect(jobProfileForm.profileTree.branches(0).matchesSection.hasSubBranches).to.be.false;
            });
          });

          describe('with children', () => {
            beforeEach(async function () {
              this.server.get('/data-import-profiles/profileSnapshots/:id', getProfileSnapshot(true));
              await jobProfileForm.profileTree.plusSignButton.addMatchButton.click();
            });

            it('match profile appears', () => {
              expect(jobProfileForm.profileTree.rootBranchesCount).to.be.equal(1);
            });

            it('has "For matches" section', () => {
              expect(jobProfileForm.profileTree.branches(0).matchesSection.isPresent).to.be.true;
            });

            it('has "For non-matches" section', () => {
              expect(jobProfileForm.profileTree.branches(0).nonMatchesSection.isPresent).to.be.true;
            });

            it('has initial filled sub-branches', () => {
              expect(jobProfileForm.profileTree.branches(0).matchesSection.hasSubBranches).to.be.true;
            });
          });
        });

        describe('when add Action profile', () => {
          beforeEach(async function () {
            this.server.get('/data-import-profiles/profileSnapshots/:id', getProfileSnapshot(false));
            await sessionStorage.clear();
            await jobProfileForm.profileTree.plusSignButton.addActionButton.click();
          });

          it('action profile appears', () => {
            expect(jobProfileForm.profileTree.rootBranchesCount).to.be.equal(1);
          });

          it('does not have sub-branches', () => {
            expect(jobProfileForm.profileTree.branches(0).hasSubBranches).to.be.equal(false);
          });

          describe('when click linker button', () => {
            beforeEach(async () => {
              await jobProfileForm.profileTree.plusSignButton.clickLinker();
            });

            it('additional Match profiles can not be attached', () => {
              expect(jobProfileForm.profileTree.plusSignButton.isMatchOptionDisabled).to.be.true;
            });
          });
        });

        describe('when add to "For matches" section', () => {
          beforeEach(async function () {
            this.server.get('/data-import-profiles/profileSnapshots/:id', getProfileSnapshot(false));
            await sessionStorage.clear();
            await jobProfileForm.profileTree.plusSignButton.addMatchButton.click();
          });

          describe('Action profile', () => {
            beforeEach(async () => {
              await sessionStorage.clear();
              await jobProfileForm.profileTree.branches(0).matchesSection.plusSignButton.clickLinker();
              await jobProfileForm.profileTree.branches(0).matchesSection.plusSignButton.addActionButton.click();
            });

            it('added', () => {
              expect(jobProfileForm.profileTree.branches(0).matchesSection.branchesCount).to.be.equal(1);
            });

            it('to proper section', () => {
              expect(jobProfileForm.profileTree.rootBranchesCount).to.be.equal(1);
              expect(jobProfileForm.profileTree.allBranchesCount).to.be.equal(2);
            });

            it('does not have sub-branches', () => {
              const actionProfile = new ProfileBranchInteractor('[data-test-profile-branch] > [data-test-profile-branch]');

              expect(actionProfile.hasSubBranches).to.be.false;
            });
          });

          describe('Match profile', () => {
            beforeEach(async () => {
              await sessionStorage.clear();
              await jobProfileForm.profileTree.branches(0).matchesSection.plusSignButton.clickLinker();
              await jobProfileForm.profileTree.branches(0).matchesSection.plusSignButton.addMatchButton.click();
            });

            it('added', () => {
              expect(jobProfileForm.profileTree.branches(0).matchesSection.branchesCount).to.be.equal(1);
            });

            it('to proper section', () => {
              expect(jobProfileForm.profileTree.rootBranchesCount).to.be.equal(1);
              expect(jobProfileForm.profileTree.allBranchesCount).to.be.equal(2);
            });

            it('has sub-branches', () => {
              const matchProfile = new ProfileBranchInteractor('[data-test-profile-branch] > [data-test-profile-branch]');

              expect(matchProfile.matchesSection.isPresent).to.be.true;
              expect(matchProfile.nonMatchesSection.isPresent).to.be.true;
            });
          });
        });
      });
    });
  });

  describe('is submitted and the response contains', () => {
    describe('error message', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server, {
          response: { errors: [{ message: 'jobProfile.duplication.invalid' }] },
          status: 422,
        });
      });

      it('then error callout appears', () => {
        expect(jobProfileForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe('unparsed data', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server, {
          response: '',
          status: 422,
        });
      });

      it('then error callout appears', () => {
        expect(jobProfileForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe('error without body', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server, {
          response: null,
          status: 422,
        });
      });

      it('then error callout appears', () => {
        expect(jobProfileForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe('non json error', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server, {
          response: null,
          status: 422,
          headers: { 'Content-Type': 'text/plain' },
        });
      });

      it('then error callout appears', () => {
        expect(jobProfileForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe('network error', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server);
      });

      it('then error callout appears', () => {
        expect(jobProfileForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });
});
