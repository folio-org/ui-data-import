import { expect } from 'chai';
import { Response } from 'miragejs';
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
            expect(mappingProfileForm.detailsSection.header.mappedLabel).to.be.equal('Field mapping');
            expect(mappingProfileForm.detailsSection.header.mappableLabel).to.be.equal('MARC Bibliographic');
          });

          // eslint-disable-next-line no-only-tests/no-only-tests
          describe.skip('MARC details table', () => {
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
              expect(mappingProfileForm.marcDetailsTable.rows(0).moveRowUp.isPresent).to.be.false;
              expect(mappingProfileForm.marcDetailsTable.rows(0).moveRowDown.isPresent).to.be.false;
            });

            it('row has add button', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).addRow.isPresent).to.be.true;
            });

            it('row has remove button', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).removeRow.isPresent).to.be.true;
            });

            it('action column has content', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).cells(1).hasContent()).to.be.true;
            });

            it('and action is not selected', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).action.val).to.equal('');
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

            it('remove row button is disabled as there is only one row present', () => {
              expect(mappingProfileForm.marcDetailsTable.rows(0).isTrashDisabled).to.be.true;
            });

            describe('when Action is selected', () => {
              describe('and equal to Add', () => {
                beforeEach(async () => {
                  await mappingProfileForm.marcDetailsTable.rows(0).action.selectAndBlur('Add');
                });

                it('then action value is equal to Add', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).action.val).to.equal('ADD');
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

                describe('validation', () => {
                  beforeEach(async () => {
                    await mappingProfileForm.nameField.fillAndBlur('Test name');
                    await mappingProfileForm.incomingRecordTypeField.selectAndBlur('MARC Bibliographic');
                  });

                  describe('when "field" field is empty', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field is filled in with "001" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('001');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field is filled in with "005" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('005');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field is filled in with "999" value and indicators are filled in with "f" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('999');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator1.fillAndBlur('f');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator2.fillAndBlur('f');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });

                    it('then "indicator1" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator1.hasErrorStyle).to.be.true;
                    });

                    it('then "indicator2" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator2.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "data" field is empty', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).dataTextField.fillAndBlur('');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "data" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).dataTextField.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field and "data" field are filled in, but "subfield" field is empty', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('900');
                      await mappingProfileForm.marcDetailsTable.rows(0).dataTextField.fillAndBlur('test');
                      await mappingProfileForm.marcDetailsTable.rows(0).subfield.fillAndBlur('');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "subfield" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).subfield.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "indicator1" or "indicator2" or "subfield" field is filled in with "*" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator1.fillAndBlur('*');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator2.fillAndBlur('*');
                      await mappingProfileForm.marcDetailsTable.rows(0).subfield.fillAndBlur('*');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "indicator1" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator1.hasErrorStyle).to.be.true;
                    });

                    it('then "indicator2" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator2.hasErrorStyle).to.be.true;
                    });

                    it('then "subfield" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).subfield.hasErrorStyle).to.be.true;
                    });
                  });
                });
              });

              describe('and equal to Delete', () => {
                beforeEach(async () => {
                  await mappingProfileForm.marcDetailsTable.rows(0).action.selectAndBlur('Delete');
                });

                it('then action value is equal to Delete', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).action.val).to.equal('DELETE');
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

                describe('validation', () => {
                  beforeEach(async () => {
                    await mappingProfileForm.nameField.fillAndBlur('Test name');
                    await mappingProfileForm.incomingRecordTypeField.selectAndBlur('MARC Bibliographic');
                  });

                  describe('when "field" field is empty', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field is filled in with "001" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('001');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field is filled in with "005" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('005');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field is filled in with "999" value and indicators are filled in with "f" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('999');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator1.fillAndBlur('f');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator2.fillAndBlur('f');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });

                    it('then "indicator1" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator1.hasErrorStyle).to.be.true;
                    });

                    it('then "indicator2" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator2.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field and "indicator1" field are filled in, but "subfield" field is empty', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('900');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator1.fillAndBlur('a');
                      await mappingProfileForm.marcDetailsTable.rows(0).subfield.fillAndBlur('');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "subfield" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).subfield.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "indicator1" or "indicator2" or "subfield" field is filled in with allowed for DELETE action "*" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator1.fillAndBlur('*');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator2.fillAndBlur('*');
                      await mappingProfileForm.marcDetailsTable.rows(0).subfield.fillAndBlur('*');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "indicator1" field has not error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator1.hasErrorStyle).to.be.false;
                    });

                    it('then "indicator2" field has not error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator2.hasErrorStyle).to.be.false;
                    });

                    it('then "subfield" field has not error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).subfield.hasErrorStyle).to.be.false;
                    });
                  });
                });
              });

              describe('and equal to Edit', () => {
                beforeEach(async () => {
                  await mappingProfileForm.marcDetailsTable.rows(0).action.selectAndBlur('Edit');
                });

                it('then action value is equal to Edit', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).action.val).to.equal('EDIT');
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

                it('indicator1 is filled in with "*" by default', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).indicator1.val).to.equal('*');
                });

                it('indicator2 is filled in with "*" by default', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).indicator2.val).to.equal('*');
                });

                it('subfield is filled in with "*" by default', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).subfield.val).to.equal('*');
                });

                describe('when Insert subaction selected', () => {
                  beforeEach(async () => {
                    await mappingProfileForm.marcDetailsTable.rows(0).subaction.selectAndBlur('Insert');
                  });

                  it('position column has content', () => {
                    expect(mappingProfileForm.marcDetailsTable.rows(0).cells(8).hasContent()).to.be.true;
                  });
                });

                describe('when Replace subaction selected', () => {
                  beforeEach(async () => {
                    await mappingProfileForm.marcDetailsTable.rows(0).subaction.selectAndBlur('Replace');
                  });

                  it('data column has 2 fields', () => {
                    expect(mappingProfileForm.marcDetailsTable.rows(0).dataFindField.isPresent).to.be.true;
                    expect(mappingProfileForm.marcDetailsTable.rows(0).dataReplaceField.isPresent).to.be.true;
                  });
                });

                describe('validation', () => {
                  beforeEach(async () => {
                    await mappingProfileForm.nameField.fillAndBlur('Test name');
                    await mappingProfileForm.incomingRecordTypeField.selectAndBlur('MARC Bibliographic');
                    await mappingProfileForm.marcDetailsTable.rows(0).subaction.selectAndBlur('Insert');
                  });

                  describe('when "field" field is empty', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field is filled in with "001" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('001');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field is filled in with "005" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('005');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field is filled in with "999" value and indicators are filled in with "f" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('999');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator1.fillAndBlur('f');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator2.fillAndBlur('f');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });

                    it('then "indicator1" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator1.hasErrorStyle).to.be.true;
                    });

                    it('then "indicator2" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator2.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "indicator1" or "indicator2" or "subfield" field is filled in with "*" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator1.fillAndBlur('*');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator2.fillAndBlur('*');
                      await mappingProfileForm.marcDetailsTable.rows(0).subfield.fillAndBlur('*');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "indicator1" field does not have error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator1.hasErrorStyle).to.be.false;
                    });

                    it('then "indicator2" field does not have error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator2.hasErrorStyle).to.be.false;
                    });

                    it('then "subfield" field does not have error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).subfield.hasErrorStyle).to.be.false;
                    });
                  });

                  describe('when "indicator1" or "indicator2" or "subfield" field is filled in with punctuation character', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator1.fillAndBlur('.');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator2.fillAndBlur('.');
                      await mappingProfileForm.marcDetailsTable.rows(0).subfield.fillAndBlur('.');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "indicator1" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator1.hasErrorStyle).to.be.true;
                    });

                    it('then "indicator2" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator2.hasErrorStyle).to.be.true;
                    });

                    it('then "subfield" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).subfield.hasErrorStyle).to.be.true;
                    });
                  });
                });
              });

              describe('and equal to Move', () => {
                beforeEach(async () => {
                  await mappingProfileForm.marcDetailsTable.rows(0).action.selectAndBlur('Move');
                });

                it('then action value is equal to Move', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).action.val).to.equal('MOVE');
                });

                it('subaction column has content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(6).hasContent()).to.be.true;
                });

                it('position column does not have content', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).cells(8).hasContent()).to.be.false;
                });

                it('indicator1 is filled in with "*" by default', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).indicator1.val).to.equal('*');
                });

                it('indicator2 is filled in with "*" by default', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).indicator2.val).to.equal('*');
                });

                it('subfield is filled in with "*" by default', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).subfield.val).to.equal('*');
                });

                describe('validation', () => {
                  beforeEach(async () => {
                    await mappingProfileForm.nameField.fillAndBlur('Test name');
                    await mappingProfileForm.incomingRecordTypeField.selectAndBlur('MARC Bibliographic');
                    await mappingProfileForm.marcDetailsTable.rows(0).subaction.selectAndBlur('New field');
                  });

                  describe('when "field" field is empty', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field is filled in with "001" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('001');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field is filled in with "005" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('005');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "field" field is filled in with "999" value and indicators are filled in with "f" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('999');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator1.fillAndBlur('f');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator2.fillAndBlur('f');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "field" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).tag.hasErrorStyle).to.be.true;
                    });

                    it('then "indicator1" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator1.hasErrorStyle).to.be.true;
                    });

                    it('then "indicator2" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator2.hasErrorStyle).to.be.true;
                    });
                  });

                  describe('when "data" field', () => {
                    describe('has the same fields as in column 3', () => {
                      beforeEach(async () => {
                        await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('900');
                        await mappingProfileForm.marcDetailsTable.rows(0).dataTagField.fillAndBlur('900');
                        await mappingProfileForm.submitFormButton.click();
                      });

                      it('then "data" field has error style', () => {
                        expect(mappingProfileForm.marcDetailsTable.rows(0).dataTagField.hasErrorStyle).to.be.true;
                      });
                    });

                    describe('is empty', () => {
                      beforeEach(async () => {
                        await mappingProfileForm.marcDetailsTable.rows(0).dataTagField.fillAndBlur('');
                        await mappingProfileForm.submitFormButton.click();
                      });

                      it('then "data" field has error style', () => {
                        expect(mappingProfileForm.marcDetailsTable.rows(0).dataTagField.hasErrorStyle).to.be.true;
                      });
                    });
                  });

                  describe('when "indicator1" or "indicator2" or "subfield" field is filled in with "*" value', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator1.fillAndBlur('*');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator2.fillAndBlur('*');
                      await mappingProfileForm.marcDetailsTable.rows(0).subfield.fillAndBlur('*');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "indicator1" field does not have error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator1.hasErrorStyle).to.be.false;
                    });

                    it('then "indicator2" field does not have error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator2.hasErrorStyle).to.be.false;
                    });

                    it('then "subfield" field does not have error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).subfield.hasErrorStyle).to.be.false;
                    });
                  });

                  describe('when "indicator1" or "indicator2" or "subfield" field is filled in with punctuation character', () => {
                    beforeEach(async () => {
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator1.fillAndBlur('.');
                      await mappingProfileForm.marcDetailsTable.rows(0).indicator2.fillAndBlur('.');
                      await mappingProfileForm.marcDetailsTable.rows(0).subfield.fillAndBlur('.');
                      await mappingProfileForm.submitFormButton.click();
                    });

                    it('then "indicator1" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator1.hasErrorStyle).to.be.true;
                    });

                    it('then "indicator2" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).indicator2.hasErrorStyle).to.be.true;
                    });

                    it('then "subfield" field has error style', () => {
                      expect(mappingProfileForm.marcDetailsTable.rows(0).subfield.hasErrorStyle).to.be.true;
                    });
                  });
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

            describe('when remove row button is clicked', () => {
              beforeEach(async () => {
                await mappingProfileForm.marcDetailsTable.rows(0).addRow.clickIconButton();
                await mappingProfileForm.marcDetailsTable.rows(0).removeRow.clickIconButton();
              });

              it('should remove row', () => {
                expect(mappingProfileForm.marcDetailsTable.rowCount).to.be.equal(1);
              });
            });

            describe('Move buttons', () => {
              beforeEach(async () => {
                await mappingProfileForm.marcDetailsTable.rows(0).addRow.clickIconButton();
                await mappingProfileForm.marcDetailsTable.rows(0).action.selectAndBlur('Add');
                await mappingProfileForm.marcDetailsTable.rows(1).action.selectAndBlur('Delete');
              });

              describe('when move up button is clicked', () => {
                beforeEach(async () => {
                  await mappingProfileForm.marcDetailsTable.rows(1).moveRowUp.clickIconButton();
                });

                it('then row should move up', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).action.val).to.be.equal('DELETE');
                  expect(mappingProfileForm.marcDetailsTable.rows(1).action.val).to.be.equal('ADD');
                });
              });

              describe('when move down button is clicked', () => {
                beforeEach(async () => {
                  await mappingProfileForm.marcDetailsTable.rows(0).moveRowDown.clickIconButton();
                });

                it('then row should move down', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).action.val).to.be.equal('DELETE');
                  expect(mappingProfileForm.marcDetailsTable.rows(1).action.val).to.be.equal('ADD');
                });
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
        expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true; // fail
      });
    });

    describe('network error', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server);
      });

      it('then error callout appears', () => {
        expect(mappingProfileForm.callout.errorCalloutIsPresent).to.be.true; // fail
      });
    });
  });
});
