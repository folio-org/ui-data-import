import { expect } from 'chai';
import { Response } from '@bigtest/mirage';
import {
  describe,
  beforeEach,
  it,
} from '@bigtest/mocha';

import translation from '../../../../translations/ui-data-import/en';
import { setupApplication } from '../../helpers';
import {
  fileExtensionForm,
  fileExtensionDetails,
  fileExtensions,
} from '../../interactors';

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
  setupApplication({ scenarios: ['fetch-file-extensions-success', 'fetch-users'] });

  beforeEach(function () {
    this.visit('/settings/data-import/file-extensions');
  });

  it('has proper columns order', () => {
    expect(fileExtensions.list.headers(0).text).to.equal(translation['settings.fileExtension.extension']);
    expect(fileExtensions.list.headers(1).text).to.equal(translation['settings.fileExtension.blockImport']);
    expect(fileExtensions.list.headers(2).text).to.equal(translation['settings.fileExtension.dataTypes']);
    expect(fileExtensions.list.headers(3).text).to.equal(translation.updated);
    expect(fileExtensions.list.headers(4).text).to.equal(translation.updatedBy);
  });

  describe('opens file extension details', () => {
    beforeEach(async () => {
      await fileExtensions.list.rows(0).click();
    });

    it('upon click on row', () => {
      expect(fileExtensionDetails.isPresent).to.be.true;
    });

    describe('edit button', () => {
      beforeEach(async () => {
        await fileExtensionDetails.expandPaneHeaderDropdown();
      });

      it('when pane dropdown is opened', () => {
        expect(fileExtensionDetails.dropdownEditButton.isVisible).to.be.true;
      });
    });

    describe('delete confirmation modal', () => {
      it('is not visible when pane header dropdown is closed', () => {
        expect(fileExtensionDetails.confirmationModal.isPresent).to.be.false;
      });

      describe('is visible', () => {
        beforeEach(async () => {
          await fileExtensionDetails.expandPaneHeaderDropdown();
          await fileExtensionDetails.deleteButton.click();
        });

        it('when pane header dropdown is opened', () => {
          expect(fileExtensionDetails.confirmationModal.isPresent).to.be.true;
        });
      });

      describe('disappears', () => {
        beforeEach(async () => {
          await fileExtensionDetails.expandPaneHeaderDropdown();
          await fileExtensionDetails.deleteButton.click();
          await fileExtensionDetails.confirmationModal.cancelButton.click();
        });

        it('when cancel button is clicked', () => {
          expect(fileExtensionDetails.confirmationModal.isPresent).to.be.false;
        });
      });

      describe('upon click on confirm button initiates the deletion process of file extension and in case of success', () => {
        beforeEach(async () => {
          await fileExtensionDetails.expandPaneHeaderDropdown();
          await fileExtensionDetails.deleteButton.click();
          await fileExtensionDetails.confirmationModal.confirmButton.click();
        });

        it('disappears', () => {
          expect(fileExtensions.confirmationModal.isPresent).to.be.false;
        });

        it('the successful toast appears', () => {
          expect(fileExtensions.callout.successCalloutIsPresent).to.be.true;
        });
      });

      describe('upon click on confirm button twice initiates the deletion process only once file extension and in case of success', () => {
        beforeEach(async () => {
          await fileExtensionDetails.expandPaneHeaderDropdown();
          await fileExtensionDetails.deleteButton.click();
          await fileExtensionDetails.confirmationModal.confirmButton.click();
          await fileExtensionDetails.confirmationModal.confirmButton.click();
        });

        it('disappears', () => {
          expect(fileExtensions.confirmationModal.isPresent).to.be.false;
        });

        it('the successful toast appears', () => {
          expect(fileExtensions.callout.successCalloutIsPresent).to.be.true;
        });

        it('renders the correct number of rows without deleted one', () => {
          expect(fileExtensions.list.rowCount).to.equal(2);
        });
      });

      describe('upon click on confirm button twice initiates the deletion process only once file extension and in case of error', () => {
        beforeEach(async function () {
          this.server.delete('/data-import/fileExtensions/:id', () => new Response(500, {}));
          await fileExtensionDetails.expandPaneHeaderDropdown();
          await fileExtensionDetails.deleteButton.click();
          await fileExtensionDetails.confirmationModal.confirmButton.click();
          await fileExtensionDetails.confirmationModal.confirmButton.click();
        });

        it('disappears', () => {
          expect(fileExtensions.confirmationModal.isPresent).to.be.false;
        });

        it('the error toast appears', () => {
          expect(fileExtensions.callout.errorCalloutIsPresent).to.be.true;
        });

        it('renders the correct number including the one which tried to delete', () => {
          expect(fileExtensions.list.rowCount).to.equal(3);
        });
      });
    });

    describe('file extension form', () => {
      describe('appears', () => {
        beforeEach(async () => {
          await fileExtensionDetails.expandPaneHeaderDropdown();
          await fileExtensionDetails.dropdownEditButton.click();
        });

        it('upon click on pane header menu edit button', () => {
          expect(fileExtensionForm.isPresent).to.be.true;
        });
      });

      describe('appears', () => {
        beforeEach(async () => {
          await fileExtensionDetails.editButton.click();
        });

        it('upon click on edit button', () => {
          expect(fileExtensionForm.isPresent).to.be.true;
        });
      });
    });

    describe('file extension form', () => {
      beforeEach(async () => {
        await fileExtensionDetails.editButton.click();
      });

      describe('when form is submitted', () => {
        beforeEach(async () => {
          await fileExtensionForm.extensionField.fillAndBlur('.changed');
          await fileExtensionForm.blockedField.clickAndBlur();
          await fileExtensionForm.descriptionField.fillAndBlur('Changed');
          await fileExtensionForm.submitFormButton.click();
        });

        it('then file extension details renders updated file extension', () => {
          expect(fileExtensionDetails.headline.text).to.equal('.changed');
          expect(fileExtensionDetails.description.text).to.equal('Changed');
          expect(fileExtensionDetails.extension.text).to.equal('.changed');
          expect(fileExtensionDetails.importBlocked.isPresent).to.be.true;
        });

        it('then file extension details does not render the data types section', () => {
          expect(fileExtensionDetails.dataTypes.isPresent).to.be.false;
        });
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
