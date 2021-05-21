import React from 'react';
import PropTypes from 'prop-types';

import {
  checkScope,
  HasCommand,
} from '@folio/stripes/components';

import {
  createLayerURL,
  DEFAULT_PROFILE_IDS,
  LAYER_TYPES,
} from '../../utils';

export const DetailsKeyShortcutsWrapper = ({
  children,
  recordId,
  history,
  location,
}) => {
  const isDefaultProfile = DEFAULT_PROFILE_IDS.includes(recordId);

  const keyCommands = [
    {
      name: 'edit',
      handler: () => {
        if (isDefaultProfile) return;

        const url = createLayerURL(location, LAYER_TYPES.EDIT);

        history.push(url);
      },
    }, {
      name: 'duplicateRecord',
      handler: () => {
        const url = createLayerURL(location, LAYER_TYPES.DUPLICATE);

        history.push(url);
      },
    },
  ];

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

DetailsKeyShortcutsWrapper.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  recordId: PropTypes.string.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.oneOfType([
    PropTypes.shape({
      search: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    PropTypes.string.isRequired,
  ]).isRequired,
};
