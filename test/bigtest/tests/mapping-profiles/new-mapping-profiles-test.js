import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';
import {
  mappingProfiles,
  mappingProfileForm,
} from '../../interactors';

async function setupFormSubmitErrorScenario(server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  server.post('/data-import-profiles/mappingProfiles', () => new Response(status, headers, response));
  await mappingProfileForm.nameField.fillAndBlur('Valid name');
  await mappingProfileForm.incomingRecordTypeField.selectAndBlur('MARC Bibliographic');
  await mappingProfileForm.folioRecordTypeField.selectAndBlur('Order');
  await mappingProfileForm.descriptionField.fillAndBlur('Valid description');
  await mappingProfileForm.submitFormButton.click();
}

describe('Mapping profile form', () => {
  setupApplication({ scenarios: ['fetch-mapping-profiles-success', 'fetch-users', 'fetch-tags', 'tags-enabled'] });

  describe('appears', () => {
    beforeEach(async function () {
      this.visit('/settings/data-import/mapping-profiles');
      await mappingProfiles.actionMenu.newProfileButton.click();
    });

    it('upon click on action new profile button', () => {
      expect(mappingProfileForm.isPresent).to.be.true;
    });
  });

  describe('when open', () => {
    beforeEach(function () {
      this.visit('/settings/data-import/mapping-profiles?layer=create');
    });

    it('when not filled then the submit button is disabled', () => {
      expect(mappingProfileForm.submitFormButtonDisabled).to.be.true;
    });

    describe('when filled correctly', () => {
      beforeEach(async () => {
        await mappingProfileForm.nameField.fillAndBlur('Valid name');
        await mappingProfileForm.incomingRecordTypeField.selectAndBlur('MARC Bibliographic');
        await mappingProfileForm.folioRecordTypeField.selectAndBlur('Order');
        await mappingProfileForm.descriptionField.fillAndBlur('Valid description');
      });

      it('the submit button is not disabled', () => {
        expect(mappingProfileForm.submitFormButtonDisabled).to.be.false;
      });
    });

    describe('when FOLIO record type is equal to', () => {
      describe('MARC Bibliographic', () => {
        beforeEach(async () => {
          await mappingProfileForm.folioRecordTypeField.selectAndBlur('MARC Bibliographic');
        });

        describe('details section', () => {
          it('has correct header', () => {
            expect(mappingProfileForm.itemDetails.header.mappedLabel).to.be.equal('Field mapping');
            expect(mappingProfileForm.itemDetails.header.mappableLabel).to.be.equal('MARC Bibliographic');
          });

          describe('MARC details table', () => {
            it('renders', () => {
              expect(mappingProfileForm.marcDetailsTable.tablePresent).to.be.true;
            });

            it('has 1 row', () => {
              expect(mappingProfileForm.marcDetailsTable.rowCount).to.equal(1);
            });

            it('has 10 columns', () => {
              expect(mappingProfileForm.marcDetailsTable.columnCount).to.equal(10);
            });

            it('headers have correct captions', () => {
              expect(mappingProfileForm.marcDetailsTable.headers(0).content).to.equal('');
              expect(mappingProfileForm.marcDetailsTable.headers(1).content).to.equal('Action');
              expect(mappingProfileForm.marcDetailsTable.headers(2).content).to.equal('Field');
              expect(mappingProfileForm.marcDetailsTable.headers(3).content).to.equal('In.1');
              expect(mappingProfileForm.marcDetailsTable.headers(4).content).to.equal('In.2');
              expect(mappingProfileForm.marcDetailsTable.headers(5).content).to.equal('Subfield');
              expect(mappingProfileForm.marcDetailsTable.headers(6).content).to.equal('Subaction');
              expect(mappingProfileForm.marcDetailsTable.headers(7).content).to.equal('Data');
              expect(mappingProfileForm.marcDetailsTable.headers(8).content).to.equal('Position');
              expect(mappingProfileForm.marcDetailsTable.headers(9).content).to.equal('');
            });

            it('row does not have re-order arrows', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(0).arrowUp.isPresent).to.be.false;
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(0).arrowDown.isPresent).to.be.false;
            });

            it('row has add button', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(9).addRow.isPresent).to.be.true;
            });

            it('row has remove button', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(9).removeRow.isPresent).to.be.true;
            });

            it('action column has content', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(1).hasContent()).to.be.true;
            });

            it('and action is not selected', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(1).action.val).to.equal('');
            });

            it('field column has content', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(2).hasContent()).to.be.true;
            });

            it('indicator1 column has content', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(3).hasContent()).to.be.true;
            });

            it('indicator2 column has content', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(4).hasContent()).to.be.true;
            });

            it('subfield column has content', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(5).hasContent()).to.be.true;
            });

            it('subaction column does not have content', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(6).hasContent()).to.be.false;
            });

            it('data column does not have content', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(7).hasContent()).to.be.false;
            });

            it('position column does not have content', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(8).hasContent()).to.be.false;
            });

            it('trash button is disabled as there is only one row present', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).isTrashDisabled).to.be.true;
            });

            describe('when Action is selected', () => {
              describe('and equal to Add', () => {
                beforeEach(async () => {
                  await mappingProfileForm.marcDetailsTable.rows(0).cells(1).action.selectAndBlur('Add');
                });

                it('then action value is equal to Add', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(1).action.val).to.equal('ADD');
                });

                it('subaction column has content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(6).hasContent()).to.be.true;
                });

                it('data column has content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(7).hasContent()).to.be.true;
                });

                it('position column does not have content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(8).hasContent()).to.be.false;
                });
              });

              describe('and equal to Delete', () => {
                beforeEach(async () => {
                  await mappingProfileForm.marcDetailsTable.rows(0).cells(1).action.selectAndBlur('Delete');
                });

                it('then action value is equal to Delete', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(1).action.val).to.equal('DELETE');
                });

                it('subaction column does not have content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(6).hasContent()).to.be.false;
                });

                it('data column does not have content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(7).hasContent()).to.be.false;
                });

                it('position column does not have content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(8).hasContent()).to.be.false;
                });
              });

              describe('and equal to Edit', () => {
                beforeEach(async () => {
                  await mappingProfileForm.marcDetailsTable.rows(0).cells(1).action.selectAndBlur('Edit');
                });

                it('then action value is equal to Edit', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(1).action.val).to.equal('EDIT');
                });

                it('subaction column has content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(6).hasContent()).to.be.true;
                });

                it('data column has content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(7).hasContent()).to.be.true;
                });

                it('position column does not have content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(8).hasContent()).to.be.false;
                });

                describe('when Insert subaction selected', () => {
                  beforeEach(async () => {
                    await mappingProfileForm.marcDetailsTable.rows(0).cells(6).subaction.selectAndBlur('Insert');
                  });

                  it('position column has content', () => {
                    expect(mappingProfileForm.marcDetailsTable.rows(0).cells(8).hasContent()).to.be.true;
                  });
                });

                describe('when Replace subaction selected', () => {
                  beforeEach(async () => {
                    await mappingProfileForm.marcDetailsTable.rows(0).cells(6).subaction.selectAndBlur('Replace');
                  });

                  it('data column has 2 fields', () => {
                    expect(mappingProfileForm.marcDetailsTable.rows(0).cells(7).dataFindField.isPresent).to.be.true;
                    expect(mappingProfileForm.marcDetailsTable.rows(0).cells(7).dataReplaceField.isPresent).to.be.true;
                  });
                });
              });

              describe('and equal to Move', () => {
                beforeEach(async () => {
                  await mappingProfileForm.marcDetailsTable.rows(0).cells(1).action.selectAndBlur('Move');
                });

                it('then action value is equal to Edit', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(1).action.val).to.equal('MOVE');
                });

                it('subaction column has content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(6).hasContent()).to.be.true;
                });

                it('data column has content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(7).hasContent()).to.be.true;
                });

                it('position column does not have content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(8).hasContent()).to.be.false;
                });
              });
            });

            describe('when plus sign is clicked', () => {
              beforeEach(async () => {
                await mappingProfileForm.marcDetailsTable.rows(0).addRow.clickIconButton();
              });

              it('then add new row', () => {
                expect(mappingProfileForm.marcDetailsTable.rowCount).to.be.equal(2);
              });
            });

            describe('when trash is clicked', () => {
              beforeEach(async () => {
                await mappingProfileForm.marcDetailsTable.rows(0).addRow.clickIconButton();
                await mappingProfileForm.marcDetailsTable.rows(0).removeRow.clickIconButton();
              });

              it('then remove row', () => {
                expect(mappingProfileForm.marcDetailsTable.rowCount).to.be.equal(1);
              });
            });
          });
        });
      });
    });
  });
});

describe('When mapping profile form', () => {
  setupApplication();

  beforeEach(async function () {
    this.visit('/settings/data-import/mapping-profiles?layer=create');
  });

  describe('is submitted and the response contains', () => {
    describe('error message', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server, {
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
        await setupFormSubmitErrorScenario(this.server);
      });

      it('then error callout appears', () => {
        expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });
});
