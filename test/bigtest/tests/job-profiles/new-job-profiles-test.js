import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';
import {
  jobProfiles,
  jobProfileForm,
} from '../../interactors';
import translations from '../../../../translations/ui-data-import/en';

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
  setupApplication({ scenarios: ['fetch-job-profiles-success', 'fetch-users', 'fetch-tags', 'tags-enabled'] });

  describe('appears', () => {
    beforeEach(async function () {
      this.visit('/settings/data-import/job-profiles');
      await jobProfiles.newJobProfileButton.click();
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
          expect(jobProfileForm.profileTree.branchesCount).to.be.equal(0);
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
