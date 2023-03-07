import React from 'react';
import { axe } from 'jest-axe';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';

import '../../../test/jest/__mock__';
import { translationsProperties } from '../../../test/jest/helpers';

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
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });

  describe('when `messageId` prop is not passed and type is error', () => {
    it('then component should display default error message text', () => {
      const { getByText } = renderNetworkMessage(errorMessageProps);

      expect(getByText('Server communication problem. Please try again')).toBeDefined();
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
