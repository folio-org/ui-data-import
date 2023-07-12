import React from 'react';
import { runAxeTest } from '@folio/stripes-testing';

import {
  renderWithIntl,
  translationsProperties,
} from '../../../test/jest/helpers';
import '../../../test/jest/__mock__';

import { NetworkMessage } from './NetworkMessage';

const errorMessageProps = {
  type: 'error',
  record: {},
};

const renderNetworkMessage = ({
  messageId,
  type,
  record,
}) => {
  const component = (
    <NetworkMessage
      action="create"
      type={type}
      messageId={messageId}
      record={record}
    />
  );

  return renderWithIntl(component, translationsProperties);
};

describe('NetworkMessage component', () => {
  it('should be rendered with no axe errors', async () => {
    const { container } = renderNetworkMessage(errorMessageProps);

    await runAxeTest({ rootNode: container });
  });

  describe('when `messageId` prop is not passed and type is error', () => {
    it('then component should display default error message text', () => {
      const { getByText } = renderNetworkMessage(errorMessageProps);

      expect(getByText('Server communication problem. Please try again')).toBeDefined();
    });
  });

  describe('when messageId prop is passed and type is error', () => {
    it('then component should be rendered with message text depends on the parameters', () => {
      const { getByText } = renderNetworkMessage({
        messageId: 'Error message',
        type: 'error',
        record: { name: 'test record name' },
      });

      expect(getByText('Error message')).toBeDefined();
    });
  });

  describe('when messageId prop is passed and type is not error', () => {
    describe('and name is name of record', () => {
      it('then component should be rendered with message text depends on the parameters', () => {
        const { getByText } = renderNetworkMessage({
          messageId: 'fileExtensions.action',
          type: 'success',
          record: { name: 'test record name' },
        });

        expect(getByText('The file extension "test record name" was successfully created')).toBeDefined();
      });
    });

    describe('and name is name of profile', () => {
      it('then component should be rendered with message text depends on the parameters', () => {
        const { getByText } = renderNetworkMessage({
          messageId: 'fileExtensions.action',
          type: 'success',
          record: { profile: { name: 'test profile name' } },
        });

        expect(getByText('The file extension "test profile name" was successfully created')).toBeDefined();
      });
    });

    describe('and name is name of extension', () => {
      it('then component should be rendered with message text depends on the parameters', () => {
        const { getByText } = renderNetworkMessage({
          messageId: 'fileExtensions.action',
          type: 'success',
          record: { extension: 'test extension name' },
        });

        expect(getByText('The file extension "test extension name" was successfully created')).toBeDefined();
      });
    });
  });
});
