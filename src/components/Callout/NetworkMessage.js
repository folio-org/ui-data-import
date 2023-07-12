import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

export const NetworkMessage = memo(({
  messageId,
  action,
  type,
  record,
}) => {
  const {
    name: recordName,
    profile,
    extension,
  } = record;

  const communicationProblemMessage = (
    <FormattedMessage
      id="ui-data-import.communicationProblem"
      tagName="p"
    />
  );

  const errorMessage = <><br /> {messageId}</>;

  const sucessMassage = (
    <FormattedMessage
      id={`ui-data-import.${type}.${messageId}`}
      tagName="p"
      values={{
        name: recordName || profile?.name || extension,
        action: <FormattedMessage id={`ui-data-import.action.${action}`} />,
      }}
    />
  );

  return (
    <div>
      <FormattedMessage
        id={`ui-data-import.settings.${action}.${type}`}
        tagName="strong"
      />
      {type === 'error' && !messageId && communicationProblemMessage}
      {type === 'error' && messageId && errorMessage}
      {type !== 'error' && sucessMassage}
    </div>
  );
});

NetworkMessage.propTypes = {
  action: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
  messageId: PropTypes.string,
};
