import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  checkForKnowErrorModalTypes,
  getErrorModalMeta,
} from './getErrorModalMeta';

describe('getErrorModalMeta', () => {
  describe('checkForKnowErrorModalTypes method', () => {
    it('should return correct error', () => {
      const blockedError = checkForKnowErrorModalTypes('validation.uploadDefinition.fileExtension.blocked');
      const memoryLimitError = checkForKnowErrorModalTypes('upload.fileSize.invalid');

      expect(blockedError).toEqual('blocked');
      expect(memoryLimitError).toEqual('memoryLimit');
    });
  });

  describe('getErrorModalMeta method', () => {
    it('should return correct meta', () => {
      const blockedError = getErrorModalMeta('blocked');
      const memoryLimitError = getErrorModalMeta('memoryLimit');
      const inconsistentError = getErrorModalMeta('inconsistent');
      const noExtensionError = getErrorModalMeta('noExtension');
      const defaultError = getErrorModalMeta('default');

      expect(blockedError).toEqual({
        heading: <FormattedMessage id="ui-data-import.modal.fileExtensions.blocked.header" />,
        message: <FormattedMessage id="ui-data-import.modal.fileExtensions.blocked.message" />,
      });
      expect(memoryLimitError).toEqual({
        heading: <FormattedMessage id="ui-data-import.modal.fileExtensions.memoryLimit.header" />,
        message: <FormattedMessage id="ui-data-import.modal.fileExtensions.memoryLimit.message" />,
      });
      expect(inconsistentError).toMatchObject({ heading: <FormattedMessage id="ui-data-import.modal.fileExtensions.inconsistent.header" /> });
      expect(noExtensionError).toEqual({
        heading: <FormattedMessage id="ui-data-import.modal.fileExtensions.blocked.header" />,
        message: <FormattedMessage id="ui-data-import.modal.fileExtensions.noExtension.message" />,
      });
      expect(defaultError).toEqual({});
      expect(getErrorModalMeta('someType')).toEqual({});
    });
  });
});
