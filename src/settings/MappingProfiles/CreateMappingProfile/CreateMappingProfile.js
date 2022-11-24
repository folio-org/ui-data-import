import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Layer } from '@folio/stripes/components';

import { MappingProfilesForm } from '../MappingProfilesForm';

export const CreateMappingProfile = ({
  fullWidthContainer,
  layerType,
  ...routeProps
}) => {
  const { formatMessage } = useIntl();

  const initialValues = {
    name: '',
    incomingRecordType: '',
    existingRecordType: '',
    description: '',
    mappingDetails: {},
  };

  return (
    <Layer
      isOpen
      container={fullWidthContainer}
      contentLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfiles.form' })}
    >
      <MappingProfilesForm
        {...routeProps}
        initialValues={initialValues}
        layerType={layerType}
      />
    </Layer>
  );
};

CreateMappingProfile.propTypes = {
  fullWidthContainer: PropTypes.instanceOf(Element),
  layerType: PropTypes.string,
};
