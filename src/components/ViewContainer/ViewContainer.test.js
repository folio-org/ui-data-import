import React from 'react';
import { createMemoryHistory } from 'history';

import '../../../test/jest/__mock__';

import { noop } from 'lodash';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import { buildMutator } from '@folio/stripes-data-transfer-components/test/helpers';

import { ViewContainer } from './ViewContainer';
import { translationsProperties } from '../../../test/jest/helpers';

jest.mock('../Callout', () => ({
  createNetworkMessage: jest.fn(({
    type, entityKey, calloutRef,
  }) => async (action, record, response) => {
    const { current } = {
      current: {
        sendCallout: jest.fn(),
        removeCallout: jest.fn(),
      },
    };

    current.sendCallout({
      type,
      message: (
        <div>message</div>
      ),
    });
  }),
}));

jest.mock('../ExceptionModal', () => ({
  ExceptionModal: jest.fn(({
    showExceptionModal,
    onClose,
  }) => {
    const handleClose = onClose();

    return (showExceptionModal ? (
      <div>
        <span>Exception modal</span>
        <button
          type="button"
          onClick={handleClose}
        > Cancel
        </button>
      </div>
    ) : null);
  }),
}));

const resetForm = jest.fn();

const record = {
  id: 'testId1',
  parentProfiles: 'testParent',
  childProfiles: 'testChild',
};

const recordError = {
  id: 'test34',
  parentProfiles: 'testParent',
  childProfiles: 'testChild',
};

export const ENTITY_KEYS = {
  FILE_EXTENSIONS: 'fileExtensions',
  JOB_PROFILES: 'jobProfiles',
  MATCH_PROFILES: 'matchProfiles',
  ACTION_PROFILES: 'actionProfiles',
  MAPPING_PROFILES: 'mappingProfiles',
};

const mutatorCustom = buildMutator({
  fileExtensions: {
    POST: () => new Promise((resolve, _) => {
      const response = <div>Test</div>;

      process.nextTick(() => resolve(response));
    }),
    PUT: () => new Promise((resolve, _) => {
      const response = <div>Test</div>;

      process.nextTick(() => resolve(response));
    }),
    DELETE: () => new Promise((resolve, _) => {
      const response = <div>Test</div>;

      process.nextTick(() => resolve(response));
    }),
  },
  restoreDefaults: {
    POST: () => new Promise((resolve, _) => {
      const response = <div>Test</div>;

      process.nextTick(() => resolve(response));
    }),
  },
});
const mutatorDeleteSuccess = buildMutator({
  fileExtensions: {
    DELETE: () => new Promise((resolve, _) => {
      process.nextTick(() => resolve());
    }),
  },
});

const mutatorError = buildMutator({
  actionProfiles: {
    POST: () => new Promise((_, reject) => process.nextTick(() => reject())),
    PUT: () => new Promise((_, reject) => process.nextTick(() => reject())),
    DELETE: () => new Promise((_, reject) => process.nextTick(() => reject())),
    cancel: jest.fn(),
  },
  fileExtensions: {
    POST: () => new Promise((_, reject) => process.nextTick(() => reject())),
    PUT: () => new Promise((_, reject) => process.nextTick(() => reject())),
    DELETE: () => new Promise((_, reject) => {
      const error = { status: 400 };

      process.nextTick(() => reject(error));
    }),
  },
  restoreDefaults: { POST: () => new Promise((_, reject) => process.nextTick(() => reject())) },
});

const mutatorDelete = buildMutator({
  fileExtensions: {
    DELETE: () => new Promise((_, reject) => {
      const error = { status: 409 };

      process.nextTick(() => reject(error));
    }),
  },
});

const mutatorEdit = buildMutator({
  fileExtensions: {
    // eslint-disable-next-line prefer-promise-reject-errors
    POST: () => new Promise((_, reject) => reject({ status: 400 })),
    // eslint-disable-next-line prefer-promise-reject-errors
    PUT: () => new Promise((_, reject) => reject({ status: 400 })),
  },
});

const path = { path: '/settings/data-import/fileExtensions' };

const historyData = createMemoryHistory();

historyData.push = jest.fn();

const testSet = new Set(['testId1']);

const locationData = {
  hash: '',
  key: '8jo8ak',
  pathname: '/settings/data-import/fileExtensions',
  search: '?sort=extension',
};

const fileExtensionProps = {
  entityKey: ENTITY_KEYS.FILE_EXTENSIONS,
  location: locationData,
  history: { push: historyData.push },
  selectedRecords: testSet,
};

const renderViewContainer = ({
  entityKey,
  mutator,
  location,
  history,
  selectedRecords,
  selectRecord,
  handleEditSuccessProp,
  handleDeleteSuccessProp,
  handleDeleteErrorProp,
  apiCallSuccess,
  deleteAltResponse,
  onRestore,
  onEditProp,
  onCreateProp,
}) => {
  const childComponent = ({
    handleCreateSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    handleDeleteError,
    onCreate,
    onEdit,
    onDelete,
    onRestoreDefaults,
  }) => {
    const dispatch = jest.fn();
    const properties = { reset: resetForm };

    const asyncEdit = async recordData => {
      try {
        await onEdit(recordData);
      } catch (e) {
        console.log('edit', e);
      }
    };

    const asyncCreate = async recordData => {
      try {
        await onCreate(recordData);
      } catch (e) {
        console.log('Create', e);
      }
    };

    if (!onEditProp) {
      // eslint-disable-next-line no-unused-expressions
      handleEditSuccessProp ? handleEditSuccess(record, dispatch, properties) : handleCreateSuccess(record, dispatch, properties);
      // eslint-disable-next-line no-unused-expressions
      handleDeleteSuccessProp ? handleDeleteSuccess(record) : handleDeleteSuccess(recordError);
      // eslint-disable-next-line no-unused-expressions
      handleDeleteErrorProp ? handleDeleteError(record, { status: 200 }) : () => handleDeleteError(record, { status: 409 });

      if (apiCallSuccess) {
        // eslint-disable-next-line no-unused-expressions
        !deleteAltResponse ? onCreate(record) : ' ';
        // eslint-disable-next-line no-unused-expressions
        !deleteAltResponse ? onEdit(record) : ' ';
        // eslint-disable-next-line no-unused-expressions
        deleteAltResponse ? onDelete(record) : onDelete(record);
        // eslint-disable-next-line no-unused-expressions
        !deleteAltResponse ? onRestoreDefaults(record) : ' ';
      } else {
        // eslint-disable-next-line no-unused-expressions
        onRestore ? onRestoreDefaults(record) : onDelete(record);
      }
    } else {
      // eslint-disable-next-line no-unused-expressions
      onCreateProp ? asyncCreate(record) : asyncEdit(record);
    }

    return (
      <div>
        <span>child component</span>
      </div>
    );
  };

  const component = (
    <ViewContainer
      entityKey={entityKey}
      mutator={mutator}
      location={location}
      history={history}
      match={path}
      selectedRecords={selectedRecords}
      selectRecord={selectRecord}
    >
      {
        ({
          fullWidthContainer,
          calloutRef,
          handleCreateSuccess,
          handleEditSuccess,
          handleDeleteSuccess,
          handleDeleteError,
          onCreate,
          onEdit,
          onDelete,
          onRestoreDefaults,
        }) => childComponent({
          fullWidthContainer,
          calloutRef,
          handleCreateSuccess,
          handleEditSuccess,
          handleDeleteSuccess,
          handleDeleteError,
          onCreate,
          onEdit,
          onDelete,
          onRestoreDefaults,
        })}
    </ViewContainer>

  );

  return renderWithIntl(component, translationsProperties);
};

describe('View Container component', () => {
  describe('when View container is rendered', () => {
    it('handle create success should work', () => {
      expect(renderViewContainer({
        ...fileExtensionProps,
        handleEditSuccessProp: false,
        mutator: mutatorCustom,
      })).toBeDefined();
    });

    it('handle edit success should work', () => {
      expect(renderViewContainer({
        ...fileExtensionProps,
        handleEditSuccessProp: true,
        mutator: mutatorCustom,
      })).toBeDefined();
    });

    it('handle delete success should work', () => {
      expect(renderViewContainer({
        ...fileExtensionProps,
        handleDeleteSuccessProp: true,
        mutator: mutatorCustom,
      })).toBeDefined();
    });

    it('else condition in handle delete success should work', () => {
      expect(renderViewContainer({
        ...fileExtensionProps,
        selectRecord: ' ',
        handleDeleteSuccessProp: false,
        mutator: mutatorCustom,
      })).toBeDefined();
    });

    it('handle delete error should work', () => {
      expect(renderViewContainer({
        ...fileExtensionProps,
        selectRecord: noop,
        handleDeleteErrorProp: true,
        mutator: mutatorCustom,
      })).toBeDefined();
    });

    it('Exception modal should work', () => {
      expect(renderViewContainer({
        ...fileExtensionProps,
        selectRecord: () => {},
        handleDeleteErrorProp: false,
        mutator: mutatorCustom,
      })).toBeDefined();
    });
  });

  describe('Get Crud Actions API Call', () => {
    describe('Success Scenarios', () => {
      it('onCreate should work', () => {
        expect(renderViewContainer({
          ...fileExtensionProps,
          mutator: mutatorCustom,
          apiCallSuccess: true,
        })).toBeDefined();
      });
      it('onEdit should work', () => {
        expect(renderViewContainer({
          ...fileExtensionProps,
          mutator: mutatorCustom,
          apiCallSuccess: true,
        })).toBeDefined();
      });
      it('onDelete should work', () => {
        expect(renderViewContainer({
          ...fileExtensionProps,
          mutator: mutatorCustom,
          apiCallSuccess: true,
        })).toBeDefined();
      });
      it('onDelete alternate response should work', () => {
        expect(renderViewContainer({
          ...fileExtensionProps,
          mutator: mutatorDeleteSuccess,
          apiCallSuccess: true,
          deleteAltResponse: true,
        })).toBeDefined();
      });
      it('onRestore should work', () => {
        expect(renderViewContainer({
          ...fileExtensionProps,
          mutator: mutatorCustom,
          apiCallSuccess: true,
        })).toBeDefined();
      });
    });
    describe('Error Scenarios', () => {
      it('onDelete should work', () => {
        expect(renderViewContainer({
          ...fileExtensionProps,
          mutator: mutatorError,
          apiCallSuccess: false,
          onRestore: false,
        })).toBeDefined();
      });
      it('onDelete else condition should work', () => {
        expect(renderViewContainer({
          ...fileExtensionProps,
          mutator: mutatorDelete,
          apiCallSuccess: false,
          onRestore: false,
        })).toBeDefined();
      });
      it('onRestore should work', () => {
        expect(renderViewContainer({
          ...fileExtensionProps,
          mutator: mutatorError,
          apiCallSuccess: false,
          onRestore: true,
        })).toBeDefined();
      });
      it('onCreate should work', async () => {
        await renderViewContainer({
          ...fileExtensionProps,
          mutator: mutatorEdit,
          onEditProp: true,
          onCreateProp: true,
        });
      });
      it('onEdit should work', async () => {
        await renderViewContainer({
          ...fileExtensionProps,
          mutator: mutatorEdit,
          onEditProp: true,
          onCreateProp: false,
        });
      });
    });
  });
});
