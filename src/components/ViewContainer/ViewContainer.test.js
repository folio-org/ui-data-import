import React from 'react';
import { noop } from 'lodash';
import { createMemoryHistory } from 'history';
import {
  axe,
  toHaveNoViolations,
} from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { buildMutator } from '@folio/stripes-data-transfer-components/test/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { ViewContainer } from './ViewContainer';

import { ENTITY_KEYS } from '../../utils';

expect.extend(toHaveNoViolations);

jest.mock('../Callout', () => ({ createNetworkMessage: () => () => 'message' }));

const history = createMemoryHistory();

history.push = jest.fn();

const profileEntityKey = ENTITY_KEYS.MATCH_PROFILES;

const mutatorMock = buildMutator({
  [profileEntityKey]: {
    POST: jest.fn().mockReturnValue(Promise.resolve()),
    PUT: jest.fn().mockReturnValue(Promise.resolve()),
    DELETE: jest.fn().mockReturnValue(Promise.resolve()),
  },
  restoreDefaults: { POST: jest.fn().mockReturnValue(Promise.resolve()) },
});

const viewContainerProps = {
  entityKey: profileEntityKey,
  location: {
    search: '',
    pathname: '',
  },
  selectedRecords: new Set(['1', '2']),
};

const renderViewContainer = ({
  entityKey,
  location,
  selectedRecords,
  selectRecord,
  children,
}) => {
  const component = (
    <ViewContainer
      entityKey={entityKey}
      mutator={mutatorMock}
      history={history}
      match={{ path: '' }}
      location={location}
      selectedRecords={selectedRecords}
      selectRecord={selectRecord}
    >
      {children}
    </ViewContainer>
  );

  return renderWithIntl(component, translationsProperties);
};

describe.skip('ViewContainer component', () => {
  const children = jest.fn().mockReturnValue('Children');

  afterEach(() => {
    history.push.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderViewContainer({
      ...viewContainerProps,
      children,
    });
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  it('should render children', () => {
    const { getByText } = renderViewContainer({
      ...viewContainerProps,
      children,
    });

    expect(getByText('Children')).toBeDefined();
  });

  describe('when creating a profile', () => {
    const resetForm = jest.fn();
    const record = { id: 'test-id' };
    const properties = { reset: resetForm };

    afterEach(() => {
      resetForm.mockClear();
    });

    it('should reset the form', () => {
      renderViewContainer({
        ...viewContainerProps,
        children,
      });

      children.mock.calls[0][0].handleCreateSuccess(record, noop, properties);

      expect(resetForm).toHaveBeenCalled();
    });

    it('should navigate to the view profile details pane', () => {
      renderViewContainer({
        ...viewContainerProps,
        children,
      });

      children.mock.calls[0][0].handleCreateSuccess(record, noop, properties);

      expect(history.push).toHaveBeenCalledWith('/view/test-id');
    });

    describe('successfully', () => {
      it('should create the profile', async () => {
        renderViewContainer({
          ...viewContainerProps,
          children,
        });

        await children.mock.calls[0][0].onCreate();

        expect(mutatorMock[profileEntityKey].POST).toHaveBeenCalled();
      });
    });

    describe('unsuccessfully', () => {
      it('should cause an error', async () => {
        mutatorMock[profileEntityKey].POST
          .mockClear()
          .mockImplementation(() => Promise.reject(new Error('Something went wrong')));

        renderViewContainer({
          ...viewContainerProps,
          children,
        });

        try {
          await children.mock.calls[0][0].onCreate();
        } catch (e) {
          await expect(mutatorMock[profileEntityKey].POST).rejects.toThrow();
        }
      });
    });
  });

  describe('when editing a profile', () => {
    describe('successfully', () => {
      it('should update the profile', async () => {
        renderViewContainer({
          ...viewContainerProps,
          children,
        });

        await children.mock.calls[0][0].onEdit();

        expect(mutatorMock[profileEntityKey].PUT).toHaveBeenCalled();
      });
    });

    describe('unsuccessfully', () => {
      it('should cause an error', async () => {
        mutatorMock[profileEntityKey].PUT
          .mockClear()
          .mockImplementation(() => Promise.reject(new Error('Something went wrong')));

        renderViewContainer({
          ...viewContainerProps,
          children,
        });

        try {
          await children.mock.calls[0][0].onEdit();
        } catch (e) {
          await expect(mutatorMock[profileEntityKey].PUT).rejects.toThrow();
        }
      });
    });
  });

  describe('when deleting a profile', () => {
    describe('successfully', () => {
      const record = { id: '1' };

      it('should delete the profile', async () => {
        renderViewContainer({
          ...viewContainerProps,
          children,
        });

        await children.mock.calls[0][0].onDelete();

        expect(mutatorMock[profileEntityKey].DELETE).toHaveBeenCalled();
      });

      it('should navigate to the results page', () => {
        renderViewContainer({
          ...viewContainerProps,
          children,
        });

        children.mock.calls[0][0].handleDeleteSuccess(record);

        expect(history.push).toHaveBeenCalledWith('');
      });

      describe('when record is selected', () => {
        it('should deselect deleted profile', () => {
          const selectRecord = jest.fn();
          const child = ({ handleDeleteSuccess }) => {
            handleDeleteSuccess(record);

            return 'Children';
          };

          renderViewContainer({
            ...viewContainerProps,
            selectRecord,
            children: child,
          });

          expect(selectRecord).toHaveBeenCalledWith('1');
        });
      });

      describe('when record is not selected', () => {
        it('should not deselect deleted profile', () => {
          const selectRecord = jest.fn();

          renderViewContainer({
            ...viewContainerProps,
            selectedRecords: new Set(['2']),
            selectRecord,
            children,
          });

          children.mock.calls[0][0].handleDeleteSuccess(record);

          expect(selectRecord).not.toHaveBeenCalled();
        });
      });
    });

    describe('unsuccessfully', () => {
      it('should cause an error', async () => {
        mutatorMock[profileEntityKey].DELETE
          .mockClear()
          .mockImplementation(() => Promise.reject(new Error('Something went wrong')));

        renderViewContainer({
          ...viewContainerProps,
          children,
        });

        try {
          await children.mock.calls[0][0].onDelete();
        } catch (e) {
          await expect(mutatorMock[profileEntityKey].DELETE).rejects.toThrow();
        }
      });

      describe('and error status is not 409', () => {
        it('should not show exception modal', () => {
          const { queryByText } = renderViewContainer({
            ...viewContainerProps,
            children,
          });

          const record = { id: '1' };
          const error = { status: 400 };

          children.mock.calls[0][0].handleDeleteError(record, error);

          expect(queryByText('This match profile cannot be deleted, as it is in use by one or more job profiles.')).toBeNull();
        });
      });
    });
  });

  describe('when restoring a profile', () => {
    describe('successfully', () => {
      it('should restore the profile', async () => {
        renderViewContainer({
          ...viewContainerProps,
          children,
        });

        await children.mock.calls[0][0].onRestoreDefaults();

        expect(mutatorMock.restoreDefaults.POST).toHaveBeenCalled();
      });
    });

    describe('unsuccessfully', () => {
      it('should cause an error', async () => {
        mutatorMock.restoreDefaults.POST
          .mockClear()
          .mockImplementation(() => Promise.reject(new Error('Something went wrong')));

        renderViewContainer({
          ...viewContainerProps,
          children,
        });

        try {
          await children.mock.calls[0][0].onRestoreDefaults();
        } catch (e) {
          await expect(mutatorMock.restoreDefaults.POST).rejects.toThrow();
        }
      });
    });
  });
});
