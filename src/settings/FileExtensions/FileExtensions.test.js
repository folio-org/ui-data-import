import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';

import {
  buildResources,
  buildMutator,
} from '@folio/stripes-data-transfer-components/test/helpers';
import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { Paneset } from '@folio/stripes/components';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../test/jest/helpers';

import { FileExtensions } from './FileExtensions';

const history = createMemoryHistory();

history.push = jest.fn();

const resources = buildResources({
  resourceName: 'fileExtensions',
  records: [
    {
      dataTypes: ['MARC'],
      extension: '.dat',
      id: 'testId1',
      metadata: {
        updatedDate: '2019-01-01T11:22:07.000+0000',
        updatedByUsername: 'System',
      },
      userInfo: {
        firstName: '',
        lastName: '',
        userName: 'System',
      },
    },
  ],
});
const mutator = buildMutator({
  query: {
    replace: noop,
    update: noop,
  },
  fileExtensions: {
    POST: noop,
    PUT: noop,
    DELETE: noop,
  },
  restoreDefaults: { POST: noop },
});

const fileExtensionsProps = {
  location: {
    search: 'data-import-profiles/file-extensions',
    pathname: 'data-import-profiles/file-extensions',
  },
  match: { path: 'data-import-profiles/file-extensions' },
  label: <span>File extensions</span>,
  selectedRecord: {
    record: null,
    hasLoaded: false,
  },
  checkboxList: {
    selectedRecords: null,
    isAllSelected: false,
    selectRecord: noop,
    selectAll: noop,
    deselectAll: noop,
    handleSelectAllCheckbox: noop,
  },
};

const renderFileExtensions = ({
  location,
  match,
  label,
  selectedRecord,
  checkboxList,
}) => {
  const component = () => (
    <Router>
      <Paneset>
        <FileExtensions
          location={location}
          checkboxList={checkboxList}
          history={history}
          resources={resources}
          selectedRecord={selectedRecord}
          label={label}
          match={match}
          mutator={mutator}
        />
      </Paneset>
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('FileExtensions', () => {
  afterEach(() => {
    history.push.mockClear();
  });

  it('should be rendered', () => {
    const { getByText } = renderFileExtensions(fileExtensionsProps);

    expect(getByText('File extensions')).toBeDefined();
  });
});
