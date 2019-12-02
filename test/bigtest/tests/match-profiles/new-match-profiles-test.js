import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';

import {
  matchProfiles,
  matchProfileForm,
} from '../../interactors';

async function setupFormSubmitErrorScenario(server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  server.post('/data-import-profiles/matchProfiles', () => new Response(status, headers, response));
  await matchProfileForm.nameField.fillAndBlur('Valid name');
  await matchProfileForm.descriptionField.fillAndBlur('Valid description');
  await matchProfileForm.submitFormButton.click();
}

describe('Match profile form', () => {
  setupApplication({ scenarios: ['fetch-match-profiles-success', 'fetch-users', 'fetch-tags'] });

  describe('appears', () => {
    beforeEach(async function () {
      this.visit('/settings/data-import/match-profiles');
      await matchProfiles.newMatchProfileButton.click();
      await matchProfileForm.whenLoaded();
    });

    it('upon click on new match profile button', () => {
      expect(matchProfileForm.isPresent).to.be.true;
    });
  });

  describe('when open', () => {
    beforeEach(async function () {
      this.visit('/settings/data-import/match-profiles?layer=create');
      await matchProfileForm.whenLoaded();
    });

    it('when not filled then the submit button is disabled', () => {
      expect(matchProfileForm.submitFormButtonDisabled).to.be.true;
    });

    describe('when filled correctly', () => {
      beforeEach(async () => {
        await matchProfileForm.nameField.fillAndBlur('Valid name');
        await matchProfileForm.descriptionField.fillAndBlur('Valid description');
      });

      it('the submit button is not disabled', () => {
        expect(matchProfileForm.submitFormButtonDisabled).to.be.false;
      });
    });

    describe('details accordion', () => {
      describe('"Record types select" component', () => {
        it('should render', () => {
          expect(matchProfileForm.recordTypesSelect.isPresent).to.be.true;
        });

        it('should show initial record select view', () => {
          expect(matchProfileForm.recordTypesSelect.initialRecord).to.be.true;
        });

        it('incoming record select has correct amount of items', () => {
          expect(matchProfileForm.recordTypesSelect.items().length).to.be.equal(8);
        });

        describe('when incoming record is selected', () => {
          beforeEach(async () => {
            await matchProfileForm.recordTypesSelect.select('ITEM');
          });

          it('should show compare record select view', () => {
            expect(matchProfileForm.recordTypesSelect.initialRecord).to.be.false;
            expect(matchProfileForm.recordTypesSelect.compareRecord).to.be.true;
          });

          it('then choose record to compare screen appears', () => {
            expect(matchProfileForm.recordTypesSelect.isPresent).to.be.true;
          });
        });
      });

      describe('"Match criterion" component', () => {
        it('should render', () => {
          expect(matchProfileForm.matchCriteria.isPresent).to.be.true;
        });

        describe('"MARC field in incoming record" section', () => {
          describe('when not filled', () => {
            it('should have empty "Field" input', () => {
              expect(matchProfileForm.matchCriteria.inputMain.val).to.be.equal('');
            });

            it('should have empty "In.1" input', () => {
              expect(matchProfileForm.matchCriteria.inputIn1.val).to.be.equal('');
            });

            it('should have empty "In.2" input', () => {
              expect(matchProfileForm.matchCriteria.inputIn2.val).to.be.equal('');
            });

            it('should have empty "Subfield" input', () => {
              expect(matchProfileForm.matchCriteria.inputSubfield.val).to.be.equal('');
            });
          });
        });

        describe('"Match criterion" section', () => {
          it('should render', () => {
            expect(matchProfileForm.matchCriteria.matchCriterionSection.isPresent).to.be.true;
          });

          it('should have a dropdown', () => {
            expect(matchProfileForm.matchCriteria.matchCriterionSection.dropdown.isPresent).to.be.true;
          });
        });
      });
    });
  });
});

describe('When match profile form', () => {
  setupApplication();

  beforeEach(async function () {
    this.visit('/settings/data-import/match-profiles?layer=create');
    await matchProfileForm.whenLoaded();
  });

  describe('is submitted and the response contains', () => {
    describe('error message', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server, {
          response: { errors: [{ message: 'matchProfile.duplication.invalid' }] },
          status: 422,
        });
      });

      it('then error callout appears', () => {
        expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe('network error', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server);
      });

      it('then error callout appears', () => {
        expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });
});
