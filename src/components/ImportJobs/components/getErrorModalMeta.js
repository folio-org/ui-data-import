import React from 'react';
import { FormattedMessage } from 'react-intl';

const BLOCKED_FILE_EXTENSIONS_ERROR = 'validation.uploadDefinition.fileExtension.blocked';
const MEMORY_LIMIT_FILE_EXTENSIONS_ERROR = 'upload.fileSize.invalid';

export const ERROR_MODAL_META_TYPES = {
  BLOCKED: 'blocked',
  MEMORY_LIMIT: 'memoryLimit',
  INCONSISTENT: 'inconsistent',
  NO_EXTENSION: 'noExtension',
  DEFAULT: 'default',
};

const knowFileExtensionsErrors = {
  [BLOCKED_FILE_EXTENSIONS_ERROR]: ERROR_MODAL_META_TYPES.BLOCKED,
  [MEMORY_LIMIT_FILE_EXTENSIONS_ERROR]: ERROR_MODAL_META_TYPES.MEMORY_LIMIT,
};

const errorModalMetaTypes = {
  [ERROR_MODAL_META_TYPES.BLOCKED]() {
    return {
      heading: <FormattedMessage id="ui-data-import.modal.fileExtensions.blocked.header" />,
      message: <FormattedMessage id="ui-data-import.modal.fileExtensions.blocked.message" />,
    };
  },
  [ERROR_MODAL_META_TYPES.MEMORY_LIMIT]() {
    return {
      heading: <FormattedMessage id="ui-data-import.modal.fileExtensions.memoryLimit.header" />,
      message: <FormattedMessage id="ui-data-import.modal.fileExtensions.memoryLimit.message" />,
    };
  },
  [ERROR_MODAL_META_TYPES.INCONSISTENT]() {
    const invalidFilesMessage = (
      <FormattedMessage
        id="ui-data-import.modal.fileExtensions.inconsistent.message"
        values={{
          highlightedText: (
            <FormattedMessage
              id="ui-data-import.modal.fileExtensions.messageHighlightedText"
              tagName="strong"
            />
          ),
        }}
      />
    );

    return {
      heading: <FormattedMessage id="ui-data-import.modal.fileExtensions.inconsistent.header" />,
      message: invalidFilesMessage,
    };
  },
  [ERROR_MODAL_META_TYPES.NO_EXTENSION]() {
    return {
      heading: <FormattedMessage id="ui-data-import.modal.fileExtensions.blocked.header" />,
      message: <FormattedMessage id="ui-data-import.modal.fileExtensions.noExtension.message" />,
    };
  },
  [ERROR_MODAL_META_TYPES.DEFAULT]() {
    return {};
  },
};

export const checkForKnowErrorModalTypes = error => knowFileExtensionsErrors[error];

export const getErrorModalMeta = type => (errorModalMetaTypes[type]
  || errorModalMetaTypes[ERROR_MODAL_META_TYPES.DEFAULT])();
