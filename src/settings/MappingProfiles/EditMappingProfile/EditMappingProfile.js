import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  get,
  omit,
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Layer } from '@folio/stripes/components';
import { Preloader } from '@folio/stripes-data-transfer-components';

import { MappingProfilesForm } from '../MappingProfilesForm';

import {
  LAYER_TYPES,
  omitAssociatedProfiles,
} from '../../../utils';

const EditMappingProfileComponent = ({
  resources: { mappingProfile },
  fullWidthContainer,
  layerType,
  onSubmit,
  ...routeProps
}) => {
  const { formatMessage } = useIntl();

  const mappingProfileRecord = get(mappingProfile, 'records.0');

  if (!mappingProfileRecord) {
    return (
      <Layer
        isOpen
        container={fullWidthContainer}
        contentLabel={formatMessage({ id: 'stripes-data-transfer-components.loading' })}
      >
        <Preloader />
      </Layer>
    );
  }

  const isDuplicateMode = layerType === LAYER_TYPES.DUPLICATE;
  const initialValues = !isDuplicateMode ? mappingProfileRecord : omit(mappingProfileRecord, ['id', 'parentProfiles', 'childProfiles']);

  return (
    <Layer
      isOpen
      container={fullWidthContainer}
      contentLabel={formatMessage({ id: 'ui-data-import.settings.mappingProfiles.form' })}
    >
      <MappingProfilesForm
        {...routeProps}
        onSubmit={omitAssociatedProfiles(onSubmit)}
        initialValues={initialValues}
        layerType={layerType}
      />
    </Layer>
  );
};

EditMappingProfileComponent.manifest = Object.freeze({
  mappingProfile: {
    type: 'okapi',
    path: 'data-import-profiles/mappingProfiles/:{id}',
    params: { withRelations: true },
    PUT: { throwErrors: false },
    resourceShouldRefresh: true,
  },
});

EditMappingProfileComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  resources: PropTypes.shape({ mappingProfile: PropTypes.object }).isRequired,
  fullWidthContainer: PropTypes.instanceOf(Element),
  layerType: PropTypes.string,
};

export const EditMappingProfile = stripesConnect(EditMappingProfileComponent);
