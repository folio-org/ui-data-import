import React from 'react';
import { FormattedMessage } from 'react-intl';

import { getXHRErrorMessage } from '../../utils';

export const createUpdateRecordErrorMessage = ({
  getRecordName,
  calloutRef,
}) => async (record, response) => {
  const errorMsgIdEnding = await getXHRErrorMessage(response);
  const errorMessage = (
    <FormattedMessage
      id="ui-data-import.settings.save.error.network"
      values={{
        description: errorMsgIdEnding
          ? (
            <FormattedMessage
              id={`ui-data-import.validation.${errorMsgIdEnding}`}
              values={{ value: <strong>{getRecordName(record)}</strong> }}
            />
          )
          : <FormattedMessage id="ui-data-import.communicationProblem" />,
      }}
    />
  );

  calloutRef.current.sendCallout({
    type: 'error',
    message: errorMessage,
  });
};

export const createDeleteCallout = ({
  getMessage,
  calloutRef,
  type,
}) => record => {
  const message = getMessage(record);

  calloutRef.current.sendCallout({
    message,
    type,
  });
};
