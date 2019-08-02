import React from 'react';

import { getXHRErrorMessage } from '../../utils';

import { NetworkMessage } from './NetworkMessage';

export const createNetworkMessage = (type, entityKey, calloutRef) => async (action, record, response) => {
  const { current } = calloutRef;

  let messageId = await getXHRErrorMessage(response);

  if (!messageId) {
    messageId = `${entityKey}.action`;
  }

  current.sendCallout({
    type,
    message: (
      <NetworkMessage
        action={action}
        type={type}
        messageId={messageId}
        record={record}
      />
    ),
  });
};
