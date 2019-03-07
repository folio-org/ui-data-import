import { expect } from 'chai';
import { Response } from '@bigtest/mirage';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import { setupApplication } from '../helpers';
import {
  fileExtensionForm,
  fileExtensionDetails,
  fileExtensions,
} from '../interactors';

async function setupFormSubmitErrorScenario(server, responseData = {}) {
  const {
    response = {},
    status = 500,
    headers = {},
  } = responseData;

  server.put('/data-import/fileExtensions/:id', () => new Response(status, headers, response));
  await fileExtensionForm.extensionField.fillAndBlur('.csv');
  await fileExtensionForm.blockedField.clickAndBlur();
  await fileExtensionForm.submitFormButton.click();
}

describe('File extensions table', () => {
  setupApplication({ scenarios: ['fetch-file-extensions-success'] });

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions');
  });

  it('renders', () => {
    expect(fileExtensions.list.isPresent).to.be.true;
  });

  describe('opens file extension details', () => {
    beforeEach(async function () {
      await fileExtensions.list.rows(0).click();
    });

    it('upon click on row', () => {
      expect(fileExtensionDetails.isPresent).to.be.true;
    });

    describe('has edit button', () => {
      beforeEach(async function () {
        await fileExtensionDetails.expandPaneHeaderDropdown();
      });

      it('when pane dropdown is opened', () => {
        expect(fileExtensionDetails.paneHeaderEditButton.isVisible).to.be.true;
      });
    });

    describe('file extension form', () => {
      describe('appears', () => {
        beforeEach(async function () {
          await fileExtensionDetails.expandPaneHeaderDropdown();
          await fileExtensionDetails.paneHeaderEditButton.click();
        });

        it('upon click on pane header menu edit button', () => {
          expect(fileExtensionForm.isPresent).to.be.true;
        });
      });

      describe('appears', () => {
        beforeEach(async function () {
          await fileExtensionDetails.editButton.click();
        });

        it('upon click on edit button', () => {
          expect(fileExtensionForm.isPresent).to.be.true;
        });
      });
    });

    describe('file extension form', () => {
      beforeEach(async function () {
        await fileExtensionDetails.editButton.click();
      });

      describe('when form is submitted', () => {
        beforeEach(async function () {
          await fileExtensionForm.extensionField.fillAndBlur('.changed');
          await fileExtensionForm.blockedField.clickAndBlur();
          await fileExtensionForm.descriptionField.fillAndBlur('Changed');
          await fileExtensionForm.submitFormButton.click();
        });

        it('then file extension details renders the newly created file extension', () => {
          expect(fileExtensionDetails.headline.text).to.equal('.changed');
          expect(fileExtensionDetails.description.text).to.equal('Changed');
          expect(fileExtensionDetails.extension.text).to.equal('.changed');
          expect(fileExtensionDetails.importBlocked.isPresent).to.be.true;
        });

        it('then file extension details does not render the data types section', () => {
          expect(fileExtensionDetails.dataTypes.isPresent).to.be.false;
        });
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
  });
});
