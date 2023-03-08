import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import faker from 'faker';
import {
  fireEvent,
  waitFor,
} from '@testing-library/react';
import { noop } from 'lodash';
import { createMemoryHistory } from 'history';
import { runAxeTest } from '@folio/stripes-testing';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { buildResources } from '@folio/stripes-data-transfer-components/test/helpers';

import '../../../../test/jest/__mock__';
import { translationsProperties } from '../../../../test/jest/helpers';

import { ViewFileExtension } from './ViewFileExtension';

const history = createMemoryHistory();

history.push = jest.fn();

const fileExtensionId = faker.random.uuid();

const resources = importBlocked => buildResources({
  resourceName: 'fileExtension',
  records: [
    {
      dataTypes: ['MARC'],
      extension: '.dat',
      description: '',
      importBlocked,
      id: fileExtensionId,
      metadata: {
        updatedDate: '2019-01-01T11:22:07.000+0000',
        updatedByUsername: 'System',
        createdByUserId: faker.random.uuid(),
        updatedByUserId: faker.random.uuid(),
      },
      userInfo: {
        firstName: '',
        lastName: '',
        userName: 'System',
      },
    },
  ],
});

const viewFileExtensionProps = {
  location: {
    search: '?sort=extension',
    pathname: `/file-extensions/view/${fileExtensionId}`,
  },
  match: {
    path: '/file-extensions/view/:id',
    params: { id: fileExtensionId },
  },
};

const renderViewFileExtension = ({
  location,
  match,
  importBlocked = false,
  noRecord = false,
}) => {
  const component = (
    <Router>
      <ViewFileExtension
        resources={!noRecord ? resources(importBlocked) : {}}
        onClose={noop}
        onDelete={noop}
        match={match}
        location={location}
        history={history}
        stripes={{ hasPerm: () => true }}
      />
    </Router>
  );

  return renderWithIntl(component, translationsProperties);
};

describe('ViewFileExtension', () => {
  afterEach(() => {
    history.push.mockClear();
  });

  it('should be rendered with no axe errors', async () => {
    const { container } = renderViewFileExtension(viewFileExtensionProps);

    await runAxeTest({ rootNode: container });
  });

  it('should render extension name', () => {
    const { container } = renderViewFileExtension(viewFileExtensionProps);

    const paneTitle = container.querySelector('.paneTitleLabel');

    expect(paneTitle.textContent).toEqual('.dat');
  });

  describe('when there is no record', () => {
    it('should render loading spinner', () => {
      const { getByText } = renderViewFileExtension({
        ...viewFileExtensionProps,
        noRecord: true,
      });

      expect(getByText('Loading')).toBeDefined();
    });
  });

  describe('when import is blocked', () => {
    it('should render disabled block import checkbox', () => {
      const { getByLabelText } = renderViewFileExtension({
        ...viewFileExtensionProps,
        importBlocked: true,
      });

      expect(getByLabelText('Block import', { exact: false })).toBeDefined();
    });
  });

  describe('when click on delete action button', () => {
    it('modal window should appear', () => {
      const { getByText } = renderViewFileExtension(viewFileExtensionProps);

      fireEvent.click(getByText('Actions'));
      fireEvent.click(getByText('Delete'));

      expect(getByText('Delete file extension?')).toBeDefined();
    });
  });

  describe('when file extension is deleted', () => {
    it('modal window should be closed', async () => {
      const {
        queryByText,
        getAllByText,
        getByText,
      } = renderViewFileExtension(viewFileExtensionProps);

      fireEvent.click(getByText('Actions'));
      fireEvent.click(getByText('Delete'));

      const deleteModalButton = getAllByText('Delete')[1];

      fireEvent.click(deleteModalButton);

      await waitFor(() => expect(queryByText('Delete file extension?')).toBeNull());
    });
  });
});
