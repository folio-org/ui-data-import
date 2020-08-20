import { expect } from 'chai';
import { Response } from '@bigtest/mirage';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../../helpers';
import {
  fileExtensions,
  fileExtensionForm,
  fileExtensionDetails,
} from '../../interactors';

async function setupFormSubmitErrorScenario(server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  server.post('/data-import/fileExtensions', () => new Response(status, headers, response));
  await fileExtensionForm.extensionField.fillAndBlur('.csv');
  await fileExtensionForm.blockedField.clickAndBlur();
  await fileExtensionForm.submitFormButton.click();
}

describe('File extension form', () => {
  setupApplication();

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions');
  });

  describe('appears', () => {
    beforeEach(async () => {
      await fileExtensions.actionMenu.click();
      await fileExtensions.actionMenu.newProfileButton.click();
    });

    it('upon click on new file extension button', () => {
      expect(fileExtensionForm.isPresent).to.be.true;
    });
  });
});

describe('File extension form', () => {
  setupApplication({ scenarios: ['fetch-file-extensions-success', 'fetch-users'] });

  beforeEach(async function () {
    this.visit('/settings/data-import/file-extensions?layer=create');
    await fileExtensionForm.whenLoaded();
  });

  describe('when file extension field', () => {
    // eslint-disable-next-line no-only-tests/no-only-tests
    describe.skip('has leading or trailing spaces', () => {
      beforeEach(async () => {
        await fileExtensionForm.extensionField.fillAndBlur('  .csv  ');
        await fileExtensionForm.submitFormButton.click();
      });

      it('then the error message appears', () => {
        expect(fileExtensionForm.extensionField.inputError).to.be.true;
      });
    });

    // eslint-disable-next-line no-only-tests/no-only-tests
    describe.skip('has not leading dot', () => {
      beforeEach(async () => {
        await fileExtensionForm.extensionField.fillAndBlur('csv');
        await fileExtensionForm.submitFormButton.click();
      });

      it('then the error message appears', () => {
        expect(fileExtensionForm.extensionField.inputError).to.be.true;
      });
    });

    describe('is valid', () => {
      beforeEach(async () => {
        await fileExtensionForm.extensionField.fillAndBlur('.csv');
        await fileExtensionForm.submitFormButton.click();
      });

      it('then the error message does not appear', () => {
        expect(fileExtensionForm.extensionField.inputError).to.be.false;
      });
    });
  });

  describe('when data types field has value', () => {
    beforeEach(async () => {
      await fileExtensionForm.dataTypesField.expandAndFilter('MARC');
      await fileExtensionForm.dataTypesField.clickOption('1');
      await fileExtensionForm.dataTypesField.blur('input');
    });

    it('then the error message does not appear', () => {
      expect(fileExtensionForm.dataTypesField.valueCount).to.equal(1);
    });
  });

  describe('when data types filter result is empty', () => {
    beforeEach(async () => {
      await fileExtensionForm.dataTypesField.expandAndFilter('NON EXISTING OPTION');
    });

    it('then the option list is empty', () => {
      expect(fileExtensionForm.dataTypesField.optionCount).to.equal(0);
    });
  });

  describe('when form is submitted and import is blocked', () => {
    beforeEach(async () => {
      await fileExtensionForm.extensionField.fillAndBlur('.csv');
      await fileExtensionForm.blockedField.clickAndBlur();
      await fileExtensionForm.submitFormButton.click();
    });

    it('then data types field is not required', () => {
      expect(fileExtensionForm.blockedField.inputValue).to.equal('true');
      expect(fileExtensionForm.dataTypesField.inputError).to.be.false;
    });

    it('then file extension details renders the newly created file extension', () => {
      expect(fileExtensionDetails.headline.text).to.equal('.csv');
      expect(fileExtensionDetails.description.text).to.equal('-');
      expect(fileExtensionDetails.extension.text).to.equal('.csv');
      expect(fileExtensionDetails.dataTypes.isPresent).to.be.false;
      expect(fileExtensionDetails.importBlocked.isPresent).to.be.true;
    });
  });

  describe('when form is submitted with unblocked import', () => {
    beforeEach(async () => {
      await fileExtensionForm.descriptionField.fillAndBlur('Description');
      await fileExtensionForm.dataTypesField.expandAndFilter('MARC');
      await fileExtensionForm.dataTypesField.clickOption('1');
      await fileExtensionForm.extensionField.fillAndBlur('.csv');
      await fileExtensionForm.submitFormButton.click();
    });

    it('then file extension details renders the newly created file extension', () => {
      expect(fileExtensionDetails.description.text).to.equal('Description');
      expect(fileExtensionDetails.headline.text).to.equal('.csv');
      expect(fileExtensionDetails.extension.text).to.equal('.csv');
      expect(fileExtensionDetails.dataTypes.text).to.equal('MARC');
      expect(fileExtensionDetails.importBlocked.isPresent).to.be.false;
    });
  });
});

describe('When file extension form', () => {
  setupApplication();

  beforeEach(async function () {
    this.visit('/settings/data-import/file-extensions?layer=create');
    await fileExtensionForm.whenLoaded();
  });

  describe('is submitted and the response contains', () => {
    describe('error message', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server, {
          response: { errors: [{ message: 'fileExtension.duplication.invalid' }] },
          status: 422,
        });
      });

      it('then error callout appears', () => {
        expect(fileExtensionForm.callout.errorCalloutIsPresent).to.be.true;
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
        expect(fileExtensionForm.callout.errorCalloutIsPresent).to.be.true;
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
        expect(fileExtensionForm.callout.errorCalloutIsPresent).to.be.true;
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
        expect(fileExtensionForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });

    describe('network error', () => {
      beforeEach(async function () {
        await setupFormSubmitErrorScenario(this.server);
      });

      it('then error callout appears', () => {
        expect(fileExtensionForm.callout.errorCalloutIsPresent).to.be.true;
      });
    });
  });
});
