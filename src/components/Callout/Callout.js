import React from 'react';

import { getXHRErrorMessage } from '../../utils';

import {
  SimpleMessage,
  NetworkMessage,
} from './Templates';

export const networkMessage = (type, entityKey, calloutRef) => async (action, record, response) => {
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

export const simpleMessage = (type, entityKey, calloutRef) => record => {
  const { current } = calloutRef;

  current.sendCallout({
    type,
    message: (
      <SimpleMessage
        type={type}
        entityKey={entityKey}
        record={record}
      />
    ),
  });
};
