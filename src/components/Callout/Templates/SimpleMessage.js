import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

export const SimpleMessage = memo(props => {
  const {
    type,
    entityKey,
    record,
  } = props;

  return (
    <FormattedMessage
      id={`ui-data-import.settings.${entityKey}.action.${type}`}
      values={{
        name: record.name,
        action: (
          <FormattedMessage
            tagName="strong"
            id="ui-data-import.deleted"
          />
        ),
      }}
    />
  );
});

SimpleMessage.propTypes = {
  type: PropTypes.string.isRequired,
  entityKey: PropTypes.string.isRequired,
  record: PropTypes.object.isRequired,
};
