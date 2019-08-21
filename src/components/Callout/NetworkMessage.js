import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

export const NetworkMessage = memo(({
  messageId,
  action,
  type,
  record: {
    name: recordName,
    extension,
  },
}) => (
  <div>
    <FormattedMessage
      id={`ui-data-import.settings.${action}.${type}`}
      tagName="strong"
    />
    {(type === 'error' && !messageId)
      ? (
        <FormattedMessage
          id="ui-data-import.communicationProblem"
          tagName="p"
        />
      )
      : (
        <FormattedMessage
          id={`ui-data-import.${type}.${messageId}`}
          tagName="p"
          values={{
            name: recordName || extension,
            action: <FormattedMessage id={`ui-data-import.action.${action}`} />,
          }}
        />
      )
    }
  </div>
));

NetworkMessage.propTypes = {
  action: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  messageId: PropTypes.string,
};
