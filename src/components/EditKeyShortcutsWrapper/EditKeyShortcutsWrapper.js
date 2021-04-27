import React from 'react';
import PropTypes from 'prop-types';

import {
  checkScope,
  HasCommand,
} from '@folio/stripes/components';

export const EditKeyShortcutsWrapper = ({
  children,
  onSubmit,
}) => {
  const keyCommands = [{
    name: 'save',
    handler: async e => {
      e.preventDefault();

      await onSubmit(e);
    },
  }];

  return (
    <HasCommand
      commands={keyCommands}
      isWithinScope={checkScope}
      scope={document.body}
    >
      {children}
    </HasCommand>
  );
};

EditKeyShortcutsWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  onSubmit: PropTypes.func.isRequired,
};
