import { describe, beforeEach, it } from '@bigtest/mocha';
import { Response } from '@bigtest/mirage';
import { expect } from 'chai';

import { setupApplication } from '../helpers';
import { newFileExtensionForm } from '../interactors/file-extension-form';

async function setupFormSubmitErrorScenario(server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  server.post('/data-import/fileExtensions', () => new Response(status, headers, response));
  await newFileExtensionForm.extensionField.fillAndBlur('.csv');
  await newFileExtensionForm.blockedField.clickAndBlur();
  await newFileExtensionForm.submitFormBtn.click();
}

describe('Create new file extension form', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions?layer=create');
  });

  it('renders', () => {
    expect(newFileExtensionForm.isPresent).to.be.true;
  });
});

describe('File extension form', () => {
  setupApplication({ scenarios: ['fetch-file-extensions-success'] });

  beforeEach(async function () {
    this.visit('/settings/data-import/file-extensions?layer=create');
    await newFileExtensionForm.whenLoaded();
  });

  describe('has cancel creation file extension button which', () => {
    it('is not visible when pane dropdown is closed', () => {
      expect(newFileExtensionForm.paneHeaderCancelBtn.isVisible).to.be.false;
    });

    describe('is visible', () => {
      beforeEach(async function () {
        await newFileExtensionForm.expandPaneHeaderDropdown();
      });

      it('when pane dropdown is opened', () => {
        expect(newFileExtensionForm.paneHeaderCancelBtn.isVisible).to.be.true;
      });
    });

    describe('cancels creation of file extension', () => {
      beforeEach(async function () {
        await newFileExtensionForm.expandPaneHeaderDropdown();
        await newFileExtensionForm.paneHeaderCancelBtn.click();
      });

      it('when clicked', () => {
        expect(newFileExtensionForm.isPresent).to.be.false;
      });
    });
  });

  describe('when file extension field', () => {
    describe('is empty', () => {
      beforeEach(async function () {
        await newFileExtensionForm.extensionField.fillAndBlur('');
      });

      it('then the error message does not appear', () => {
        expect(newFileExtensionForm.extensionField.inputError).to.be.true;
      });
    });

    describe('has leading or trailing spaces', () => {
      beforeEach(async function () {
        await newFileExtensionForm.extensionField.fillAndBlur('  .csv  ');
      });

      it('then the error message appears', () => {
        expect(newFileExtensionForm.extensionField.inputError).to.be.true;
      });
    });

    describe('has not leading dot', () => {
      beforeEach(async function () {
        await newFileExtensionForm.extensionField.fillAndBlur('csv');
      });

      it('then the error message appears', () => {
        expect(newFileExtensionForm.extensionField.inputError).to.be.true;
      });
    });

    describe('is valid', () => {
      beforeEach(async function () {
        await newFileExtensionForm.extensionField.fillAndBlur('.csv');
      });

      it('then the error message does not appear', () => {
        expect(newFileExtensionForm.extensionField.inputError).to.be.false;
      });
    });
  });

  describe('when data types field has value', () => {
    beforeEach(async function () {
      await newFileExtensionForm.dataTypesField.expandAndFilter('Del');
      await newFileExtensionForm.dataTypesField.clickOption('1');
      await newFileExtensionForm.dataTypesField.blur('input');
    });

    it('then the error message does not appear', () => {
      expect(newFileExtensionForm.dataTypesField.valueCount).to.equal(1);
    });
  });

  describe('when data types filter result is empty', () => {
    beforeEach(async function () {
      await newFileExtensionForm.dataTypesField.expandAndFilter('NON EXISTING OPTION');
    });

    it('then the option list is empty', () => {
      expect(newFileExtensionForm.dataTypesField.optionCount).to.equal(0);
    });
  });

  describe('when form is submitted and import is not blocked', () => {
    beforeEach(async function () {
      await newFileExtensionForm.extensionField.fillAndBlur('.csv');
      await newFileExtensionForm.submitFormBtn.click();
    });

    it('then data types field is required', () => {
      expect(newFileExtensionForm.blockedField.inputValue).to.equal('false');
      expect(newFileExtensionForm.dataTypesField.inputError).to.be.true;
    });
  });

  describe('when form is submitted and import is blocked', () => {
    beforeEach(async function () {
      await newFileExtensionForm.extensionField.fillAndBlur('.csv');
      await newFileExtensionForm.blockedField.clickAndBlur();
      await newFileExtensionForm.submitFormBtn.click();
    });

    it('then data types field is not required', () => {
      expect(newFileExtensionForm.blockedField.inputValue).to.equal('true');
      expect(newFileExtensionForm.dataTypesField.inputError).to.be.false;
    });
  });
});

describe('When file extension form', () => {
  setupApplication();

  beforeEach(async function () {
    this.visit('/settings/data-import/file-extensions?layer=create');
    await newFileExtensionForm.whenLoaded();
  });

  describe('is submitted and the response contains', function () {
    describe('error message', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server, {
          response: {
            errors: [{ message: 'fileExtension.duplication.invalid' }],
          },
          status: 422,
        });
      });

      it('then error callout appears', () => {
        expect(newFileExtensionForm.callout.errorCalloutIsPresent).to.be.true;
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
        expect(newFileExtensionForm.callout.errorCalloutIsPresent).to.be.true;
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
        expect(newFileExtensionForm.callout.errorCalloutIsPresent).to.be.true;
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
        expect(newFileExtensionForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe('network error', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server);
      });

      it('then error callout appears', () => {
        expect(newFileExtensionForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });
});
