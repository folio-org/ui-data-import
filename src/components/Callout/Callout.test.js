import React from 'react';

import '../../../test/jest/__mock__';

import { createNetworkMessage } from './Callout';

const mockCalloutRef = { current: { sendCallout: jest.fn(() => <span>Message</span>) } };

const inputParams = ['success', 'fileExtensions', mockCalloutRef];
const callBackFn = createNetworkMessage(...inputParams);

describe('createNetworkMessage', () => {
  afterEach(() => {
    mockCalloutRef.current.sendCallout.mockClear();
  });

  describe('when function is called', () => {
    it('then it should send message component through call of the `sendCallout`', async () => {
      await callBackFn('create', { name: 'test record name' }, {});

      expect(mockCalloutRef.current.sendCallout).toBeCalledTimes(1);
    });
  });
});
