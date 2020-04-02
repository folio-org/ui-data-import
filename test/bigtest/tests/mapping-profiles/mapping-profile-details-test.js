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

const hasInput = (details, accordion, field, fieldLabel, isDisabled = false) => {
  it(`has ${fieldLabel} field`, () => {
    expect(mappingProfileForm[details][accordion][field].label).to.equal(fieldLabel);
  });

  if (isDisabled) {
    it(`${fieldLabel} field is disabled`, () => {
      expect(mappingProfileForm[details][accordion][field].isDisabled).to.be.true;
    });
  }
};

const hasRepeatableField = (details, accordion, field, legend, isDisabled = false) => {
  if (!legend) {
    it(`has ${legend} repeatable field`, () => {
      expect(mappingProfileForm[details][accordion][field].isPresent).to.be.true;
    });
  } else {
    it(`has ${legend} repeatable field`, () => {
      expect(mappingProfileForm[details][accordion][field].legend).to.equal(legend);
    });
  }

  it('has Add button', () => {
    expect(mappingProfileForm[details][accordion][field].hasAddButton).to.be.true;
  });

  if (isDisabled) {
    it(`${legend} field is disabled`, () => {
      expect(mappingProfileForm[details][accordion][field].isAddDisabled).to.be.true;
    });
  } else {
    describe('when Add button is clicked', () => {
      beforeEach(async () => {
        await mappingProfileForm[details][accordion][field].clickAddButton();
      });

      it('then new field appears', () => {
        expect(mappingProfileForm[details][accordion][field].items().length).to.be.above(0);
      });

      it('field has Remove button', () => {
        const fieldsLength = mappingProfileForm[details][accordion][field].items().length;
        const newFieldOrder = fieldsLength ? (fieldsLength - 1) : 0;

        expect(mappingProfileForm[details][accordion][field].items(newFieldOrder).hasRemoveButton).to.be.true;
      });

      describe('when Remove button is clicked', () => {
        beforeEach(async () => {
          const fieldsLength = mappingProfileForm[details][accordion][field].items().length;
          const newFieldOrder = fieldsLength ? (fieldsLength - 1) : 0;

          await mappingProfileForm[details][accordion][field].items(newFieldOrder).clickRemoveButton();
        });

        it('then field is removed', () => {
          expect(mappingProfileForm[details][accordion][field].items().length).to.equal(0);
        });
      });
    });
  }
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

  describe('details section', () => {
    describe('view details screen', () => {
      describe('when FOLIO record type equals to', () => {
        describe('Instance', () => {
          beforeEach(async () => {
            await mappingProfiles.list.rows(0).click();
          });

          it('has correct header', () => {
            expect(mappingProfileDetails.instanceDetails.header.mappedLabel).to.be.equal('Field mapping');
            expect(mappingProfileDetails.instanceDetails.header.mappableLabel).to.be.equal('Instance');
          });

          it('has correct count of accordions', () => {
            expect(mappingProfileDetails.instanceDetails.set().length).to.equal(11);
          });

          it('has expand/collapse all button', () => {
            expect(mappingProfileDetails.instanceDetails.expandAllButton.isPresent).to.be.true;
          });

          describe('click on expand/collapse all button', () => {
            beforeEach(async () => {
              await mappingProfileDetails.instanceDetails.expandAllButton.clickExpandAllButton();
            });

            it('button label should be equal to "Expand all"', () => {
              expect(mappingProfileDetails.instanceDetails.expandAllButton.label).to.equal('Expand all');
            });

            it('all accordions should be closed', () => {
              mappingProfileDetails.instanceDetails.set().forEach(accordion => {
                expect(accordion.isOpen).to.be.false;
              });
            });
          });

          describe('Administrative data accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.adminDataAccordion.label).to.equal('Administrative data');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.adminDataAccordion.isOpen).to.be.true;
            });

            hasField('instanceDetails', 'adminDataAccordion', 'suppressFromDiscovery', 'Suppress from discovery');
            hasField('instanceDetails', 'adminDataAccordion', 'staffSuppress', 'Staff suppress');
            hasField('instanceDetails', 'adminDataAccordion', 'previouslyHeld', 'Previously held');
            hasField('instanceDetails', 'adminDataAccordion', 'instanceHRID', 'Instance HRID');
            hasField('instanceDetails', 'adminDataAccordion', 'metadataSource', 'Metadata source');
            hasField('instanceDetails', 'adminDataAccordion', 'catalogedDate', 'Cataloged date');
            hasField('instanceDetails', 'adminDataAccordion', 'instanceStatusTerm', 'Instance status term');
            hasField('instanceDetails', 'adminDataAccordion', 'modeOfIssuance', 'Mode of issuance');
          });

          describe('Title data accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.titleDataAccordion.label).to.equal('Title data');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.titleDataAccordion.isOpen).to.be.true;
            });

            hasField('instanceDetails', 'titleDataAccordion', 'resourceTitle', 'Resource title');
            hasField('instanceDetails', 'titleDataAccordion', 'alternativeTitleType', 'Type');
            hasField('instanceDetails', 'titleDataAccordion', 'alternativeTitle', 'Alternative title');
            hasField('instanceDetails', 'titleDataAccordion', 'indexTitle', 'Index title');
            hasField('instanceDetails', 'titleDataAccordion', 'seriesStatements', 'Series statement');
          });

          describe('Identifier accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.identifierAccordion.label).to.equal('Identifier');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.identifierAccordion.isOpen).to.be.true;
            });

            hasField('instanceDetails', 'identifierAccordion', 'identifierType', 'Type');
            hasField('instanceDetails', 'identifierAccordion', 'identifierValue', 'Value');
          });

          describe('Contributor accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.contributorAccordion.label).to.equal('Contributor');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.contributorAccordion.isOpen).to.be.true;
            });

            hasField('instanceDetails', 'contributorAccordion', 'name', 'Name');
            hasField('instanceDetails', 'contributorAccordion', 'nameType', 'Name type');
            hasField('instanceDetails', 'contributorAccordion', 'type', 'Type');
            hasField('instanceDetails', 'contributorAccordion', 'typeFreeText', 'Type, free text');
            hasField('instanceDetails', 'contributorAccordion', 'primary', 'Primary');
          });

          describe('Descriptive data accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.descriptiveDataAccordion.label).to.equal('Descriptive data');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.descriptiveDataAccordion.isOpen).to.be.true;
            });

            hasField('instanceDetails', 'descriptiveDataAccordion', 'publisher', 'Publisher');
            hasField('instanceDetails', 'descriptiveDataAccordion', 'publisherRole', 'Publisher role');
            hasField('instanceDetails', 'descriptiveDataAccordion', 'place', 'Place');
            hasField('instanceDetails', 'descriptiveDataAccordion', 'publicationDate', 'Publication date');
            hasField('instanceDetails', 'descriptiveDataAccordion', 'edition', 'Edition');
            hasField('instanceDetails', 'descriptiveDataAccordion', 'physicalDescription', 'Physical description');
            hasField('instanceDetails', 'descriptiveDataAccordion', 'resourceType', 'Resource type');
            hasField('instanceDetails', 'descriptiveDataAccordion', 'format', 'Format');
            hasField('instanceDetails', 'descriptiveDataAccordion', 'language', 'Language');
            hasField('instanceDetails', 'descriptiveDataAccordion', 'publicationFrequency', 'Publication frequency');
            hasField('instanceDetails', 'descriptiveDataAccordion', 'publicationRange', 'Publication range');
          });

          describe('Instance notes accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.instanceNotesAccordion.label).to.equal('Instance notes');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.instanceNotesAccordion.isOpen).to.be.true;
            });

            hasField('instanceDetails', 'instanceNotesAccordion', 'noteType', 'Note type');
            hasField('instanceDetails', 'instanceNotesAccordion', 'note', 'Note');
            hasField('instanceDetails', 'instanceNotesAccordion', 'staffOnly', 'Staff only');
          });

          describe('Electronic access accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.electronicAccessAccordion.label).to.equal('Electronic access');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.electronicAccessAccordion.isOpen).to.be.true;
            });

            hasField('instanceDetails', 'electronicAccessAccordion', 'relationship', 'Relationship');
            hasField('instanceDetails', 'electronicAccessAccordion', 'uri', 'URI');
            hasField('instanceDetails', 'electronicAccessAccordion', 'linkText', 'Link text');
            hasField('instanceDetails', 'electronicAccessAccordion', 'materialsSpecified', 'Materials specified');
            hasField('instanceDetails', 'electronicAccessAccordion', 'urlPublicNote', 'URL public note');
          });

          describe('Subject accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.subjectAccordion.label).to.equal('Subject');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.subjectAccordion.isOpen).to.be.true;
            });

            hasField('instanceDetails', 'subjectAccordion', 'subjects', 'Subjects');
          });

          describe('Classification accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.classificationAccordion.label).to.equal('Classification');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.classificationAccordion.isOpen).to.be.true;
            });

            hasField('instanceDetails', 'classificationAccordion', 'classificationIdentifierType', 'Classification identifier type');
            hasField('instanceDetails', 'classificationAccordion', 'classification', 'Classification');
          });

          describe('Instance relationship accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.instanceRelationshipAccordion.label).to.equal('Instance relationship (analytics and bound-with)');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.instanceRelationshipAccordion.isOpen).to.be.true;
            });
          });

          describe('Related instances accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.relatedInstancesAccordion.label).to.equal('Related instances');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.relatedInstancesAccordion.isOpen).to.be.true;
            });
          });
        });

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

          it('has expand/collapse all button', () => {
            expect(mappingProfileDetails.holdingsDetails.expandAllButton.isPresent).to.be.true;
          });

          describe('click on expand/collapse all button', () => {
            beforeEach(async () => {
              await mappingProfileDetails.holdingsDetails.expandAllButton.clickExpandAllButton();
            });

            it('button label should be equal to "Expand all"', () => {
              expect(mappingProfileDetails.holdingsDetails.expandAllButton.label).to.equal('Expand all');
            });

            it('all accordions should be closed', () => {
              mappingProfileDetails.holdingsDetails.set().forEach(accordion => {
                expect(accordion.isOpen).to.be.false;
              });
            });
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
            hasField('holdingsDetails', 'adminDataAccordion', 'holdingsType', 'Holdings type');
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
          });

          describe('Electronic access accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.holdingsDetails.electronicAccessAccordion.label).to.equal('Electronic access');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.holdingsDetails.electronicAccessAccordion.isOpen).to.be.true;
            });
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
          });
        });

        describe('Item', () => {
          beforeEach(async () => {
            await mappingProfiles.list.rows(2).click();
          });

          it('has correct header', () => {
            expect(mappingProfileDetails.itemDetails.header.mappedLabel).to.be.equal('Field mapping');
            expect(mappingProfileDetails.itemDetails.header.mappableLabel).to.be.equal('Item');
          });

          it('has correct count of accordions', () => {
            expect(mappingProfileDetails.itemDetails.set().length).to.equal(8);
          });

          it('has expand/collapse all button', () => {
            expect(mappingProfileDetails.itemDetails.expandAllButton.isPresent).to.be.true;
          });

          describe('click on expand/collapse all button', () => {
            beforeEach(async () => {
              await mappingProfileDetails.itemDetails.expandAllButton.clickExpandAllButton();
            });

            it('button label should be equal to "Expand all"', () => {
              expect(mappingProfileDetails.itemDetails.expandAllButton.label).to.equal('Expand all');
            });

            it('all accordions should be closed', () => {
              mappingProfileDetails.itemDetails.set().forEach(accordion => {
                expect(accordion.isOpen).to.be.false;
              });
            });
          });

          describe('Administrative data accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.itemDetails.adminDataAccordion.label).to.equal('Administrative data');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.itemDetails.adminDataAccordion.isOpen).to.be.true;
            });

            hasField('itemDetails', 'adminDataAccordion', 'suppressFromDiscovery', 'Suppress from discovery');
            hasField('itemDetails', 'adminDataAccordion', 'itemHRID', 'Item HRID');
            hasField('itemDetails', 'adminDataAccordion', 'barcode', 'Barcode');
            hasField('itemDetails', 'adminDataAccordion', 'accessionNumber', 'Accession number');
            hasField('itemDetails', 'adminDataAccordion', 'itemIdentifier', 'Item identifier');
          });

          describe('Item data accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.itemDetails.itemDataAccordion.label).to.equal('Item data');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.itemDetails.itemDataAccordion.isOpen).to.be.true;
            });

            hasField('itemDetails', 'itemDataAccordion', 'materialType', 'Material type');
            hasField('itemDetails', 'itemDataAccordion', 'copyNumber', 'Copy number');
            hasField('itemDetails', 'itemDataAccordion', 'callNumberType', 'Call number type');
            hasField('itemDetails', 'itemDataAccordion', 'callNumberPrefix', 'Call number prefix');
            hasField('itemDetails', 'itemDataAccordion', 'callNumber', 'Call number');
            hasField('itemDetails', 'itemDataAccordion', 'callNumberSuffix', 'Call number suffix');
            hasField('itemDetails', 'itemDataAccordion', 'numberOfPieces', 'Number of pieces');
            hasField('itemDetails', 'itemDataAccordion', 'descriptionOfPieces', 'Description of pieces');
          });

          describe('Enumeration data accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.itemDetails.enumerationDataAccordion.label).to.equal('Enumeration data');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.itemDetails.enumerationDataAccordion.isOpen).to.be.true;
            });

            hasField('itemDetails', 'enumerationDataAccordion', 'enumeration', 'Enumeration');
            hasField('itemDetails', 'enumerationDataAccordion', 'chronology', 'Chronology');
            hasField('itemDetails', 'enumerationDataAccordion', 'volume', 'Volume');
          });

          describe('Condition accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.itemDetails.conditionAccordion.label).to.equal('Condition');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.itemDetails.conditionAccordion.isOpen).to.be.true;
            });

            hasField('itemDetails', 'conditionAccordion', 'missingPiecesNumber', 'Number of missing pieces');
            hasField('itemDetails', 'conditionAccordion', 'missingPieces', 'Missing pieces');
            hasField('itemDetails', 'conditionAccordion', 'date', 'Date');
            hasField('itemDetails', 'conditionAccordion', 'itemDamagedStatus', 'Item damaged status');
            hasField('itemDetails', 'conditionAccordion', 'date2', 'Date');
          });

          describe('Item notes accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.itemDetails.itemNotesAccordion.label).to.equal('Item notes');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.itemDetails.itemNotesAccordion.isOpen).to.be.true;
            });
          });

          describe('Loan and availability accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.itemDetails.loanAndAvailabilityAccordion.label).to.equal('Loan and availability');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.itemDetails.loanAndAvailabilityAccordion.isOpen).to.be.true;
            });

            hasField('itemDetails', 'loanAndAvailabilityAccordion', 'permanentLoanType', 'Permanent loan type');
            hasField('itemDetails', 'loanAndAvailabilityAccordion', 'temporaryLoanType', 'Temporary loan type');
            hasField('itemDetails', 'loanAndAvailabilityAccordion', 'status', 'Status');
          });

          describe('Location accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.itemDetails.locationAccordion.label).to.equal('Location');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.itemDetails.locationAccordion.isOpen).to.be.true;
            });

            hasField('itemDetails', 'locationAccordion', 'permanent', 'Permanent');
            hasField('itemDetails', 'locationAccordion', 'temporary', 'Temporary');
          });

          describe('Electronic access accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.itemDetails.electronicAccessAccordion.label).to.equal('Electronic access');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.itemDetails.electronicAccessAccordion.isOpen).to.be.true;
            });
          });
        });
      });
    });

    describe('edit mapping profile form', () => {
      describe('when FOLIO record type equals to', () => {
        describe('Instance', () => {
          beforeEach(async () => {
            await mappingProfiles.list.rows(0).click();
            await mappingProfileDetails.actionMenu.click();
            await mappingProfileDetails.actionMenu.editProfile.click();
          });

          it('has correct header', () => {
            expect(mappingProfileForm.instanceDetails.header.mappedLabel).to.be.equal('Field mapping');
            expect(mappingProfileForm.instanceDetails.header.mappableLabel).to.be.equal('Instance');
          });

          it('has correct count of accordions', () => {
            expect(mappingProfileForm.instanceDetails.set().length).to.equal(11);
          });

          it('has expand/collapse all button', () => {
            expect(mappingProfileForm.instanceDetails.expandAllButton.isPresent).to.be.true;
          });

          describe('Administrative data accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.adminDataAccordion.label).to.equal('Administrative data');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.adminDataAccordion.isOpen).to.be.true;
            });

            hasInput('instanceDetails', 'adminDataAccordion', 'instanceHRID', 'Instance HRID', true);
            hasInput('instanceDetails', 'adminDataAccordion', 'metadataSource', 'Metadata source', true);
            hasInput('instanceDetails', 'adminDataAccordion', 'catalogedDate', 'Cataloged date');
            hasInput('instanceDetails', 'adminDataAccordion', 'instanceStatusTerm', 'Instance status term');
            hasInput('instanceDetails', 'adminDataAccordion', 'modeOfIssuance', 'Mode of issuance', true);
            hasRepeatableField('instanceDetails', 'adminDataAccordion', 'statisticalCodes', 'Statistical codes');
          });

          describe('Title data accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.titleDataAccordion.label).to.equal('Title data');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.titleDataAccordion.isOpen).to.be.true;
            });

            hasInput('instanceDetails', 'titleDataAccordion', 'resourceTitle', 'Resource title', true);
            hasRepeatableField('instanceDetails', 'titleDataAccordion', 'alternativeTitles', 'Alternative titles', true);
            hasInput('instanceDetails', 'titleDataAccordion', 'indexTitle', 'Index title', true);
            hasRepeatableField('instanceDetails', 'titleDataAccordion', 'seriesStatements', 'Series statements', true);
            hasRepeatableField('instanceDetails', 'titleDataAccordion', 'precedingTitles', 'Preceding titles');
            hasRepeatableField('instanceDetails', 'titleDataAccordion', 'succeedingTitles', 'Succeeding titles');
          });

          describe('Identifier accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.identifierAccordion.label).to.equal('Identifier');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.identifierAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'identifierAccordion', 'identifiers', '', true);
          });

          describe('Contributor accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.contributorAccordion.label).to.equal('Contributor');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.contributorAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'contributorAccordion', 'contributors', '', true);
          });

          describe('Descriptive data accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.descriptiveDataAccordion.label).to.equal('Descriptive data');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.descriptiveDataAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'publications', 'Publications', true);
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'editions', 'Editions', true);
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'physicalDescriptions', 'Physical descriptions', true);
            hasInput('instanceDetails', 'descriptiveDataAccordion', 'resourceType', 'Resource type', true);
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'natureOfContentTerms', 'Nature of content terms');
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'formats', 'Formats', true);
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'languages', 'Languages', true);
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'publicationFrequencies', 'Publication frequencies', true);
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'publicationRanges', 'Publication range', true);
          });

          describe('Instance notes accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.instanceNotesAccordion.label).to.equal('Instance notes');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.instanceNotesAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'instanceNotesAccordion', 'notes', '', true);
          });

          describe('Electronic access accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.electronicAccessAccordion.label).to.equal('Electronic access');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.electronicAccessAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'electronicAccessAccordion', 'electronicAccess', '', true);
          });

          describe('Subject accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.subjectAccordion.label).to.equal('Subject');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.subjectAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'subjectAccordion', 'subjects', '', true);
          });

          describe('Classification accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.classificationAccordion.label).to.equal('Classification');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.classificationAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'classificationAccordion', 'classifications', '', true);
          });

          describe('Instance relationship accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.instanceRelationshipAccordion.label).to.equal('Instance relationship (analytics and bound-with)');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.instanceRelationshipAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'instanceRelationshipAccordion', 'parentInstances', 'Parent instances');
            hasRepeatableField('instanceDetails', 'instanceRelationshipAccordion', 'childInstances', 'Child instances');
          });

          describe('Related instances accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.relatedInstancesAccordion.label).to.equal('Related instances');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.relatedInstancesAccordion.isOpen).to.be.true;
            });
          });
        });

        describe('Holdings', () => {
          beforeEach(async () => {
            await mappingProfiles.list.rows(1).click();
            await mappingProfileDetails.actionMenu.click();
            await mappingProfileDetails.actionMenu.editProfile.click();
          });

          it('has correct header', () => {
            expect(mappingProfileForm.holdingsDetails.header.mappedLabel).to.be.equal('Field mapping');
            expect(mappingProfileForm.holdingsDetails.header.mappableLabel).to.be.equal('Holdings');
          });

          it('has correct count of accordions', () => {
            expect(mappingProfileForm.holdingsDetails.set().length).to.equal(7);
          });

          it('has expand/collapse all button', () => {
            expect(mappingProfileForm.holdingsDetails.expandAllButton.isPresent).to.be.true;
          });

          describe('Administrative data accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.holdingsDetails.adminDataAccordion.label).to.equal('Administrative data');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.holdingsDetails.adminDataAccordion.isOpen).to.be.true;
            });

            hasInput('holdingsDetails', 'adminDataAccordion', 'holdingsHRID', 'Holdings HRID', true);
            hasRepeatableField('holdingsDetails', 'adminDataAccordion', 'formerHoldings', 'Former holdings');
            hasInput('holdingsDetails', 'adminDataAccordion', 'holdingsType', 'Holdings type');
            hasRepeatableField('holdingsDetails', 'adminDataAccordion', 'statisticalCodes', 'Statistical codes');
          });

          describe('Location accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.holdingsDetails.locationAccordion.label).to.equal('Location');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.holdingsDetails.locationAccordion.isOpen).to.be.true;
            });

            hasInput('holdingsDetails', 'locationAccordion', 'permanent', 'Permanent');
            hasInput('holdingsDetails', 'locationAccordion', 'temporary', 'Temporary');
            hasInput('holdingsDetails', 'locationAccordion', 'shelvingOrder', 'Shelving order');
            hasInput('holdingsDetails', 'locationAccordion', 'shelvingTitle', 'Shelving title');
            hasInput('holdingsDetails', 'locationAccordion', 'copyNumber', 'Copy number');
            hasInput('holdingsDetails', 'locationAccordion', 'callNumberType', 'Call number type');
            hasInput('holdingsDetails', 'locationAccordion', 'callNumberPrefix', 'Call number prefix');
            hasInput('holdingsDetails', 'locationAccordion', 'callNumber', 'Call number');
            hasInput('holdingsDetails', 'locationAccordion', 'callNumberSuffix', 'Call number suffix');
          });

          describe('Holdings details accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.holdingsDetails.holdingsDetailsAccordion.label).to.equal('Holdings details');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.holdingsDetails.holdingsDetailsAccordion.isOpen).to.be.true;
            });

            hasInput('holdingsDetails', 'holdingsDetailsAccordion', 'numberOfItems', 'Number of items');
            hasRepeatableField('holdingsDetails', 'holdingsDetailsAccordion', 'statements', 'Holdings statements');
            hasRepeatableField('holdingsDetails', 'holdingsDetailsAccordion', 'statementsForSupplement', 'Holdings statements for supplement');
            hasRepeatableField('holdingsDetails', 'holdingsDetailsAccordion', 'statementsForIndexes', 'Holdings statements for indexes');
            hasInput('holdingsDetails', 'holdingsDetailsAccordion', 'illPolicy', 'ILL policy');
            hasInput('holdingsDetails', 'holdingsDetailsAccordion', 'digitizationPolicy', 'Digitization policy');
            hasInput('holdingsDetails', 'holdingsDetailsAccordion', 'retentionPolicy', 'Retention policy');
          });

          describe('Holdings notes accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.holdingsDetails.holdingsNotesAccordion.label).to.equal('Holdings notes');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.holdingsDetails.holdingsNotesAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('holdingsDetails', 'holdingsNotesAccordion', 'notes', '');
          });

          describe('Electronic access accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.holdingsDetails.electronicAccessAccordion.label).to.equal('Electronic access');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.holdingsDetails.electronicAccessAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('holdingsDetails', 'electronicAccessAccordion', 'electronicAccess', '');
          });

          describe('Acquisition accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.holdingsDetails.acquisitionAccordion.label).to.equal('Acquisition');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.holdingsDetails.acquisitionAccordion.isOpen).to.be.true;
            });

            hasInput('holdingsDetails', 'acquisitionAccordion', 'acquisitionMethod', 'Acquisition method');
            hasInput('holdingsDetails', 'acquisitionAccordion', 'orderFormat', 'Order format');
            hasInput('holdingsDetails', 'acquisitionAccordion', 'receiptStatus', 'Receipt status');
          });

          describe('Receiving history accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.holdingsDetails.receivingHistoryAccordion.label).to.equal('Receiving history');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.holdingsDetails.receivingHistoryAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('holdingsDetails', 'receivingHistoryAccordion', 'note', '');
          });
        });

        describe('Item', () => {
          beforeEach(async () => {
            await mappingProfiles.list.rows(2).click();
            await mappingProfileDetails.actionMenu.click();
            await mappingProfileDetails.actionMenu.editProfile.click();
          });

          it('has correct header', () => {
            expect(mappingProfileForm.itemDetails.header.mappedLabel).to.be.equal('Field mapping');
            expect(mappingProfileForm.itemDetails.header.mappableLabel).to.be.equal('Item');
          });

          it('has correct count of accordions', () => {
            expect(mappingProfileForm.holdingsDetails.set().length).to.equal(8);
          });

          it('has expand/collapse all button', () => {
            expect(mappingProfileForm.holdingsDetails.expandAllButton.isPresent).to.be.true;
          });

          describe('Administrative data accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.adminDataAccordion.label).to.equal('Administrative data');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.adminDataAccordion.isOpen).to.be.true;
            });

            hasInput('itemDetails', 'adminDataAccordion', 'itemHRID', 'Item HRID', true);
            hasInput('itemDetails', 'adminDataAccordion', 'barcode', 'Barcode');
            hasInput('itemDetails', 'adminDataAccordion', 'accessionNumber', 'Accession number');
            hasInput('itemDetails', 'adminDataAccordion', 'itemIdentifier', 'Item identifier');
            hasRepeatableField('itemDetails', 'adminDataAccordion', 'formerIds', 'Former identifiers');
            hasRepeatableField('itemDetails', 'adminDataAccordion', 'statisticalCodes', 'Statistical codes');
          });

          describe('Item data accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.itemDataAccordion.label).to.equal('Item data');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.itemDataAccordion.isOpen).to.be.true;
            });

            hasInput('itemDetails', 'itemDataAccordion', 'materialType', 'Material type');
            hasInput('itemDetails', 'itemDataAccordion', 'copyNumber', 'Copy number');
            hasInput('itemDetails', 'itemDataAccordion', 'callNumberType', 'Call number type');
            hasInput('itemDetails', 'itemDataAccordion', 'callNumberPrefix', 'Call number prefix');
            hasInput('itemDetails', 'itemDataAccordion', 'callNumber', 'Call number');
            hasInput('itemDetails', 'itemDataAccordion', 'callNumberSuffix', 'Call number suffix');
            hasInput('itemDetails', 'itemDataAccordion', 'numberOfPieces', 'Number of pieces');
            hasInput('itemDetails', 'itemDataAccordion', 'descriptionOfPieces', 'Description of pieces');
          });

          describe('Enumeration data accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.enumerationDataAccordion.label).to.equal('Enumeration data');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.enumerationDataAccordion.isOpen).to.be.true;
            });

            hasInput('itemDetails', 'enumerationDataAccordion', 'enumeration', 'Enumeration');
            hasInput('itemDetails', 'enumerationDataAccordion', 'chronology', 'Chronology');
            hasInput('itemDetails', 'enumerationDataAccordion', 'volume', 'Volume');
            hasRepeatableField('itemDetails', 'enumerationDataAccordion', 'yearsAndCaptions', 'Years and captions');
          });

          describe('Condition accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.conditionAccordion.label).to.equal('Condition');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.conditionAccordion.isOpen).to.be.true;
            });

            hasInput('itemDetails', 'conditionAccordion', 'missingPiecesNumber', 'Number of missing pieces');
            hasInput('itemDetails', 'conditionAccordion', 'missingPieces', 'Missing pieces');
            hasInput('itemDetails', 'conditionAccordion', 'date', 'Date');
            hasInput('itemDetails', 'conditionAccordion', 'itemDamagedStatus', 'Item damaged status');
            hasInput('itemDetails', 'conditionAccordion', 'date2', 'Date');
          });

          describe('Item notes accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.itemNotesAccordion.label).to.equal('Item notes');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.itemNotesAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('itemDetails', 'itemNotesAccordion', 'notes', '');
          });

          describe('Loan and availability accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.loanAndAvailabilityAccordion.label).to.equal('Loan and availability');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.loanAndAvailabilityAccordion.isOpen).to.be.true;
            });

            hasInput('itemDetails', 'loanAndAvailabilityAccordion', 'permanentLoanType', 'Permanent loan type');
            hasInput('itemDetails', 'loanAndAvailabilityAccordion', 'temporaryLoanType', 'Temporary loan type');
            hasInput('itemDetails', 'loanAndAvailabilityAccordion', 'status', 'Status');
            hasRepeatableField('itemDetails', 'loanAndAvailabilityAccordion', 'circulationNotes', 'Circulation notes');
          });

          describe('Location accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.locationAccordion.label).to.equal('Location');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.locationAccordion.isOpen).to.be.true;
            });

            hasInput('itemDetails', 'locationAccordion', 'permanent', 'Permanent');
            hasInput('itemDetails', 'locationAccordion', 'temporary', 'Temporary');
          });

          describe('Electronic access accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.electronicAccessAccordion.label).to.equal('Electronic access');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.electronicAccessAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('itemDetails', 'electronicAccessAccordion', 'electronicAccess', '');
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
