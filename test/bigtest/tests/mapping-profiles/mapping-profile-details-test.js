import { expect } from 'chai';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import {
  datePickerOptions,
  startDateFuture,
  repeatableDataOptions,
} from '../../constants';
import { setupApplication } from '../../helpers';
import { associatedActionProfiles } from '../../mocks';
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

      // eslint-disable-next-line no-only-tests/no-only-tests
      describe.skip('field has Remove button', () => {
        it('field has Remove button', () => {
          const fieldsLength = mappingProfileForm[details][accordion][field].items().length;
          const newFieldOrder = fieldsLength ? (fieldsLength - 1) : 0;

          expect(mappingProfileForm[details][accordion][field].items(newFieldOrder).hasRemoveButton).to.be.true;
        });
      });

      describe('when Remove button is clicked', () => {
        beforeEach(async () => {
          const fieldsLength = mappingProfileForm[details][accordion][field].items().length;
          const newFieldOrder = fieldsLength ? (fieldsLength - 1) : 0;

          await mappingProfileForm[details][accordion][field].items(newFieldOrder).clickRemoveButton();
        });

        it('then field is removed', () => {
          expect(mappingProfileForm[details][accordion][field].items().length).to.equal(1);
        });
      });
    });
  }
};

const hasTable = (details, accordion, table, tableName, columnCount, columnHeaders) => {
  describe(`${tableName} table`, () => {
    it('renders', () => {
      expect(mappingProfileDetails[details][accordion][table].containerPresent).to.be.true;
    });

    it('has proper count of columns', () => {
      expect(mappingProfileDetails[details][accordion][table].columnCount).to.be.equal(columnCount);
    });

    it('has correct column headers', () => {
      mappingProfileDetails[details][accordion][table].headers().forEach((header, i) => {
        expect(header.text).to.equal(columnHeaders[i]);
      });
    });
  });
};

const hasBooleanActionsField = (details, accordion, field, fieldLabel, optionToSelect, isMCL = false, table = null, columnCells = [], isDisabled = false) => {
  describe('When boolean actions decorator applies', () => {
    it(`has correct ${fieldLabel} field label`, () => {
      expect(mappingProfileForm[details][accordion][field].label).to.equal(fieldLabel);
    });

    it(`has ${fieldLabel} select`, () => {
      expect(mappingProfileForm[details][accordion][field].hasSelect).to.be.true;
    });

    if (!isDisabled) {
      it('has selected default option', () => {
        expect(mappingProfileForm[details][accordion][field].val).to.equal('');
      });

      // eslint-disable-next-line no-only-tests/no-only-tests
      describe.skip(`when option "${optionToSelect}" selected and form is submitted`, () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][field].selectAndBlur(optionToSelect);
          await mappingProfileForm.submitFormButton.click();
        });

        if (!isMCL) {
          it(`then mapping profile details renders updated ${fieldLabel} field`, () => {
            expect(mappingProfileDetails[details][accordion][field].value.text).to.be.equal(optionToSelect);
          });
        } else {
          it(`then mapping profile details renders updated ${fieldLabel} field`, () => {
            mappingProfileDetails[details][accordion][table].rows(0).cells().forEach((cell, i) => {
              expect(cell.text).to.equal(columnCells[i]);
            });
          });
        }
      });
    }
  });
};

const hasReferenceValuesDecorator = (details, accordion, field, fieldLabel, dropdown, isMCL = false, repeatableFields = null, columnCells = []) => {
  describe('When accepted values decorator applies', () => {
    it(`has correct ${fieldLabel} field label`, () => {
      expect(mappingProfileForm[details][accordion][field].label).to.equal(fieldLabel);
    });

    it('accepted values dropdown exists', () => {
      expect(mappingProfileForm[details][accordion][dropdown].isPresent).to.be.true;
    });

    describe('Accepts only valid values', () => {
      describe('when value is MARC value', () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][field].fillValue('510');
          await mappingProfileForm[details][accordion][field].blurInput();
        });

        it('then field is valid', () => {
          expect(mappingProfileForm[details][accordion][field].hasErrorStyle).to.be.false;
        });
      });

      describe('when value is MARC value with subfield', () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][field].fillValue('510$a');
          await mappingProfileForm[details][accordion][field].blurInput();
        });

        it('then field is valid', () => {
          expect(mappingProfileForm[details][accordion][field].hasErrorStyle).to.be.false;
        });
      });

      describe('when 1st part of value is mark value and 2nd selected from dropdown', () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][field].fillValue('510$a');
          await mappingProfileForm[details][accordion][dropdown].clickTrigger();
          await mappingProfileForm[details][accordion][dropdown].menu.items(0).click();
          await mappingProfileForm[details][accordion][field].blurInput();
        });

        it('then field is valid', () => {
          expect(mappingProfileForm[details][accordion][field].hasErrorStyle).to.be.false;
        });
      });

      describe('when value has expression like: "mark_value; else "option""', () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][field].fillValue('510$a; else');
          await mappingProfileForm[details][accordion][dropdown].clickTrigger();
          await mappingProfileForm[details][accordion][dropdown].menu.items(0).click();
          await mappingProfileForm[details][accordion][field].blurInput();
        });

        it('then field is valid', () => {
          expect(mappingProfileForm[details][accordion][field].hasErrorStyle).to.be.false;
        });
      });

      describe('when value has space between field and subfield', () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][field].fillValue('910 $a');
          await mappingProfileForm[details][accordion][field].blurInput();
        });

        it('then field is invalid', () => {
          expect(mappingProfileForm[details][accordion][field].hasErrorStyle).to.be.true;
        });
      });

      describe('when value is any of text', () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][field].fillValue('test1');
          await mappingProfileForm[details][accordion][field].blurInput();
        });

        it('then field is invalid', () => {
          expect(mappingProfileForm[details][accordion][field].hasErrorStyle).to.be.true;
        });
      });
    });

    // eslint-disable-next-line no-only-tests/no-only-tests
    describe.skip('when accepted values dropdown is clicked', () => {
      beforeEach(async () => {
        await mappingProfileForm[details][accordion][dropdown].clickTrigger();
      });

      it('then menu is open', () => {
        expect(mappingProfileForm[details][accordion][dropdown].isOpen).to.be.equal('true');
      });

      it('and has correct amount of menu items', () => {
        if (field === 'status') {
          expect(mappingProfileForm[details][accordion][dropdown].menu.items().length).to.be.equal(12);
        } else {
          expect(mappingProfileForm[details][accordion][dropdown].menu.items().length).to.be.equal(2);
        }
      });
    });

    describe('when accepted value is selected in first time', () => {
      beforeEach(async () => {
        await mappingProfileForm[details][accordion][field].fillValue('');
        await mappingProfileForm[details][accordion][dropdown].clickTrigger();
        await mappingProfileForm[details][accordion][dropdown].menu.items(0).click();
      });

      it('then input field value extend with selected one', () => {
        switch (field) {
          case 'status':
            expect(mappingProfileForm[details][accordion][field].val).to.equal('"Available"');
            break;
          case 'statisticalCode':
            expect(mappingProfileForm[details][accordion][field].val).to.equal('"statistical 1: ASER - name 1"');
            break;
          case 'permanent':
            expect(mappingProfileForm[details][accordion][field].val).to.equal('"name 1 (ASER)"');
            break;
          case 'temporary':
            expect(mappingProfileForm[details][accordion][field].val).to.equal('"name 1 (ASER)"');
            break;
          default:
            expect(mappingProfileForm[details][accordion][field].val).to.equal('"name 1"');
        }
      });
    });

    describe('when accepted value is selected in second time', () => {
      beforeEach(async () => {
        await mappingProfileForm[details][accordion][field].fillValue('');
        await mappingProfileForm[details][accordion][dropdown].clickTrigger();
        await mappingProfileForm[details][accordion][dropdown].menu.items(0).click();
        await mappingProfileForm[details][accordion][dropdown].clickTrigger();
        await mappingProfileForm[details][accordion][dropdown].menu.items(1).click();
      });

      it('then input field value inside quotation marks should be replaced with selected value', () => {
        switch (field) {
          case 'status':
            expect(mappingProfileForm[details][accordion][field].val).to.equal('"Awaiting pickup"');
            break;
          case 'statisticalCode':
            expect(mappingProfileForm[details][accordion][field].val).to.equal('"statistical 2: ASER - name 2"');
            break;
          case 'permanent':
            expect(mappingProfileForm[details][accordion][field].val).to.equal('"name 2 (ASER)"');
            break;
          case 'temporary':
            expect(mappingProfileForm[details][accordion][field].val).to.equal('"name 2 (ASER)"');
            break;
          default:
            expect(mappingProfileForm[details][accordion][field].val).to.equal('"name 2"');
        }
      });
    });

    // eslint-disable-next-line no-only-tests/no-only-tests
    describe.skip('when form is submitted', () => {
      beforeEach(async () => {
        await mappingProfileForm[details][accordion][field].fillValue('');
        await mappingProfileForm[details][accordion][dropdown].clickTrigger();
        await mappingProfileForm[details][accordion][dropdown].menu.items(0).click();
        await mappingProfileForm.submitFormButton.click();
      });

      it(`then mapping profile details renders updated ${fieldLabel} field`, () => {
        if (isMCL) {
          mappingProfileDetails[details][accordion][repeatableFields]?.rows(0).cells().forEach((cell, i) => {
            expect(cell.text).to.equal(columnCells[i]);
          });
        } else {
          switch (field) {
            case 'status':
              expect(mappingProfileDetails[details][accordion][field].value.text).to.be.equal('"Available"');
              break;
            case 'permanent':
              expect(mappingProfileForm[details][accordion][field].val).to.equal('"name 1 (ASER)"');
              break;
            case 'temporary':
              expect(mappingProfileForm[details][accordion][field].val).to.equal('"name 1 (ASER)"');
              break;
            default:
              expect(mappingProfileDetails[details][accordion][field].value.text).to.be.equal('"name 1"');
          }
        }
      });
    });
  });
};

const hasDatePickerDecorator = (details, accordion, field, fieldLabel, dropdown, dataPicker) => {
  describe('When DatePicker decorator applies', () => {
    it(`it has correct ${fieldLabel} field label`, () => {
      expect(mappingProfileForm[details][accordion][field].label).to.equal(fieldLabel);
    });

    it('accepted values dropdown exists', () => {
      expect(mappingProfileForm[details][accordion][dropdown].isPresent).to.be.true;
    });

    describe('when accepted values dropdown is clicked', () => {
      beforeEach(async () => {
        await mappingProfileForm[details][accordion][dropdown].clickTrigger();
      });

      it('then menu is open', () => {
        expect(mappingProfileForm[details][accordion][dropdown].isOpen).to.be.equal('true');
      });

      it('and has 2 correct menu options', () => {
        mappingProfileForm[details][accordion][dropdown].menu.items().forEach((option, i) => {
          expect(option.text).to.equal(datePickerOptions[i]);
        });
      });
    });

    describe('when 1st option from dropdown is choosen', () => {
      beforeEach(async () => {
        await mappingProfileForm[details][accordion][field].fillValue('');
        await mappingProfileForm[details][accordion][dropdown].clickTrigger();
        await mappingProfileForm[details][accordion][dropdown].menu.items(0).click();
      });

      it('then input field is filled in with ###TODAY### value', () => {
        expect(mappingProfileForm[details][accordion][field].val).to.equal('###TODAY###');
      });

      describe('when 2nd option from select is choosen after 1st option was already choosen', () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][dropdown].clickTrigger();
          await mappingProfileForm[details][accordion][dropdown].menu.items(1).click();

          describe('and date choosen', () => {
            beforeEach(async () => {
              await mappingProfileForm[details][accordion][dataPicker].calendarButton.click();
              await mappingProfileForm[details][accordion][dataPicker].calendar.days(20).click();
              await mappingProfileForm[details][accordion][dataPicker].blurInput();
            });

            it('then the previous date value is replaced with the picked date', () => {
              expect(mappingProfileForm[details][accordion][field].val).to.equal('"2020-06-20"');
            });
          });
        });
      });
    });

    describe('when 2nd option from select is choosen', () => {
      beforeEach(async () => {
        await mappingProfileForm[details][accordion][field].fillValue('');
        await mappingProfileForm[details][accordion][dropdown].clickTrigger();
        await mappingProfileForm[details][accordion][dropdown].menu.items(1).click();
      });

      it('then datepicker field is appears', () => {
        expect(mappingProfileForm[details][accordion][dataPicker].isPresent).to.be.true;
      });

      it('and it has calendar button', () => {
        expect(mappingProfileForm[details][accordion][dataPicker].calendarButton.isPresent).to.be.true;
      });

      describe('date can be choosen', () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][dataPicker].calendarButton.click();
          await mappingProfileForm[details][accordion][dataPicker].calendar.days(20).click();
          await mappingProfileForm[details][accordion][dataPicker].blurInput();
        });

        describe('when 1st option from select is choosen after 2nd option was already choosen', () => {
          beforeEach(async () => {
            await mappingProfileForm[details][accordion][dropdown].clickTrigger();
            await mappingProfileForm[details][accordion][dropdown].menu.items(0).click();
          });

          it('then the previous date value is replaced with ###TODAY### value', () => {
            expect(mappingProfileForm[details][accordion][field].val).to.equal('###TODAY###');
          });
        });
      });
    });

    describe('It accepts only valid values', () => {
      describe('when value is "###TODAY###"', () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][field].fillValue('###TODAY###');
          await mappingProfileForm[details][accordion][field].blurInput();
        });

        it('then field is valid', () => {
          expect(mappingProfileForm[details][accordion][field].hasErrorStyle).to.be.false;
        });
      });

      describe('when value is valid date and in quotes', () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][field].fillValue(`"${startDateFuture}"`);
          await mappingProfileForm[details][accordion][field].blurInput();
        });

        it('then field is valid', () => {
          expect(mappingProfileForm[details][accordion][field].hasErrorStyle).to.be.false;
        });
      });

      describe('when value is valid date and without quotes', () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][field].fillValue(startDateFuture);
          await mappingProfileForm[details][accordion][field].blurInput();
        });

        it('then field is invalid', () => {
          expect(mappingProfileForm[details][accordion][field].hasErrorStyle).to.be.true;
        });
      });

      describe('when value is incorrect date', () => {
        beforeEach(async () => {
          await mappingProfileForm[details][accordion][field].fillValue('"2020-15-52"');
          await mappingProfileForm[details][accordion][field].blurInput();
        });

        it('then field is invalid', () => {
          expect(mappingProfileForm[details][accordion][field].hasErrorStyle).to.be.true;
        });
      });
    });
  });
};

const checkRepeatableDataOptions = (key, details, accordion, select) => {
  // eslint-disable-next-line no-only-tests/no-only-tests
  describe.skip('selecting option', () => {
    beforeEach(async () => {
      await mappingProfileForm[details][accordion][select].selectOption(repeatableDataOptions[key]);
    });

    it('updates the value', () => {
      expect(mappingProfileForm[details][accordion][select].val).to.equal(key);
    });
  });
};

const hasRepeatableFieldDecorator = (details, accordion, select, isDisabled = false) => {
  if (!isDisabled) {
    describe('When RepeatableField decorator applies', () => {
      it('Repeatable action decorator exists', () => {
        expect(mappingProfileForm[details][accordion][select].hasSelect).to.be.true;
      });

      it('has no label tag', () => {
        expect(mappingProfileForm[details][accordion][select].hasLabel).to.be.false;
      });

      Object.keys(repeatableDataOptions).map(key => checkRepeatableDataOptions(key, details, accordion, select));
    });
  }
};

describe('Mapping Profile View', () => {
  setupApplication({ scenarios: ['fetch-mapping-profiles-success', 'fetch-users', 'fetch-tags', 'tags-enabled', 'fetch-accepted-values'] });

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

    // eslint-disable-next-line no-only-tests/no-only-tests
    describe.skip('edit mapping profile form', () => {
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

  // eslint-disable-next-line no-only-tests/no-only-tests
  describe.skip('details section', () => {
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
            hasTable('instanceDetails', 'adminDataAccordion', 'statisticalCodes', 'Statistical codes', 1, ['Statistical code']);
          });

          describe('Title data accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.titleDataAccordion.label).to.equal('Title data');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.titleDataAccordion.isOpen).to.be.true;
            });

            hasField('instanceDetails', 'titleDataAccordion', 'resourceTitle', 'Resource title');
            hasTable('instanceDetails', 'titleDataAccordion', 'alternativeTitles',
              'Alternative titles', 2, ['Type', 'Alternative title']);
            hasField('instanceDetails', 'titleDataAccordion', 'indexTitle', 'Index title');
            hasTable('instanceDetails', 'titleDataAccordion', 'seriesStatement',
              'Series statements', 1, ['Series statement']);
            hasTable('instanceDetails', 'titleDataAccordion', 'precedingTitles',
              'Preceding titles', 4, ['Title', 'Instance HRID', 'Instance ISBN', 'Instance ISSN']);
            hasTable('instanceDetails', 'titleDataAccordion', 'succeedingTitles',
              'Succeeding titles', 4, ['Title', 'Instance HRID', 'Instance ISBN', 'Instance ISSN']);
          });

          describe('Identifier accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.identifierAccordion.label).to.equal('Identifier');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.identifierAccordion.isOpen).to.be.true;
            });

            hasTable('instanceDetails', 'identifierAccordion', 'identifiers',
              'Identifiers', 2, ['Type', 'Value']);
          });

          describe('Contributor accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.contributorAccordion.label).to.equal('Contributor');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.contributorAccordion.isOpen).to.be.true;
            });

            hasTable('instanceDetails', 'contributorAccordion', 'contributors',
              'Contributors', 5, ['Name', 'Name type', 'Type', 'Type, free text', 'Primary']);
          });

          describe('Descriptive data accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.descriptiveDataAccordion.label).to.equal('Descriptive data');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.descriptiveDataAccordion.isOpen).to.be.true;
            });

            hasTable('instanceDetails', 'descriptiveDataAccordion', 'publications',
              'Publications', 4, ['Publisher', 'Publisher role', 'Place', 'Publication date']);
            hasTable('instanceDetails', 'descriptiveDataAccordion', 'editions',
              'Editions', 1, ['Edition']);
            hasTable('instanceDetails', 'descriptiveDataAccordion', 'physicalDescriptions',
              'Physical descriptions', 1, ['Physical description']);
            hasField('instanceDetails', 'descriptiveDataAccordion', 'resourceType', 'Resource type');
            hasTable('instanceDetails', 'descriptiveDataAccordion', 'natureOfContentTerms',
              'Nature of content terms', 1, ['Nature of content term']);
            hasTable('instanceDetails', 'descriptiveDataAccordion', 'formats',
              'Formats', 1, ['Format']);
            hasTable('instanceDetails', 'descriptiveDataAccordion', 'languages',
              'Languages', 1, ['Language']);
            hasTable('instanceDetails', 'descriptiveDataAccordion', 'publicationFrequencies',
              'Publication frequencies', 1, ['Publication frequency']);
            hasTable('instanceDetails', 'descriptiveDataAccordion', 'publicationRange',
              'Publication range', 1, ['Publication range']);
          });

          describe('Instance notes accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.instanceNotesAccordion.label).to.equal('Instance notes');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.instanceNotesAccordion.isOpen).to.be.true;
            });

            hasTable('instanceDetails', 'instanceNotesAccordion', 'notes',
              'Instance notes', 3, ['Note type', 'Note', 'Staff only']);
          });

          // eslint-disable-next-line no-only-tests/no-only-tests
          describe.skip('Electronic access accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.electronicAccessAccordion.label).to.equal('Electronic access');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.electronicAccessAccordion.isOpen).to.be.true;
            });

            hasTable('instanceDetails', 'electronicAccessAccordion', 'electronicAccess',
              'Electronic access', 5, ['Relationship', 'URI', 'Link text', 'Materials specified', 'URL public note']);
          });

          describe('Subject accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.subjectAccordion.label).to.equal('Subject');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.subjectAccordion.isOpen).to.be.true;
            });

            hasTable('instanceDetails', 'subjectAccordion', 'subjects',
              'Subjects', 1, ['Subjects']);
          });

          describe('Classification accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.classificationAccordion.label).to.equal('Classification');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.classificationAccordion.isOpen).to.be.true;
            });

            hasTable('instanceDetails', 'classificationAccordion', 'classifications',
              'Classifications', 2, ['Classification identifier type', 'Classification']);
          });

          describe('Instance relationship accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.instanceDetails.instanceRelationshipAccordion.label).to.equal('Instance relationship (analytics and bound-with)');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.instanceDetails.instanceRelationshipAccordion.isOpen).to.be.true;
            });

            hasTable('instanceDetails', 'instanceRelationshipAccordion', 'parentInstances',
              'Parent instances', 2, ['Parent instance', 'Type of relation']);
            hasTable('instanceDetails', 'instanceRelationshipAccordion', 'childInstances',
              'Child instances', 2, ['Child instance', 'Type of relation']);
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
            hasTable('holdingsDetails', 'adminDataAccordion', 'formerHoldings', 'Former holdings',
              1, ['Former holdings ID']);
            hasField('holdingsDetails', 'adminDataAccordion', 'holdingsType', 'Holdings type');
            hasTable('holdingsDetails', 'adminDataAccordion', 'statisticalCodes', 'Statistical codes',
              1, ['Statistical code']);
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
            hasTable('holdingsDetails', 'holdingsDetailsAccordion', 'statements', 'Holdings statements',
              2, ['Holdings statement', 'Statement note']);
            hasTable('holdingsDetails', 'holdingsDetailsAccordion', 'statementsForSuppl', 'Holdings statements for supplement',
              2, ['Holdings statement', 'Statement note']);
            hasTable('holdingsDetails', 'holdingsDetailsAccordion', 'statementsForNotes', 'Holdings statements for indexes',
              2, ['Holdings statement', 'Statement note']);
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

            hasTable('holdingsDetails', 'holdingsNotesAccordion', 'notes', 'Holding notes',
              3, ['Note type', 'Note', 'Staff only']);
          });

          describe('Electronic access accordion', () => {
            it('renders', () => {
              expect(mappingProfileDetails.holdingsDetails.electronicAccessAccordion.label).to.equal('Electronic access');
            });

            it('is open by default', () => {
              expect(mappingProfileDetails.holdingsDetails.electronicAccessAccordion.isOpen).to.be.true;
            });

            hasTable('holdingsDetails', 'electronicAccessAccordion', 'electronicAccess', 'Electronic Access',
              5, ['Relationship', 'URI', 'Link text', 'Materials specified', 'URL public note']);
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

            hasTable('holdingsDetails', 'receivingHistoryAccordion', 'receivingHistory', 'Receiving history',
              3, ['Public display', 'Enumeration', 'Chronology']);
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
            hasTable('itemDetails', 'adminDataAccordion', 'formerIds', 'Former identifiers',
              1, ['Former Identifier']);
            hasTable('itemDetails', 'adminDataAccordion', 'statisticalCodes', 'Statistical codes',
              1, ['Statistical code']);
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
            hasTable('itemDetails', 'enumerationDataAccordion', 'yearCaption', 'Years, captions',
              1, ['Year, caption']);
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

            hasTable('itemDetails', 'itemNotesAccordion', 'notes', 'Item notes',
              3, ['Note type', 'Note', 'Staff only']);
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
            hasTable('itemDetails', 'loanAndAvailabilityAccordion', 'circulationNotes', 'Check in / Check out notes',
              3, ['Note type', 'Note', 'Staff only']);
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

            hasTable('itemDetails', 'electronicAccessAccordion', 'electronicAccess', 'Electronic access',
              5, ['Relationship', 'URI', 'Link text', 'Materials specified', 'URL public note']);
          });
        });
      });

      describe('when there is no data', () => {
        beforeEach(async () => {
          await mappingProfiles.list.rows(1).click();
        });

        describe('and field is mappable', () => {
          it('then dash is displayed', () => {
            expect(mappingProfileDetails.holdingsDetails.adminDataAccordion.holdingsType.value.text).to.be.equal('-');
          });
        });

        describe('and field is unmappable', () => {
          it('then circle backslash character is displayed', () => {
            expect(mappingProfileDetails.holdingsDetails.adminDataAccordion.holdingsHRID.value.text).to.be.equal(String.fromCharCode(8416));
          });
        });
      });
    });

    describe('edit mapping profile form', () => {
      describe('when FOLIO record type equals to', () => {
        describe('Instance', () => {
          beforeEach(async function () {
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

          // eslint-disable-next-line no-only-tests/no-only-tests
          describe.skip('expand/collapse all button', () => {
            it('has expand/collapse all button', () => {
              expect(mappingProfileForm.instanceDetails.expandAllButton.isPresent).to.be.true;
            });
          });

          // eslint-disable-next-line no-only-tests/no-only-tests
          describe.skip('Administrative data accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.adminDataAccordion.label).to.equal('Administrative data');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.adminDataAccordion.isOpen).to.be.true;
            });

            hasInput('instanceDetails', 'adminDataAccordion', 'instanceHRID', 'Instance HRID', true);
            hasInput('instanceDetails', 'adminDataAccordion', 'metadataSource', 'Metadata source', true);
            hasInput('instanceDetails', 'adminDataAccordion', 'catalogedDate', 'Cataloged date');
            hasDatePickerDecorator('instanceDetails', 'adminDataAccordion', 'catalogedDate', 'Cataloged date', 'catalogedDateAcceptedValues', 'catalogedDatePicker');
            hasInput('instanceDetails', 'adminDataAccordion', 'instanceStatusTerm', 'Instance status term');
            hasInput('instanceDetails', 'adminDataAccordion', 'modeOfIssuance', 'Mode of issuance', true);
            hasRepeatableField('instanceDetails', 'adminDataAccordion', 'statisticalCodes', 'Statistical codes');
            hasRepeatableFieldDecorator('instanceDetails', 'adminDataAccordion', 'statisticalCodesRepeatable');
            hasBooleanActionsField('instanceDetails', 'adminDataAccordion', 'suppressFromDiscovery', 'Suppress from discovery', 'Mark for all affected records');
            hasBooleanActionsField('instanceDetails', 'adminDataAccordion', 'staffSuppress', 'Staff suppress', 'Mark for all affected records');
            hasBooleanActionsField('instanceDetails', 'adminDataAccordion', 'previouslyHeld', 'Previously held', 'Mark for all affected records');
            hasReferenceValuesDecorator('instanceDetails', 'adminDataAccordion', 'instanceStatusTerm', 'Instance status term', 'instanceStatusTermAcceptedValues');
            hasReferenceValuesDecorator('instanceDetails', 'adminDataAccordion', 'statisticalCode', 'Statistical code', 'statisticalCodeAcceptedValues', true, 'statisticalCodes', ['"statistical 1: ASER - name 1"']);
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
            hasRepeatableFieldDecorator('instanceDetails', 'titleDataAccordion', 'alternativeTitlesRepeatable', true);
            hasInput('instanceDetails', 'titleDataAccordion', 'indexTitle', 'Index title', true);
            hasRepeatableField('instanceDetails', 'titleDataAccordion', 'seriesStatements', 'Series statements', true);
            hasRepeatableFieldDecorator('instanceDetails', 'titleDataAccordion', 'seriesStatementsRepeatable', true);
            hasRepeatableField('instanceDetails', 'titleDataAccordion', 'precedingTitles', 'Preceding titles', true);
            hasRepeatableFieldDecorator('instanceDetails', 'titleDataAccordion', 'precedingTitlesRepeatable', true);
            hasRepeatableField('instanceDetails', 'titleDataAccordion', 'succeedingTitles', 'Succeeding titles', true);
            hasRepeatableFieldDecorator('instanceDetails', 'titleDataAccordion', 'succeedingTitlesRepeatable', true);
          });

          describe('Identifier accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.identifierAccordion.label).to.equal('Identifier');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.identifierAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'identifierAccordion', 'identifiers', '', true);
            hasRepeatableFieldDecorator('instanceDetails', 'identifierAccordion', 'identifiersRepeatable', true);
          });

          describe('Contributor accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.contributorAccordion.label).to.equal('Contributor');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.contributorAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'contributorAccordion', 'contributors', '', true);
            hasRepeatableFieldDecorator('instanceDetails', 'contributorAccordion', 'contributorsRepeatable', true);
            hasBooleanActionsField('instanceDetails', 'contributorAccordion', 'primary', 'Primary', 'Mark for all affected records', true, 'contributors', ['910', '910', '910', '910', 'Mark for all affected records'], true);
          });

          describe('Descriptive data accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.descriptiveDataAccordion.label).to.equal('Descriptive data');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.descriptiveDataAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'publications', 'Publications', true);
            hasRepeatableFieldDecorator('instanceDetails', 'descriptiveDataAccordion', 'publicationsRepeatable', true);
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'editions', 'Editions', true);
            hasRepeatableFieldDecorator('instanceDetails', 'descriptiveDataAccordion', 'editionsRepeatable', true);
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'physicalDescriptions', 'Physical descriptions', true);
            hasRepeatableFieldDecorator('instanceDetails', 'descriptiveDataAccordion', 'physicalDescriptionsRepeatable', true);
            hasInput('instanceDetails', 'descriptiveDataAccordion', 'resourceType', 'Resource type', true);
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'natureOfContentTerms', 'Nature of content terms');
            hasRepeatableFieldDecorator('instanceDetails', 'descriptiveDataAccordion', 'natureOfContentTermsRepeatable');
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'formats', 'Formats', true);
            hasRepeatableFieldDecorator('instanceDetails', 'descriptiveDataAccordion', 'formatsRepeatable', true);
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'languages', 'Languages', true);
            hasRepeatableFieldDecorator('instanceDetails', 'descriptiveDataAccordion', 'languagesRepeatable', true);
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'publicationFrequencies', 'Publication frequencies', true);
            hasRepeatableFieldDecorator('instanceDetails', 'descriptiveDataAccordion', 'publicationFrequenciesRepeatable', true);
            hasRepeatableField('instanceDetails', 'descriptiveDataAccordion', 'publicationRanges', 'Publication range', true);
            hasRepeatableFieldDecorator('instanceDetails', 'descriptiveDataAccordion', 'publicationRangesRepeatable', true);
            hasReferenceValuesDecorator('instanceDetails', 'descriptiveDataAccordion', 'natureOfContentTerm', 'Nature of content term', 'natureOfContentTermAcceptedValues', true, 'natureOfContentTerms', ['"name 1"']);
          });

          describe('Instance notes accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.instanceNotesAccordion.label).to.equal('Instance notes');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.instanceNotesAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'instanceNotesAccordion', 'notes', '', true);
            hasRepeatableFieldDecorator('instanceDetails', 'instanceNotesAccordion', 'notesRepeatable', true);
            hasBooleanActionsField('instanceDetails', 'instanceNotesAccordion', 'staffOnly', 'Staff only', 'Mark for all affected records', true, 'notes', ['910', '910', 'Mark for all affected records']);
          });

          describe('Electronic access accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.electronicAccessAccordion.label).to.equal('Electronic access');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.electronicAccessAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'electronicAccessAccordion', 'electronicAccess', '', true);
            hasRepeatableFieldDecorator('instanceDetails', 'electronicAccessAccordion', 'electronicAccessRepeatable', true);
            hasReferenceValuesDecorator('instanceDetails', 'electronicAccessAccordion', 'relationship', 'Relationship', 'relationshipAcceptedValues', true, 'electronicAccess', ['"name 1"', '910', '910', '910', '910']);
          });

          describe('Subject accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.subjectAccordion.label).to.equal('Subject');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.subjectAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'subjectAccordion', 'subjects', '', true);
            hasRepeatableFieldDecorator('instanceDetails', 'subjectAccordion', 'subjectsRepeatable', true);
          });

          describe('Classification accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.classificationAccordion.label).to.equal('Classification');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.classificationAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'classificationAccordion', 'classifications', '', true);
            hasRepeatableFieldDecorator('instanceDetails', 'classificationAccordion', 'classificationsRepeatable', true);
          });

          describe('Instance relationship accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.instanceDetails.instanceRelationshipAccordion.label).to.equal('Instance relationship (analytics and bound-with)');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.instanceDetails.instanceRelationshipAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('instanceDetails', 'instanceRelationshipAccordion', 'parentInstances', 'Parent instances');
            hasRepeatableFieldDecorator('instanceDetails', 'instanceRelationshipAccordion', 'parentInstancesRepeatable');
            hasReferenceValuesDecorator('instanceDetails', 'instanceRelationshipAccordion', 'parentTypeOfRelation', 'Type of relation', 'parentTypeOfRelationAcceptedValues', true, 'parentInstances', ['910', '"name 1"']);
            hasRepeatableField('instanceDetails', 'instanceRelationshipAccordion', 'childInstances', 'Child instances');
            hasRepeatableFieldDecorator('instanceDetails', 'instanceRelationshipAccordion', 'childInstancesRepeatable');
            hasReferenceValuesDecorator('instanceDetails', 'instanceRelationshipAccordion', 'childTypeOfRelation', 'Type of relation', 'childTypeOfRelationAcceptedValues', true, 'childInstances', ['910', '"name 1"']);
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
            hasRepeatableFieldDecorator('holdingsDetails', 'adminDataAccordion', 'formerHoldingsRepeatable');
            hasInput('holdingsDetails', 'adminDataAccordion', 'holdingsType', 'Holdings type');
            hasReferenceValuesDecorator('holdingsDetails', 'adminDataAccordion', 'holdingsType', 'Holdings type', 'holdingsTypeAcceptedValues');
            hasRepeatableField('holdingsDetails', 'adminDataAccordion', 'statisticalCodes', 'Statistical codes');
            hasRepeatableFieldDecorator('holdingsDetails', 'adminDataAccordion', 'statisticalCodesRepeatable');
            hasReferenceValuesDecorator('holdingsDetails', 'adminDataAccordion', 'statisticalCode', 'Statistical code', 'statisticalCodeAcceptedValues', true, 'statisticalCodes', ['"statistical 1: ASER - name 1"']);
            hasBooleanActionsField('holdingsDetails', 'adminDataAccordion', 'suppressFromDiscovery', 'Suppress from discovery', 'Mark for all affected records');
          });

          describe('Location accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.holdingsDetails.locationAccordion.label).to.equal('Location');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.holdingsDetails.locationAccordion.isOpen).to.be.true;
            });

            hasInput('holdingsDetails', 'locationAccordion', 'permanent', 'Permanent');
            hasReferenceValuesDecorator('holdingsDetails', 'locationAccordion', 'permanent', 'Permanent', 'permanentAcceptedValues');
            hasInput('holdingsDetails', 'locationAccordion', 'temporary', 'Temporary');
            hasReferenceValuesDecorator('holdingsDetails', 'locationAccordion', 'temporary', 'Temporary', 'temporaryAcceptedValues');
            hasInput('holdingsDetails', 'locationAccordion', 'shelvingOrder', 'Shelving order');
            hasInput('holdingsDetails', 'locationAccordion', 'shelvingTitle', 'Shelving title');
            hasInput('holdingsDetails', 'locationAccordion', 'copyNumber', 'Copy number');
            hasInput('holdingsDetails', 'locationAccordion', 'callNumberType', 'Call number type');
            hasReferenceValuesDecorator('holdingsDetails', 'locationAccordion', 'callNumberType', 'Call number type', 'callNumberTypeAcceptedValues');
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
            hasRepeatableFieldDecorator('holdingsDetails', 'holdingsDetailsAccordion', 'statementsRepeatable');
            hasRepeatableField('holdingsDetails', 'holdingsDetailsAccordion', 'statementsForSupplement', 'Holdings statements for supplement');
            hasRepeatableFieldDecorator('holdingsDetails', 'holdingsDetailsAccordion', 'statementsForSupplementRepeatable');
            hasRepeatableField('holdingsDetails', 'holdingsDetailsAccordion', 'statementsForIndexes', 'Holdings statements for indexes');
            hasRepeatableFieldDecorator('holdingsDetails', 'holdingsDetailsAccordion', 'statementsForIndexesRepeatable');
            hasInput('holdingsDetails', 'holdingsDetailsAccordion', 'illPolicy', 'ILL policy');
            hasReferenceValuesDecorator('holdingsDetails', 'holdingsDetailsAccordion', 'illPolicy', 'ILL policy', 'illPolicyAcceptedValues');
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
            hasRepeatableFieldDecorator('holdingsDetails', 'holdingsNotesAccordion', 'notesRepeatable');
            hasReferenceValuesDecorator('holdingsDetails', 'holdingsNotesAccordion', 'note', 'Note type', 'noteAcceptedValues', true, 'notes', ['"name 1"', '910', '-']);
            hasBooleanActionsField('holdingsDetails', 'holdingsNotesAccordion', 'staffOnly', 'Staff only', 'Mark for all affected records', true, 'notes', ['910', '910', 'Mark for all affected records']);
          });

          describe('Electronic access accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.holdingsDetails.electronicAccessAccordion.label).to.equal('Electronic access');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.holdingsDetails.electronicAccessAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('holdingsDetails', 'electronicAccessAccordion', 'electronicAccess', '');
            hasRepeatableFieldDecorator('holdingsDetails', 'electronicAccessAccordion', 'electronicAccessRepeatable');
            hasReferenceValuesDecorator('holdingsDetails', 'electronicAccessAccordion', 'relationship', 'Relationship', 'relationshipAcceptedValues', true, 'electronicAccess', ['"name 1"', '910', '910', '910', '910']);
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
            hasRepeatableFieldDecorator('holdingsDetails', 'receivingHistoryAccordion', 'noteRepeatable');
            hasBooleanActionsField('holdingsDetails', 'receivingHistoryAccordion', 'publicDisplay', 'Public display', 'Mark for all affected records', true, 'receivingHistory', ['Mark for all affected records', '910', '910']);
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
            hasRepeatableFieldDecorator('itemDetails', 'adminDataAccordion', 'formerIdsRepeatable');
            hasRepeatableField('itemDetails', 'adminDataAccordion', 'statisticalCodes', 'Statistical codes');
            hasRepeatableFieldDecorator('itemDetails', 'adminDataAccordion', 'statisticalCodeRepeatable');
            hasReferenceValuesDecorator('itemDetails', 'adminDataAccordion', 'statisticalCode', 'Statistical code', 'statisticalCodeAcceptedValues', true, 'statisticalCodes', ['"statistical 1: ASER - name 1"', '910', '910', '910', '910']);
            hasBooleanActionsField('itemDetails', 'adminDataAccordion', 'suppressFromDiscovery', 'Suppress from discovery', 'Mark for all affected records');
          });

          describe('Item data accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.itemDataAccordion.label).to.equal('Item data');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.itemDataAccordion.isOpen).to.be.true;
            });

            hasInput('itemDetails', 'itemDataAccordion', 'materialType', 'Material type');
            hasReferenceValuesDecorator('itemDetails', 'itemDataAccordion', 'materialType', 'Material type', 'materialTypeAcceptedValues');
            hasInput('itemDetails', 'itemDataAccordion', 'copyNumber', 'Copy number');
            hasInput('itemDetails', 'itemDataAccordion', 'callNumberType', 'Call number type');
            hasReferenceValuesDecorator('itemDetails', 'itemDataAccordion', 'callNumberType', 'Call number type', 'callNumberTypeAcceptedValues');
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
            hasRepeatableField('itemDetails', 'enumerationDataAccordion', 'yearsAndCaptions', 'Year, caption');
            hasRepeatableFieldDecorator('itemDetails', 'enumerationDataAccordion', 'yearsAndCaptionsRepeatable');
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
            hasDatePickerDecorator('itemDetails', 'conditionAccordion', 'date', 'Date', 'dateAcceptedValues', 'missingPiecesDate');
            hasInput('itemDetails', 'conditionAccordion', 'itemDamagedStatus', 'Item damaged status');
            hasReferenceValuesDecorator('itemDetails', 'conditionAccordion', 'itemDamagedStatus', 'Item damaged status', 'itemDamagedStatusAcceptedValues');
            hasInput('itemDetails', 'conditionAccordion', 'date2', 'Date');
            hasDatePickerDecorator('itemDetails', 'conditionAccordion', 'date2', 'Date', 'date2AcceptedValues', 'itemDamagedStatusDate');
          });

          describe('Item notes accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.itemNotesAccordion.label).to.equal('Item notes');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.itemNotesAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('itemDetails', 'itemNotesAccordion', 'notes', '');
            hasRepeatableFieldDecorator('itemDetails', 'itemNotesAccordion', 'notesRepeatable');
            hasReferenceValuesDecorator('itemDetails', 'itemNotesAccordion', 'note', 'Note type', 'noteAcceptedValues', true, 'notes', ['"name 1"', '910', '-']);
            hasBooleanActionsField('itemDetails', 'itemNotesAccordion', 'staffOnly', 'Staff only', 'Mark for all affected records', true, 'notes', ['910', '910', 'Mark for all affected records']);
          });

          describe('Loan and availability accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.loanAndAvailabilityAccordion.label).to.equal('Loan and availability');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.loanAndAvailabilityAccordion.isOpen).to.be.true;
            });

            hasInput('itemDetails', 'loanAndAvailabilityAccordion', 'permanentLoanType', 'Permanent loan type');
            hasReferenceValuesDecorator('itemDetails', 'loanAndAvailabilityAccordion', 'permanentLoanType', 'Permanent loan type', 'permanentLoanTypeAcceptedValues');
            hasInput('itemDetails', 'loanAndAvailabilityAccordion', 'temporaryLoanType', 'Temporary loan type');
            hasReferenceValuesDecorator('itemDetails', 'loanAndAvailabilityAccordion', 'temporaryLoanType', 'Temporary loan type', 'temporaryLoanTypeAcceptedValues');
            hasInput('itemDetails', 'loanAndAvailabilityAccordion', 'status', 'Status');
            hasReferenceValuesDecorator('itemDetails', 'loanAndAvailabilityAccordion', 'status', 'Status', 'statusAcceptedValues');
            hasRepeatableField('itemDetails', 'loanAndAvailabilityAccordion', 'circulationNotes', 'Check in / Check out notes');
            hasRepeatableFieldDecorator('itemDetails', 'loanAndAvailabilityAccordion', 'circulationNotesRepeatable');
            hasReferenceValuesDecorator('itemDetails', 'loanAndAvailabilityAccordion', 'circulationNote', 'Note type', 'circulationNoteAcceptedValues', true, 'circulationNotes', ['"name 1"', '910', '-']);
            hasBooleanActionsField('itemDetails', 'loanAndAvailabilityAccordion', 'staffOnly', 'Staff only', 'Mark for all affected records', true, 'circulationNotes', ['910', '910', 'Mark for all affected records']);
          });

          describe('Location accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.locationAccordion.label).to.equal('Location');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.locationAccordion.isOpen).to.be.true;
            });

            hasInput('itemDetails', 'locationAccordion', 'permanent', 'Permanent');
            hasReferenceValuesDecorator('itemDetails', 'locationAccordion', 'permanent', 'Permanent', 'permanentAcceptedValues');
            hasInput('itemDetails', 'locationAccordion', 'temporary', 'Temporary');
            hasReferenceValuesDecorator('itemDetails', 'locationAccordion', 'temporary', 'Temporary', 'temporaryAcceptedValues');
          });

          describe('Electronic access accordion', () => {
            it('renders', () => {
              expect(mappingProfileForm.itemDetails.electronicAccessAccordion.label).to.equal('Electronic access');
            });

            it('is open by default', () => {
              expect(mappingProfileForm.itemDetails.electronicAccessAccordion.isOpen).to.be.true;
            });

            hasRepeatableField('itemDetails', 'electronicAccessAccordion', 'electronicAccess', '');
            hasRepeatableFieldDecorator('itemDetails', 'electronicAccessAccordion', 'electronicAccessRepeatable');
            hasReferenceValuesDecorator('itemDetails', 'electronicAccessAccordion', 'electronicRelationship', 'Relationship', 'electronicRelationshipAcceptedValues', true, 'electronicAccess', ['"name 1"', '910', '910', '910', '910']);
          });
        });

        describe('MARC Bibliographic', () => {
          beforeEach(async () => {
            await mappingProfiles.list.rows(3).click();
            await mappingProfileDetails.actionMenu.click();
            await mappingProfileDetails.actionMenu.editProfile.click();
          });

          it('has MARC modifications table', () => {
            expect(mappingProfileForm.marcDetailsTable.tablePresent).to.be.true;
          });

          it('table contains data', () => {
            expect(mappingProfileForm.marcDetailsTable.rowCount).to.be.equal(8);
          });

          describe('when data in MARC modifications table changed', () => {
            beforeEach(async () => {
              await mappingProfileForm.marcDetailsTable.rows(0).removeRow.clickIconButton();
            });

            it('then "Save" button becomes active', () => {
              expect(mappingProfileForm.submitFormButtonDisabled).to.be.false;
            });
          });

          describe('row has subfields', () => {
            beforeEach(async () => {
              await mappingProfileForm.marcDetailsTable.rows(0).action.selectAndBlur('Add');
              await mappingProfileForm.marcDetailsTable.rows(0).subaction.selectAndBlur('Add subfield');
            });

            describe('wnen "Add" action and "Add subfield" subaction are selected', () => {
              it('then subfield row is added', () => {
                expect(mappingProfileForm.marcDetailsTable.rows(0).subfieldsCount).to.be.equal(1);
              });

              it('subfield row does not include up/down arrows', () => {
                expect(mappingProfileForm.marcDetailsTable.rows(0).subfields(0).moveRowUp.isPresent).to.be.false;
                expect(mappingProfileForm.marcDetailsTable.rows(0).subfields(0).moveRowDown.isPresent).to.be.false;
              });

              it('subfield row do not includes "position" field', () => {
                expect(mappingProfileForm.marcDetailsTable.rows(0).subfields(0).position.hasSelect).to.be.false;
              });

              it('subfield row do not includes "add" button', () => {
                expect(mappingProfileForm.marcDetailsTable.rows(0).subfields(0).addRow.isPresent).to.be.false;
              });

              // eslint-disable-next-line no-only-tests/no-only-tests
              describe.skip('when data is filled in for main row', () => {
                beforeEach(async () => {
                  await mappingProfileForm.marcDetailsTable.rows(0).tag.fillAndBlur('910');
                  await mappingProfileForm.marcDetailsTable.rows(0).indicator1.fillAndBlur('a');
                  await mappingProfileForm.marcDetailsTable.rows(0).indicator2.fillAndBlur('a');
                  await mappingProfileForm.marcDetailsTable.rows(0).subfield.fillAndBlur('a');
                  await mappingProfileForm.marcDetailsTable.rows(0).dataTextField.fillAndBlur('test');
                });

                it('subfield\'s "Field" value has the same "Field" value as main row', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).subfields(0).tag.val).to.be.equal('910');
                });

                it('subfield\'s "In.1" value has the same "In.1" value as main row', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).subfields(0).indicator1.val).to.be.equal('a');
                });

                it('subfield\'s "In.2" value has the same "In.2" value as main row', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).subfields(0).indicator2.val).to.be.equal('a');
                });

                it('subfield\'s "Subfield" value is empty', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).subfields(0).subfield.val).to.be.equal('');
                });

                it('subfield\'s "Data" value is empty', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).subfields(0).dataTextField.val).to.be.equal('');
                });
              });

              describe('wnen "Add subfield" subaction of subfield row is selected', () => {
                beforeEach(async () => {
                  await mappingProfileForm.marcDetailsTable.rows(0).subfields(0).subaction.selectAndBlur('Add subfield');
                });

                it('then one more subfield row is added', () => {
                  expect(mappingProfileForm.marcDetailsTable.rows(0).subfieldsCount).to.be.equal(2);
                });

                describe('when remove button of subfield row is clicked', () => {
                  beforeEach(async () => {
                    await mappingProfileForm.marcDetailsTable.rows(0).subfields(0).removeRow.clickIconButton();
                  });

                  it('then current subfield row is removed', () => {
                    expect(mappingProfileForm.marcDetailsTable.rows(0).subfieldsCount).to.be.equal(1);
                  });
                });
              });
            });
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
      // eslint-disable-next-line no-only-tests/no-only-tests
      describe.skip('exception modal', () => {
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
