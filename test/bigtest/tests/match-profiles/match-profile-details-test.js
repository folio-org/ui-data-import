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
  jobProfileDetails,
  matchProfileDetails,
} from '../../interactors';
import { noAssociatedJobProfiles } from '../../mocks';

async function setupFormSubmitErrorScenario(method, server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  const url = `/data-import-profiles/matchProfiles${method === 'put' ? '/:id' : ''}`;

  server[method](url, () => new Response(status, headers, response));
  await matchProfileForm.nameField.fillAndBlur('Changed title');
  await matchProfileForm.submitFormButton.click();
  if (await matchProfileForm.confirmEditModal.isPresent) {
    await matchProfileForm.confirmEditModal.confirmButton.click();
  }
}

describe('Match Profile View', () => {
  setupApplication({ scenarios: ['fetch-match-profiles-success', 'fetch-users', 'fetch-tags', 'tags-enabled'] });

  beforeEach(async function () {
    this.visit('/settings/data-import/match-profiles');
    await matchProfiles.list.rows(0).click();
    await matchProfileForm.whenLoaded();
  });

  it('has correct name', () => {
    expect(matchProfileDetails.headline.text).to.be.equal('001 to Instance HRID');
  });

  it('has correct description', () => {
    expect(matchProfileDetails.description.text).to.be.equal('MARC 001 to Instance ID (numerics only)');
  });

  it('display tags accordion', () => {
    expect(matchProfileDetails.isTagsPresent).to.be.true;
  });

  it('upon click on row', () => {
    expect(matchProfileDetails.isPresent).to.be.true;
  });

  describe('associated job profiles', () => {
    describe('when there are associated profiles', () => {
      it('has correct amount of items', () => {
        expect(matchProfileDetails.associatedJobProfiles.list.rowCount).to.be.equal(3);
      }).timeout(5000);

      describe('has select all checkbox', () => {
        beforeEach(async () => {
          await matchProfileDetails.associatedJobProfiles.selectAllCheckBox.clickAndBlur();
        });

        it('upon click changes its state', () => {
          expect(matchProfileDetails.associatedJobProfiles.selectAllCheckBox.isChecked).to.be.true;
        });

        it('selects all items', () => {
          matchProfileDetails.associatedJobProfiles.checkBoxes().forEach(checkBox => {
            expect(checkBox.isChecked).to.be.true;
          });
        });

        describe('when not all records are selected', () => {
          beforeEach(async () => {
            await matchProfileDetails.associatedJobProfiles.checkBoxes(0).clickAndBlur();
          });

          it('becomes unchecked', () => {
            expect(matchProfileDetails.associatedJobProfiles.selectAllCheckBox.isChecked).to.be.false;
          });
        });

        describe('when clicked again', () => {
          beforeEach(async () => {
            await matchProfileDetails.associatedJobProfiles.selectAllCheckBox.clickAndBlur();
          });

          it('all items become unchecked', () => {
            matchProfileDetails.associatedJobProfiles.checkBoxes().forEach(checkBox => {
              expect(checkBox.isChecked).to.be.false;
            });
          });
        });
      });

      describe('has select individual item checkbox', () => {
        beforeEach(async () => {
          await matchProfileDetails.associatedJobProfiles.checkBoxes(0).clickAndBlur();
        });

        it('upon click changes its state', () => {
          expect(matchProfileDetails.associatedJobProfiles.checkBoxes(0).isChecked).to.be.true;
        });
      });

      describe('when job profile name is clicked', () => {
        beforeEach(async () => {
          await matchProfileDetails.associatedJobProfiles.links(0).click();
        });

        it('redirects to job profile details', () => {
          expect(jobProfileDetails.isPresent).to.be.true;
        });
      });
    });

    describe('when there are no associated profiles', () => {
      beforeEach(async function () {
        await matchProfiles.list.rows(1).click();
      });

      it('renders empty message', () => {
        expect(matchProfileDetails.associatedJobProfiles.list.displaysEmptyMessage).to.be.true;
      });
    });
  });

  describe('details section', () => {
    it('renders', () => {
      expect(matchProfileDetails.detailsAccordion.isPresent).to.be.true;
    });

    it('is open by default', () => {
      expect(matchProfileDetails.detailsAccordion.isOpen).to.be.true;
    });

    it('has "Record type select" component', () => {
      expect(matchProfileDetails.recordTypesSelect.isPresent).to.be.true;
    });

    it('"Record type select" component has correct compare record value', () => {
      expect(matchProfileDetails.recordTypesSelect.compareRecordValue).to.be.equal('INSTANCE');
    });

    it('has "Match criteria" component', () => {
      expect(matchProfileDetails.matchCriteria.isPresent).to.be.true;
    });

    describe('"Match criteria" component', () => {
      it('is open by default', () => {
        expect(matchProfileDetails.matchCriteria.isOpen).to.be.true;
      });

      describe('"Incoming record" section', () => {
        it('has correct label', () => {
          expect(matchProfileDetails.matchCriteria.incomingRecord.label).to.be.equal('Incoming MARC Bibliographic record');
        });

        it('has correct length of sections', () => {
          expect(matchProfileDetails.matchCriteria.incomingRecordSections.children().length).to.be.equal(3);
        });

        it('sections are not optional', () => {
          matchProfileDetails.matchCriteria.incomingRecordSections.children().forEach(section => {
            expect(section.hasCheckbox).to.be.false;
          });
        });

        describe('"Incoming record field in incoming record" section', () => {
          it('has correct label', () => {
            expect(matchProfileDetails.matchCriteria.incomingRecordSections.children(0).label).to.be.equal('MARC Bibliographic field in incoming record');
          });

          it('has correct main field value', () => {
            expect(matchProfileDetails.matchCriteria.fieldMain.value.text).to.be.equal('001');
          });

          it('has empty In1 field value', () => {
            expect(matchProfileDetails.matchCriteria.fieldIn1.value.text).to.be.equal('-');
          });

          it('has empty In2 field value', () => {
            expect(matchProfileDetails.matchCriteria.fieldIn2.value.text).to.be.equal('-');
          });

          it('has correct subfield field value', () => {
            expect(matchProfileDetails.matchCriteria.fieldSubfield.value.text).to.be.equal('a');
          });
        });

        describe('"Use a qualifier" section', () => {
          it('has correct label', () => {
            expect(matchProfileDetails.matchCriteria.incomingRecordSections.children(1).label).to.be.equal('Use a qualifier');
          });

          it('content is hidden', () => {
            expect(matchProfileDetails.matchCriteria.incomingRecordSections.children(1).hasContent).to.be.false;
          });
        });

        describe('"Only compare part of the value" section', () => {
          it('has correct label', () => {
            expect(matchProfileDetails.matchCriteria.incomingRecordSections.children(2).label).to.be.equal('Only compare part of the value');
          });

          it('content is visible', () => {
            expect(matchProfileDetails.matchCriteria.incomingRecordSections.children(2).hasContent).to.be.true;
          });
        });
      });

      describe('"Match criterion" section', () => {
        it('has correct label', () => {
          expect(matchProfileDetails.matchCriteria.matchCriterion.label).to.be.equal('Match criterion');
        });

        it('has correct match criterion field value', () => {
          expect(matchProfileDetails.matchCriteria.matchCriterionField.value.text).to.be.equal('Exactly matches');
        });
      });

      describe('"Existing instance record" section', () => {
        it('has correct label', () => {
          expect(matchProfileDetails.matchCriteria.existingRecord.label).to.be.equal('Existing Instance record');
        });

        it('has correct length of sections', () => {
          expect(matchProfileDetails.matchCriteria.existingRecordSections.children().length).to.be.equal(3);
        });

        it('sections are not optional', () => {
          matchProfileDetails.matchCriteria.existingRecordSections.children().forEach(section => {
            expect(section.hasCheckbox).to.be.false;
          });
        });

        describe('"Existing instance record field" section', () => {
          it('has correct label', () => {
            expect(matchProfileDetails.matchCriteria.existingRecordSections.children(0).label).to.be.equal('Existing Instance record field');
          });
        });

        describe('"Use a qualifier section" section', () => {
          it('has correct label', () => {
            expect(matchProfileDetails.matchCriteria.existingRecordSections.children(1).label).to.be.equal('Use a qualifier');
          });

          it('content is hidden', () => {
            expect(matchProfileDetails.matchCriteria.existingRecordSections.children(1).hasContent).to.be.false;
          });
        });

        describe('"Only compare part of the value"', () => {
          it('has correct label', () => {
            expect(matchProfileDetails.matchCriteria.existingRecordSections.children(2).label).to.be.equal('Only compare part of the value');
          });

          it('content is visible', () => {
            expect(matchProfileDetails.matchCriteria.existingRecordSections.children(2).hasContent).to.be.true;
          });
        });
      });
    });
  });

  describe('edit match profile form', () => {
    // TODO: Fix it in UIDATIMP-395
    describe.skip('appears', () => {
      beforeEach(async () => {
        await matchProfileDetails.expandPaneHeaderDropdown();
        await matchProfileDetails.dropdownEditButton.click();
      });

      it('upon click on pane header menu edit button', () => {
        expect(matchProfileForm.isPresent).to.be.true;
      });
    });

    describe('appears', () => {
      beforeEach(async () => {
        await matchProfileDetails.editButton.click();
      });

      it('upon click on edit button', () => {
        expect(matchProfileForm.isPresent).to.be.true;
      });
    });
  });

  describe('edit match profile form', () => {
    beforeEach(async () => {
      await matchProfiles.list.rows(1).click();
      await matchProfileDetails.editButton.click();
      await matchProfileForm.whenLoaded();
    });

    describe('when form is submitted', () => {
      beforeEach(async () => {
        await matchProfileForm.nameField.fillAndBlur('Changed name');
        await matchProfileForm.descriptionField.fillAndBlur('Changed description');
        await matchProfileForm.submitFormButton.click();
      });

      it('then match profile details renders updated match profile', () => {
        expect(matchProfileDetails.headline.text).to.equal('Changed name');
        expect(matchProfileDetails.description.text).to.equal('Changed description');
      });
    });

    describe('is submitted and the response contains', () => {
      describe('error message', () => {
        beforeEach(async function () {
          await setupFormSubmitErrorScenario('put', this.server, {
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
          await setupFormSubmitErrorScenario('put', this.server);
        });

        it('then error callout appears', () => {
          expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
        });
      });
    });
  });

  // TODO: Fix it in UIDATIMP-395
  describe.skip('duplicate match profile form', () => {
    beforeEach(async () => {
      await matchProfileDetails.expandPaneHeaderDropdown();
      await matchProfileDetails.dropdownDuplicateButton.click();
      await matchProfileForm.whenLoaded();
    });

    it('appears upon click on pane header menu duplicate button', () => {
      expect(matchProfileForm.isPresent).to.be.true;
    });

    describe('when form is submitted', () => {
      beforeEach(async () => {
        await matchProfileForm.nameField.fillAndBlur('Changed name');
        await matchProfileForm.descriptionField.fillAndBlur('Changed description');
        await matchProfileForm.submitFormButton.click();
      });

      it('then match profile details renders duplicated match profile', () => {
        expect(matchProfileDetails.headline.text).to.equal('Changed name');
        expect(matchProfileDetails.description.text).to.equal('Changed description');
      });
    });

    describe('when form is submitted and the response contains', () => {
      describe('error message', () => {
        beforeEach(async function () {
          await setupFormSubmitErrorScenario('post', this.server, {
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
          await setupFormSubmitErrorScenario('post', this.server);
        });

        it('then error callout appears', () => {
          expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
        });
      });

      describe('unparsed data', () => {
        beforeEach(async function () {
          await setupFormSubmitErrorScenario('post', this.server, {
            response: '',
            status: 422,
          });
        });

        it('then error callout appears', () => {
          expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
        });
      });

      describe('error without body', () => {
        beforeEach(async function () {
          await setupFormSubmitErrorScenario('post', this.server, {
            response: null,
            status: 422,
          });
        });

        it('then error callout appears', () => {
          expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
        });
      });
    });
  });
});

// TODO: Fix it in UIDATIMP-395
describe.skip('delete confirmation modal', () => {
  setupApplication({ scenarios: ['fetch-match-profiles-success', 'fetch-users', 'fetch-tags'] });

  beforeEach(async function () {
    this.visit('/settings/data-import/match-profiles');
    await matchProfiles.list.rows(0).click();
  });

  it('is not visible when pane header dropdown is closed', () => {
    expect(matchProfileDetails.confirmationModal.isPresent).to.be.false;
  });

  describe('is visible', () => {
    beforeEach(async () => {
      await matchProfileDetails.expandPaneHeaderDropdown();
      await matchProfileDetails.dropdownDeleteButton.click();
    });

    it('when pane header dropdown is opened', () => {
      expect(matchProfileDetails.isPresent).to.be.true;
    });
  });

  describe('disappears', () => {
    beforeEach(async () => {
      await matchProfileDetails.expandPaneHeaderDropdown();
      await matchProfileDetails.dropdownDeleteButton.click();
      await matchProfileDetails.confirmationModal.cancelButton.click();
    });

    it('when cancel button is clicked', () => {
      expect(matchProfileDetails.confirmationModal.isPresent).to.be.false;
    });
  });

  describe('upon click on confirm button initiates the match profile deletion process and in case of error', () => {
    beforeEach(async function () {
      this.server.delete('/data-import-profiles/matchProfiles/:id', () => new Response(500, {}));
      await matchProfileDetails.expandPaneHeaderDropdown();
      await matchProfileDetails.dropdownDeleteButton.click();
      await matchProfileDetails.confirmationModal.confirmButton.click();
    });

    it('disappears', () => {
      expect(matchProfileDetails.confirmationModal.isPresent).to.be.false;
    });

    it('the error toast appears', () => {
      expect(matchProfileDetails.callout.errorCalloutIsPresent).to.be.true;
    });

    it('renders the correct number including the one which tried to delete', () => {
      expect(matchProfiles.list.rowCount).to.equal(8);
    });
  });

  describe('upon click on confirm button initiates the job profile deletion process and in case of success', () => {
    describe('exception modal', () => {
      beforeEach(async () => {
        await matchProfileDetails.expandPaneHeaderDropdown();
        await matchProfileDetails.dropdownDeleteButton.click();
        await matchProfileDetails.confirmationModal.confirmButton.click();
        await matchProfileDetails.confirmationModal.confirmButton.click();
      });

      it('disappears', () => {
        expect(matchProfileDetails.confirmationModal.isPresent).to.be.false;
      });

      describe('when there are associated job profiles', () => {
        it('appears', () => {
          expect(matchProfiles.exceptionModal.isPresent).to.be.true;
        });

        describe('and clicking on close button', () => {
          beforeEach(async () => {
            await matchProfiles.exceptionModalCloseButton.click();
          });

          it('closes the modal', () => {
            expect(matchProfiles.exceptionModal.isPresent).to.be.false;
          });

          it('renders the correct number including the one which tried to delete', () => {
            expect(matchProfiles.list.rowCount).to.equal(8);
          });
        });
      });
    });

    describe('when there are no associated job profiles', () => {
      beforeEach(async function () {
        this.server.delete('/data-import-profiles/matchProfiles/:id');
        await matchProfileDetails.expandPaneHeaderDropdown();
        await matchProfileDetails.dropdownDeleteButton.click();
        await matchProfileDetails.confirmationModal.confirmButton.click();
      });

      it('does not appear', () => {
        expect(matchProfiles.exceptionModal.isPresent).to.be.false;
      });

      it('renders the correct number of rows without deleted one', () => {
        expect(matchProfiles.list.rowCount).to.equal(7);
      });
    });
  });
});

describe('Match Profile View', () => {
  setupApplication({ scenarios: ['fetch-match-profiles-success', 'fetch-users', 'fetch-tags', 'tags-disabled'] });

  beforeEach(async function () {
    this.visit('/settings/data-import/match-profiles');
    await matchProfiles.list.rows(0).click();
  });

  it('does not display tags accordion', () => {
    expect(matchProfileDetails.isTagsPresent).to.be.false;
  });
});
