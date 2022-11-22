import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Layer } from '@folio/stripes/components';

import { ActionProfilesForm } from '../ActionProfilesForm';

export const CreateActionProfile = ({
  fullWidthContainer,
  layerType,
  ...routeProps
}) => {
  const { formatMessage } = useIntl();

  const initialValues = {
    name: '',
    description: '',
  };

  return (
    <Layer
      isOpen
      container={fullWidthContainer}
      contentLabel={formatMessage({ id: 'ui-data-import.settings.actionProfiles.form' })}
    >
      <ActionProfilesForm
        {...routeProps}
        initialValues={initialValues}
        layerType={layerType}
      />
    </Layer>
  );
};

CreateActionProfile.propTypes = {
  fullWidthContainer: PropTypes.instanceOf(Element),
  layerType: PropTypes.string,
};
