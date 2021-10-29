import React from 'react';
import { noop } from 'lodash';
import { createMemoryHistory } from 'history';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { buildMutator } from '@folio/stripes-data-transfer-components/test/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

import { ViewContainer } from './ViewContainer';

import { ENTITY_KEYS } from '../../utils';

const history = createMemoryHistory();

history.push = jest.fn();

const getMutator = entity => buildMutator({
  [entity]: {
    POST: noop,
    PUT: noop,
    DELETE: noop,
  },
  restoreDefaults: { POST: noop },
});

const viewContainerProps = {
  entityKey: ENTITY_KEYS.MATCH_PROFILES,
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
      mutator={getMutator(entityKey)}
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

describe('ViewContainer component', () => {
  afterEach(() => {
    history.push.mockClear();
  });

  it('should render children', () => {
    const { getByText } = renderViewContainer({
      ...viewContainerProps,
      children: () => <>Children</>,
    });

    expect(getByText('Children')).toBeDefined();
  });

  describe('when creating a profile', () => {
    const resetForm = jest.fn();
    const children = ({ handleCreateSuccess }) => {
      const record = { id: 'test-id' };
      const properties = { reset: resetForm };

      handleCreateSuccess(record, noop, properties);

      return <>Children</>;
    };

    afterEach(() => {
      resetForm.mockClear();
    });

    it('should reset the form', () => {
      renderViewContainer({
        ...viewContainerProps,
        children,
      });

      expect(resetForm).toHaveBeenCalled();
    });

    it('should navigate to the view profile details pane', () => {
      renderViewContainer({
        ...viewContainerProps,
        children,
      });

      expect(history.push).toHaveBeenCalledWith('/view/test-id');
    });
  });

  describe('when deleting a profile', () => {
    describe('successfully', () => {
      const children = ({ handleDeleteSuccess }) => {
        const record = { id: '1' };

        handleDeleteSuccess(record);

        return <>Children</>;
      };

      it('should navigate to the view pane', () => {
        renderViewContainer({
          ...viewContainerProps,
          children,
        });

        expect(history.push).toHaveBeenCalledWith('/view');
      });

      describe('when record is selected', () => {
        it('should deselect deleted profile', () => {
          const selectRecord = jest.fn();

          renderViewContainer({
            ...viewContainerProps,
            selectRecord,
            children,
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

          expect(selectRecord).not.toHaveBeenCalled();
        });
      });
    });

    describe('unsuccessfully', () => {
      describe('and error status is not 409', () => {
        it('should not show exception modal', () => {
          const children = ({ handleDeleteError }) => {
            const record = { id: '1' };
            const error = { status: 400 };

            handleDeleteError(record, error);

            return <>Children</>;
          };

          const { queryByText } = renderViewContainer({
            ...viewContainerProps,
            children,
          });

          expect(queryByText('This match profile cannot be deleted, as it is in use by one or more job profiles.')).toBeNull();
        });
      });
    });
  });
});
