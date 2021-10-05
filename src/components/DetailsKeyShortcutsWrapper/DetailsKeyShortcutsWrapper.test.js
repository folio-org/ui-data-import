import React from 'react';

import { createMemoryHistory } from 'history';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';

import faker from 'faker';

import {
  renderWithReduxForm,
  translationsProperties,
  duplicateRecordShortcut,
  openEditShortcut,
} from '../../../test/jest/helpers';

import { DetailsKeyShortcutsWrapper } from './DetailsKeyShortcutsWrapper';

import { OCLC_UPDATE_INSTANCE_JOB_ID } from '../../utils';

const {
  CommandList,
  defaultKeyboardShortcuts,
} = require('@folio/stripes/components');

const history = createMemoryHistory();

history.push = jest.fn();

jest.mock('@folio/stripes/smart-components', () => ({ ...jest.requireActual('@folio/stripes/smart-components') }), { virtual: true });

const recordIdProp = faker.random.uuid;

const locationProp = {
  search: '',
  pathname: '',
};

const renderDetailsKeyShortcutsWrapper = ({
  recordId,
  location,
}) => {
  const childElement = <input data-testid="childElement" />;

  const component = () => (
    <CommandList commands={defaultKeyboardShortcuts}>
      <DetailsKeyShortcutsWrapper
        recordId={recordId}
        history={history}
        location={location}
      >
        <span>{childElement}</span>
      </DetailsKeyShortcutsWrapper>
    </CommandList>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('DetailsKeyShortcutsWrapper component', () => {
  afterEach(() => {
    history.push.mockClear();
  });

  it('should render children correctly', () => {
    const { getByTestId } = renderDetailsKeyShortcutsWrapper({
      recordId: recordIdProp(),
      location: locationProp,
    });

    expect(getByTestId('childElement')).toBeInTheDocument();
  });

  it('should not call the handler for edit shortcut on a default record', () => {
    const { getByTestId } = renderDetailsKeyShortcutsWrapper({
      recordId: OCLC_UPDATE_INSTANCE_JOB_ID,
      location: locationProp,
    });

    const childElement = getByTestId('childElement');

    childElement.focus();

    openEditShortcut(childElement);

    expect(history.push).not.toHaveBeenCalled();
  });

  describe('calls the correct handler when a key is pressed that', () => {
    it('matches edit shortcut', () => {
      const { getByTestId } = renderDetailsKeyShortcutsWrapper({
        recordId: recordIdProp(),
        location: locationProp,
      });

      const childElement = getByTestId('childElement');

      childElement.focus();

      openEditShortcut(childElement);

      expect(history.push).toHaveBeenCalled();
    });

    it('matches duplicateRecord shortcut pressed', () => {
      const { getByTestId } = renderDetailsKeyShortcutsWrapper({
        recordId: recordIdProp(),
        location: locationProp,
      });

      const childElement = getByTestId('childElement');

      childElement.focus();
      duplicateRecordShortcut(childElement);

      expect(history.push).toHaveBeenCalled();
    });
  });
});
