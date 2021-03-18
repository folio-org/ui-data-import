import { expect } from 'chai';
import { Response } from 'miragejs';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';
import wait from '../../helpers/wait';

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

function checkOptionsCount(recordType, expectedCount) {
  describe(`when ${recordType} record selected`, () => {
    beforeEach(async function () {
      await matchProfileForm.recordTypesSelect.select(recordType);
      await matchProfileForm.matchCriteria.existingRecordFieldSections.clickDropdownButton();
    });

    it('has correct count of options', () => {
      expect(matchProfileForm.matchCriteria.existingRecordFieldSections.dropdownList.optionCount).to.be.equal(expectedCount);
    });
  });
}

describe('Match profile form', () => {
  setupApplication({ scenarios: ['fetch-match-profiles-success', 'fetch-modules', 'fetch-json-schemas', 'fetch-users', 'fetch-tags'] });

  describe('appears', () => {
    beforeEach(async function () {
      this.visit('/settings/data-import/match-profiles');
      await matchProfiles.actionMenu.newProfileButton.click();
      await matchProfileForm.whenLoaded();
    });

    it('upon click on actions new profile button', () => {
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

    // eslint-disable-next-line no-only-tests/no-only-tests
    describe.skip('details accordion', () => {
      // eslint-disable-next-line no-only-tests/no-only-tests
      describe('"Record types select" component', () => {
        it('should render', () => {
          expect(matchProfileForm.recordTypesSelect.isPresent).to.be.true;
        });

        it('should show initial record select view', () => {
          expect(matchProfileForm.recordTypesSelect.initialRecord).to.be.true;
        });

        it('existing record select has correct amount of items', () => {
          expect(matchProfileForm.recordTypesSelect.items().length).to.be.equal(8);
        });

        describe('when existing record is selected', () => {
          beforeEach(async () => {
            await matchProfileForm.recordTypesSelect.select('ITEM');
          });

          it('should show compare record select view', () => {
            expect(matchProfileForm.recordTypesSelect.initialRecord).to.be.false;
            expect(matchProfileForm.recordTypesSelect.compareRecord).to.be.true;
          });

          it('incoming record button renders', () => {
            expect(matchProfileForm.recordTypesSelect.incomingRecordDropdown.isPresent).to.be.true;
          });

          it('then choose record to compare screen appears', () => {
            expect(matchProfileForm.recordTypesSelect.isPresent).to.be.true;
          });
        });

        describe('when incoming record', () => {
          beforeEach(async () => {
            await matchProfileForm.recordTypesSelect.select('ITEM');
          });

          describe('is clicked', () => {
            beforeEach(async () => {
              await matchProfileForm.recordTypesSelect.incomingRecordDropdown.clickTrigger();
            });

            it('then menu appears', () => {
              expect(matchProfileForm.recordTypesSelect.incomingRecordDropdown.isOpen).to.be.equal('true');
            });

            it('and has 6 menu items', () => {
              expect(matchProfileForm.recordTypesSelect.incomingRecordDropdown.menu.items().length).to.be.equal(6);
            });
          });

          describe('is selected', () => {
            beforeEach(async () => {
              await matchProfileForm.recordTypesSelect.incomingRecordDropdown.clickTrigger();
              await matchProfileForm.recordTypesSelect.incomingRecordDropdown.menu.items(2).click();
            });

            it('then incoming record section\'s label changes', () => {
              expect(matchProfileForm.matchCriteria.incomingRecord.label).to.be.equal('Incoming MARC Authority record');
            });

            it('and incoming record field section\'s label changes', () => {
              expect(matchProfileForm.matchCriteria.incomingRecordSections.children(0).label).to.be.equal('MARC Authority field in incoming record');
            });
          });
        });
      });

      describe('"Match criterion" component', () => {
        beforeEach(async function () {
          await matchProfileForm.recordTypesSelect.select('INSTANCE');
        });

        it('should render', () => {
          expect(matchProfileForm.matchCriteria.isPresent).to.be.true;
        });

        it('is open by default', () => {
          expect(matchProfileForm.matchCriteria.isOpen).to.be.true;
        });

        describe('"Incoming record" section', () => {
          describe('when incoming record is MARC', () => {
            beforeEach(async function () {
              await matchProfileForm.recordTypesSelect.incomingRecordDropdown.clickTrigger();
              await matchProfileForm.recordTypesSelect.incomingRecordDropdown.menu.items(0).click();
            });

            it('has correct label', () => {
              expect(matchProfileForm.matchCriteria.incomingRecord.label).to.be.equal('Incoming MARC Bibliographic record');
            });

            it('has correct length of sections', () => {
              expect(matchProfileForm.matchCriteria.incomingRecordSections.children().length).to.be.equal(3);
            });

            describe('"Incoming record field in incoming record" section', () => {
              it('has correct label', () => {
                expect(matchProfileForm.matchCriteria.incomingRecordSections.children(0).label).to.be.equal('MARC Bibliographic field in incoming record');
              });

              it('content is visible', () => {
                expect(matchProfileForm.matchCriteria.incomingRecordSections.children(0).hasContent).to.be.true;
              });

              it('is optional', () => {
                expect(matchProfileForm.matchCriteria.incomingRecordSections.children(0).hasCheckbox).to.be.false;
              });

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

            describe('"Use a qualifier" section', () => {
              it('has correct label', () => {
                expect(matchProfileForm.matchCriteria.incomingRecordSections.children(1).label).to.be.equal('Use a qualifier');
              });

              it('content is hidden', () => {
                expect(matchProfileForm.matchCriteria.incomingRecordSections.children(1).hasContent).to.be.false;
              });

              it('is optional', () => {
                expect(matchProfileForm.matchCriteria.incomingRecordSections.children(1).hasCheckbox).to.be.true;
              });

              describe('click checkbox', () => {
                beforeEach(async () => {
                  await matchProfileForm.matchCriteria.incomingRecordQualifierCheckbox.clickAndBlur();
                });

                it('checkbox is checked', () => {
                  expect(matchProfileForm.matchCriteria.incomingRecordQualifierCheckbox.isChecked).to.be.true;
                });

                it('content is visible', () => {
                  expect(matchProfileForm.matchCriteria.incomingRecordSections.children(1).hasContent).to.be.true;
                });
              });
            });

            describe('"Only compare part of the value"', () => {
              it('has correct label', () => {
                expect(matchProfileForm.matchCriteria.incomingRecordSections.children(2).label).to.be.equal('Only compare part of the value');
              });

              it('content is hidden', () => {
                expect(matchProfileForm.matchCriteria.incomingRecordSections.children(2).hasContent).to.be.false;
              });

              it('is optional', () => {
                expect(matchProfileForm.matchCriteria.incomingRecordSections.children(2).hasCheckbox).to.be.true;
              });

              describe('click checkbox', () => {
                beforeEach(async () => {
                  await matchProfileForm.matchCriteria.incomingRecordPartCheckbox.clickAndBlur();
                });

                it('checkbox is checked', () => {
                  expect(matchProfileForm.matchCriteria.incomingRecordPartCheckbox.isChecked).to.be.true;
                });

                it('content is visible', () => {
                  expect(matchProfileForm.matchCriteria.incomingRecordSections.children(2).hasContent).to.be.true;
                });
              });
            });
          });

          describe('when incoming record is Static value', () => {
            beforeEach(async function () {
              await matchProfileForm.recordTypesSelect.incomingRecordDropdown.clickTrigger();
              await matchProfileForm.recordTypesSelect.incomingRecordDropdown.menu.items(4).click();
            });

            it('has correct label', () => {
              expect(matchProfileForm.matchCriteria.incomingRecord.label).to.be.equal('Incoming Static value (submatch only) record');
            });

            it('has correct length of sections', () => {
              expect(matchProfileForm.matchCriteria.incomingRecordSections.children().length).to.be.equal(1);
            });

            describe('static value section', () => {
              it('renders', () => {
                expect(matchProfileForm.matchCriteria.staticValueSection.isPresent).to.be.true;
              });

              it('has dropdown', () => {
                expect(matchProfileForm.matchCriteria.staticValueSection.staticValueDropdown.isPresent).to.be.true;
              });

              describe('when static value type equals to', () => {
                describe('Text', () => {
                  beforeEach(async function () {
                    await matchProfileForm.matchCriteria.staticValueSection.staticValueDropdown.selectAndBlur('Text');
                  });

                  it('then text field is next to dropdown', () => {
                    expect(matchProfileForm.matchCriteria.staticValueSection.inputText.isPresent).to.be.true;
                  });
                });

                describe('Number', () => {
                  beforeEach(async function () {
                    await matchProfileForm.matchCriteria.staticValueSection.staticValueDropdown.selectAndBlur('Number');
                  });

                  it('then text field is next to dropdown', () => {
                    expect(matchProfileForm.matchCriteria.staticValueSection.inputNumber.isPresent).to.be.true;
                  });
                });

                describe('Date', () => {
                  beforeEach(async function () {
                    await matchProfileForm.matchCriteria.staticValueSection.staticValueDropdown.selectAndBlur('Date');
                  });

                  it('then one datepicker is next to dropdown', () => {
                    expect(matchProfileForm.matchCriteria.staticValueSection.inputExactDate.isPresent).to.be.true;
                  });
                });

                // eslint-disable-next-line no-only-tests/no-only-tests
                describe.skip('Date range', () => {
                  beforeEach(async function () {
                    await matchProfileForm.matchCriteria.staticValueSection.staticValueDropdown.selectAndBlur('Date range');
                  });

                  it('then From datepicker', () => {
                    expect(matchProfileForm.matchCriteria.staticValueSection.inputFromDate.isPresent).to.be.true;
                  });

                  it('and To datepicker are next to dropdown', () => {
                    expect(matchProfileForm.matchCriteria.staticValueSection.inputToDate.isPresent).to.be.true;
                  });
                });
              });
            });
          });
        });

        describe('"Match criterion" section', () => {
          it('should render', () => {
            expect(matchProfileForm.matchCriteria.matchCriterionSection.isPresent).to.be.true;
          });

          it('has correct label', () => {
            expect(matchProfileForm.matchCriteria.matchCriterion.label).to.be.equal('Match criterion');
          });

          it('should have a dropdown', () => {
            expect(matchProfileForm.matchCriteria.matchCriterionSection.dropdown.isPresent).to.be.true;
          });
        });

        describe('"Existing record" section', () => {
          it('has correct label', () => {
            expect(matchProfileForm.matchCriteria.existingRecord.label).to.be.equal('Existing Instance record');
          });

          it('has correct sections count', () => {
            expect(matchProfileForm.matchCriteria.existingRecordSections.children().length).to.be.equal(3);
          });

          describe('"Existing record field" section', () => {
            it('has correct label', () => {
              expect(matchProfileForm.matchCriteria.existingRecordSections.children(0).label).to.be.equal('Existing Instance record field');
            });

            describe('when non-MARC record selected', () => {
              beforeEach(async function () {
                await wait();
                await matchProfileForm.recordTypesSelect.select('ORDER');
                await matchProfileForm.matchCriteria.existingRecordFieldSections.clickDropdownButton();
              });

              it('has correct label', () => {
                expect(matchProfileForm.matchCriteria.existingRecordSections.children(0).label).to.be.equal('Existing Order record field');
              });

              it('dropdown is expanded', () => {
                expect(matchProfileForm.matchCriteria.existingRecordFieldSections.expandedAttribute).to.be.equal('true');
              });

              checkOptionsCount('INSTANCE', 53);
              checkOptionsCount('HOLDINGS', 20);
              checkOptionsCount('ITEM', 14);
              checkOptionsCount('ORDER', 30);
              checkOptionsCount('INVOICE', 21);
            });
          });

          describe('"Use a qualifier section" section', () => {
            it('has correct label', () => {
              expect(matchProfileForm.matchCriteria.existingRecordSections.children(1).label).to.be.equal('Use a qualifier');
            });

            it('is optional', () => {
              expect(matchProfileForm.matchCriteria.existingRecordSections.children(1).hasCheckbox).to.be.true;
            });

            it('content is hidden', () => {
              expect(matchProfileForm.matchCriteria.existingRecordSections.children(1).hasContent).to.be.false;
            });

            describe('click checkbox', () => {
              beforeEach(async () => {
                await matchProfileForm.matchCriteria.existingRecordQualifierCheckbox.clickAndBlur();
              });

              it('checkbox is checked', () => {
                expect(matchProfileForm.matchCriteria.existingRecordQualifierCheckbox.isChecked).to.be.true;
              });

              it('content is visible', () => {
                expect(matchProfileForm.matchCriteria.existingRecordSections.children(1).hasContent).to.be.true;
              });
            });
          });

          describe('"Only compare part of the value"', () => {
            it('has correct label', () => {
              expect(matchProfileForm.matchCriteria.existingRecordSections.children(2).label).to.be.equal('Only compare part of the value');
            });

            it('is optional', () => {
              expect(matchProfileForm.matchCriteria.existingRecordSections.children(2).hasCheckbox).to.be.true;
            });

            it('content is hidden', () => {
              expect(matchProfileForm.matchCriteria.existingRecordSections.children(2).hasContent).to.be.false;
            });

            describe('click checkbox', () => {
              beforeEach(async () => {
                await matchProfileForm.matchCriteria.existingRecordPartCheckbox.clickAndBlur();
              });

              it('checkbox is checked', () => {
                expect(matchProfileForm.matchCriteria.existingRecordPartCheckbox.isChecked).to.be.true;
              });

              it('content is visible', () => {
                expect(matchProfileForm.matchCriteria.existingRecordSections.children(2).hasContent).to.be.true;
              });
            });
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
        await matchProfileForm.matchCriteria.inputMain.fillAndBlur('010');
        await matchProfileForm.matchCriteria.inputSubfield.fillAndBlur('a');
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
        await matchProfileForm.matchCriteria.inputMain.fillAndBlur('010');
        await matchProfileForm.matchCriteria.inputSubfield.fillAndBlur('a');
        await setupFormSubmitErrorScenario(this.server);
      });

      it('then error callout appears', () => {
        expect(matchProfileForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });
});
