import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';
import { associatedActionProfiles } from '../../mocks/associated-action-profiles';
import {
  actionProfileDetails,
  mappingProfiles,
  mappingProfileForm,
  mappingProfileDetails,
} from '../../interactors';

async function setupFormSubmitErrorScenario(method, server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  const url = `/data-import-profiles/mappingProfiles${method === 'put' ? '/:id' : ''}`;

  server[method](url, () => new Response(status, headers, response));
  await mappingProfileForm.nameField.fillAndBlur('Changed title');
  await mappingProfileForm.submitFormButton.click();
}

const hasField = (details, accordion, field, fieldLabel) => {
  it(`has ${fieldLabel} field`, () => {
    expect(mappingProfileDetails[details][accordion][field].label.text).to.equal(fieldLabel);
  });
};

const hasTable = (details, accordion, table, tableName, columnCount) => {
  it(`has ${tableName} table`, () => {
    expect(mappingProfileDetails[details][accordion][table].isPresent).to.be.true;
  });

  it(`${tableName} table has ${columnCount} columns`, () => {
    expect(mappingProfileDetails[details][accordion][table].columnCount).to.equal(columnCount);
  });
};

describe('Mapping Profile View', () => {
  setupApplication({ scenarios: ['fetch-mapping-profiles-success', 'fetch-users', 'fetch-tags', 'tags-enabled'] });

  beforeEach(function () {
    this.visit('/settings/data-import/mapping-profiles');
  });

  describe('details pane', () => {
    beforeEach(async () => {
      await mappingProfiles.list.rows(0).click();
    });

    it('has correct name', () => {
      expect(mappingProfileDetails.headline.text).to.be.equal('Name 0');
    });

    it('has correct incoming record type', () => {
      expect(mappingProfileDetails.incomingRecordType.text).to.be.equal('MARC Bibliographic');
    });

    it('has correct FOLIO record type', () => {
      expect(mappingProfileDetails.folioRecordType.text).to.be.equal('Instance');
    });

    it('has correct description', () => {
      expect(mappingProfileDetails.description.text).to.be.equal('Description 0');
    });

    it('display tags accordion', () => {
      expect(mappingProfileDetails.isTagsPresent).to.be.true;
    });

    describe('details accordion', () => {
      describe('when FOLIO record type equals to', () => {
        describe('Holdings', () => {
          beforeEach(async () => {
            await mappingProfiles.list.rows(1).click();
          });

          it('has correct header', () => {
            expect(mappingProfileDetails.holdingsDetails.header.mappedLabel).to.be.equal('Field mapping');
            expect(mappingProfileDetails.holdingsDetails.header.mappableLabel).to.be.equal('Holdings');
          });

          it('has correct count of accordions', () => {
            expect(mappingProfileDetails.holdingsDetails.set().length).to.equal(7);
          });

          describe('Administrative data accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.holdingsDetails.adminDataAccordion.label).to.equal('Administrative data');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.holdingsDetails.adminDataAccordion.isOpen).to.be.true;
            });

            hasField('holdingsDetails', 'adminDataAccordion', 'suppressFromDiscovery', 'Suppress from discovery');
            hasField('holdingsDetails', 'adminDataAccordion', 'holdingsHRID', 'Holdings HRID');
            hasTable('holdingsDetails', 'adminDataAccordion', 'formerHoldingsIdTable', 'Former holdings ID', 1);
            hasField('holdingsDetails', 'adminDataAccordion', 'holdingsType', 'Holdings type');
            hasTable('holdingsDetails', 'adminDataAccordion', 'statisticalCodeTable', 'Statistical code', 1);
          });

          describe('Location accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.holdingsDetails.locationAccordion.label).to.equal('Location');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.holdingsDetails.locationAccordion.isOpen).to.be.true;
            });

            hasField('holdingsDetails', 'locationAccordion', 'permanent', 'Permanent');
            hasField('holdingsDetails', 'locationAccordion', 'temporary', 'Temporary');
            hasField('holdingsDetails', 'locationAccordion', 'shelvingOrder', 'Shelving order');
            hasField('holdingsDetails', 'locationAccordion', 'shelvingTitle', 'Shelving title');
            hasField('holdingsDetails', 'locationAccordion', 'copyNumber', 'Copy number');
            hasField('holdingsDetails', 'locationAccordion', 'callNumberType', 'Call number type');
            hasField('holdingsDetails', 'locationAccordion', 'callNumberPrefix', 'Call number prefix');
            hasField('holdingsDetails', 'locationAccordion', 'callNumber', 'Call number');
            hasField('holdingsDetails', 'locationAccordion', 'callNumberSuffix', 'Call number suffix');
          });

          describe('Holdings details accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.holdingsDetails.holdingsDetailsAccordion.label).to.equal('Holdings details');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.holdingsDetails.holdingsDetailsAccordion.isOpen).to.be.true;
            });

            hasField('holdingsDetails', 'holdingsDetailsAccordion', 'numberOfItems', 'Number of items');
            hasTable('holdingsDetails', 'holdingsDetailsAccordion', 'holdingsStatementsTable', 'Holdings statement', 2);
            hasTable('holdingsDetails', 'holdingsDetailsAccordion', 'holdingsStatementsForSupplTable', 'Holdings statement for supplements', 2);
            hasTable('holdingsDetails', 'holdingsDetailsAccordion', 'holdingsStatementsForIndexesTable', 'Holdings statement for indexes', 2);
            hasField('holdingsDetails', 'holdingsDetailsAccordion', 'illPolicy', 'ILL policy');
            hasField('holdingsDetails', 'holdingsDetailsAccordion', 'digitizationPolicy', 'Digitization policy');
            hasField('holdingsDetails', 'holdingsDetailsAccordion', 'retentionPolicy', 'Retention policy');
          });

          describe('Holdings notes accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.holdingsDetails.holdingsNotesAccordion.label).to.equal('Holdings notes');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.holdingsDetails.holdingsNotesAccordion.isOpen).to.be.true;
            });

            hasTable('holdingsDetails', 'holdingsNotesAccordion', 'notesTable', 'Holdings notes', 3);
          });

          describe('Electronic access accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.holdingsDetails.electronicAccessAccordion.label).to.equal('Electronic access');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.holdingsDetails.electronicAccessAccordion.isOpen).to.be.true;
            });

            hasTable('holdingsDetails', 'electronicAccessAccordion', 'electronicAccessTable', 'Electronic access', 5);
          });

          describe('Acquisition accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.holdingsDetails.acquisitionAccordion.label).to.equal('Acquisition');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.holdingsDetails.acquisitionAccordion.isOpen).to.be.true;
            });

            hasField('holdingsDetails', 'acquisitionAccordion', 'acquisitionMethod', 'Acquisition method');
            hasField('holdingsDetails', 'acquisitionAccordion', 'orderFormat', 'Order format');
            hasField('holdingsDetails', 'acquisitionAccordion', 'receiptStatus', 'Receipt status');
          });

          describe('Receiving history accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.holdingsDetails.receivingHistoryAccordion.label).to.equal('Receiving history');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.holdingsDetails.receivingHistoryAccordion.isOpen).to.be.true;
            });

            hasTable('holdingsDetails', 'receivingHistoryAccordion', 'receivingHistoryTable', 'Receiving history', 3);
          });
        });
      });
    });

    describe('associated action profile', () => {
      beforeEach(async () => {
        await mappingProfiles.list.rows(1).click();
      });

      it('has correct count of items', () => {
        expect(mappingProfileDetails.associatedActionProfiles.list.rowCount).to.be.equal(2);
      });

      describe('when action profile is clicked', () => {
        beforeEach(async function () {
          this.server.get('/data-import-profiles/actionProfiles/:id', associatedActionProfiles[1].content);
          await mappingProfileDetails.associatedActionProfiles.links(0).click();
        });

        it('redirects to action profile details', () => {
          expect(actionProfileDetails.isPresent).to.be.true;
        });
      });
    });

    describe('edit mapping profile form', () => {
      beforeEach(async function () {
        await mappingProfiles.list.rows(1).click();
      });

      describe('appears', () => {
        beforeEach(async () => {
          await mappingProfileDetails.actionMenu.click();
          await mappingProfileDetails.actionMenu.editProfile.click();
        });

        it('upon click on pane header actions edit button', () => {
          expect(mappingProfileForm.isPresent).to.be.true;
        });

        it('and form fields are pre-filled with current data', () => {
          expect(mappingProfileForm.nameField.val).to.be.equal('Name 1');
          expect(mappingProfileForm.incomingRecordTypeField.val).to.be.equal('MARC_HOLDINGS');
          expect(mappingProfileForm.folioRecordTypeField.val).to.be.equal('HOLDINGS');
          expect(mappingProfileForm.descriptionField.val).to.be.equal('Description 1');
        });

        describe('associated action profiles', () => {
          it('have associated action profile accordion', () => {
            expect(mappingProfileForm.associatedActionProfilesAccordion.isPresent).to.be.true;
          });

          it('have list of associated action profiles', () => {
            expect(mappingProfileForm.associatedActionProfiles.editList.isPresent).to.be.true;
          });

          it('it has correct length of items', () => {
            expect(mappingProfileForm.associatedActionProfiles.editList.rowCount).to.be.equal(2);
          });

          describe('click unlink button', () => {
            beforeEach(async () => {
              await mappingProfileForm.associatedActionProfiles.unlinkButtons(0).click();
            });

            it('shows modal window', () => {
              expect(mappingProfileForm.confirmEditModal.isPresent).to.be.true;
            });

            describe('click "Confirm"', () => {
              beforeEach(async () => {
                await mappingProfileForm.confirmEditModal.confirmButton.click();
              });

              it('modal window should be closed', () => {
                expect(mappingProfileForm.confirmEditModal.isPresent).to.be.false;
              });

              it('associated action profiles list has no items', () => {
                expect(mappingProfileForm.associatedActionProfiles.editList.rowCount).to.be.equal(1);
              });
            });

            describe('click "Cancel"', () => {
              beforeEach(async () => {
                await mappingProfileForm.confirmEditModal.cancelButton.click();
              });

              it('modal window should be closed', () => {
                expect(mappingProfileForm.confirmEditModal.isPresent).to.be.false;
              });

              it('associated action profiles list does not change', () => {
                expect(mappingProfileForm.associatedActionProfiles.editList.rowCount).to.be.equal(2);
              });
            });
          });
        });
      });
    });

    describe('edit mapping profile form', () => {
      beforeEach(async () => {
        await mappingProfiles.list.rows(0).click();
        await mappingProfileDetails.actionMenu.click();
        await mappingProfileDetails.actionMenu.editProfile.click();
      });

      describe('when form is submitted', () => {
        beforeEach(async () => {
          await mappingProfileForm.nameField.fillAndBlur('Changed name');
          await mappingProfileForm.incomingRecordTypeField.selectAndBlur('MARC Holdings');
          await mappingProfileForm.folioRecordTypeField.selectAndBlur('Invoice');
          await mappingProfileForm.descriptionField.fillAndBlur('Changed description');
          await mappingProfileForm.submitFormButton.click();
        });

        it('then mapping profile details renders updated mapping profile', () => {
          expect(mappingProfileDetails.headline.text).to.equal('Changed name');
          expect(mappingProfileDetails.incomingRecordType.text).to.equal('MARC Holdings');
          expect(mappingProfileDetails.folioRecordType.text).to.equal('Invoice');
          expect(mappingProfileDetails.description.text).to.equal('Changed description');
        });
      });

      describe('is submitted and the response contains', () => {
        describe('error message', () => {
          beforeEach(async function () {
            await setupFormSubmitErrorScenario('put', this.server, {
              response: { errors: [{ message: 'mappingProfile.duplication.invalid' }] },
              status: 422,
            });
          });

          it('then error callout appears', () => {
            expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
          });
        });

        describe('network error', () => {
          beforeEach(async function () {
            await setupFormSubmitErrorScenario('put', this.server);
          });

          it('then error callout appears', () => {
            expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
          });
        });
      });
    });
  });

  describe('associated action profiles', () => {
    describe('when there is associated profile', () => {
      beforeEach(async function () {
        await mappingProfiles.list.rows(1).click();
      });

      it('renders mapping profile', () => {
        expect(mappingProfileDetails.associatedActionProfiles.list.rowCount).to.be.equal(2);
      });
    });

    describe('when there is no associated profile', () => {
      beforeEach(async function () {
        await mappingProfiles.list.rows(0).click();
      });

      it('renders empty message', () => {
        expect(mappingProfileDetails.associatedActionProfiles.list.displaysEmptyMessage).to.be.true;
      });
    });
  });

  describe('duplicate mapping profile form', () => {
    beforeEach(async () => {
      await mappingProfiles.list.rows(0).click();
      await mappingProfileDetails.actionMenu.click();
      await mappingProfileDetails.actionMenu.duplicateProfile.click();
    });

    it('appears upon click on pane header menu duplicate button', () => {
      expect(mappingProfileForm.isPresent).to.be.true;
    });

    describe('when form is submitted', () => {
      beforeEach(async () => {
        await mappingProfileForm.nameField.fillAndBlur('Valid name');
        await mappingProfileForm.incomingRecordTypeField.selectAndBlur('MARC Bibliographic');
        await mappingProfileForm.folioRecordTypeField.selectAndBlur('Order');
        await mappingProfileForm.descriptionField.fillAndBlur('Valid description');
        await mappingProfileForm.submitFormButton.click();
      });

      it('then mapping profile details renders duplicated mapping profile', () => {
        expect(mappingProfileDetails.headline.text).to.equal('Valid name');
        expect(mappingProfileDetails.incomingRecordType.text).to.equal('MARC Bibliographic');
        expect(mappingProfileDetails.folioRecordType.text).to.equal('Order');
        expect(mappingProfileDetails.description.text).to.equal('Valid description');
      });
    });

    describe('when form is submitted and the response contains', () => {
      describe('error message', () => {
        beforeEach(async function () {
          await setupFormSubmitErrorScenario('post', this.server, {
            response: { errors: [{ message: 'mappingProfile.duplication.invalid' }] },
            status: 422,
          });
        });

        it('then error callout appears', () => {
          expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
        });
      });

      describe('network error', () => {
        beforeEach(async function () {
          await setupFormSubmitErrorScenario('post', this.server);
        });

        it('then error callout appears', () => {
          expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
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
          expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
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
          expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
        });
      });
    });
  });

  describe('delete confirmation modal', () => {
    beforeEach(async () => {
      await mappingProfiles.list.rows(0).click();
    });

    describe('is visible', () => {
      beforeEach(async () => {
        await mappingProfileDetails.actionMenu.click();
        await mappingProfileDetails.actionMenu.deleteProfile.click();
      });

      it('when pane header actions delete button is clicked', () => {
        expect(mappingProfileDetails.confirmationModal.isPresent).to.be.true;
      });
    });

    describe('disappears', () => {
      beforeEach(async () => {
        await mappingProfileDetails.actionMenu.click();
        await mappingProfileDetails.actionMenu.deleteProfile.click();
        await mappingProfileDetails.confirmationModal.cancelButton.click();
      });

      it('when cancel button is clicked', () => {
        expect(mappingProfileDetails.confirmationModal.isPresent).to.be.false;
      });
    });

    describe('upon click on confirm button initiates the mapping profile deletion process and in case of error', () => {
      beforeEach(async function () {
        this.server.delete('/data-import-profiles/mappingProfiles/:id', () => new Response(500, {}));
        await mappingProfileDetails.actionMenu.click();
        await mappingProfileDetails.actionMenu.deleteProfile.click();
        await mappingProfileDetails.confirmationModal.confirmButton.click();
      });

      it('disappears', () => {
        expect(mappingProfileDetails.confirmationModal.isPresent).to.be.false;
      });

      it('the error toast appears', () => {
        expect(mappingProfileDetails.callout.errorCalloutIsPresent).to.be.true;
      });

      it('renders the correct number including the one which tried to delete', () => {
        expect(mappingProfiles.list.rowCount).to.equal(5);
      });
    });

    describe('upon click on confirm button initiates the job profile deletion process and in case of success', () => {
      describe('exception modal', () => {
        beforeEach(async () => {
          await mappingProfileDetails.actionMenu.click();
          await mappingProfileDetails.actionMenu.deleteProfile.click();
          await mappingProfileDetails.confirmationModal.confirmButton.click();
          await mappingProfileDetails.confirmationModal.confirmButton.click();
        });

        it('disappears', () => {
          expect(mappingProfileDetails.confirmationModal.isPresent).to.be.false;
        });

        describe('when there are associated job profiles', () => {
          it('appears', () => {
            expect(mappingProfiles.exceptionModal.isPresent).to.be.true;
          });

          describe('and clicking on close button', () => {
            beforeEach(async () => {
              await mappingProfiles.exceptionModalCloseButton.click();
            });

            it('closes the modal', () => {
              expect(mappingProfiles.exceptionModal.isPresent).to.be.false;
            });

            it('renders the correct number including the one which tried to delete', () => {
              expect(mappingProfiles.list.rowCount).to.equal(5);
            });
          });
        });
      });

      describe('when there are no associated job profiles', () => {
        beforeEach(async function () {
          this.server.delete('/data-import-profiles/mappingProfiles/:id');
          await mappingProfileDetails.actionMenu.click();
          await mappingProfileDetails.actionMenu.deleteProfile.click();
          await mappingProfileDetails.confirmationModal.confirmButton.click();
        });

        it('does not appear', () => {
          expect(mappingProfiles.exceptionModal.isPresent).to.be.false;
        });

        it('renders the correct number of rows without deleted one', () => {
          expect(mappingProfiles.list.rowCount).to.equal(4);
        });
      });
    });
  });
});

describe('Mapping Profile View', () => {
  setupApplication({ scenarios: ['fetch-mapping-profiles-success', 'fetch-users', 'fetch-tags', 'tags-disabled'] });

  beforeEach(async function () {
    this.visit('/settings/data-import/mapping-profiles');
    await mappingProfiles.list.rows(0).click();
  });

  it('does not display tags accordion', () => {
    expect(mappingProfileDetails.isTagsPresent).to.be.false;
  });
});
