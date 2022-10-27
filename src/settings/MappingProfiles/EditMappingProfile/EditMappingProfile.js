import React from 'react';
import { get } from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Layer } from '@folio/stripes/components';
import { FullScreenPreloader } from '@folio/data-export/src/components/FullScreenPreloader';

import { MappingProfilesForm } from '../MappingProfilesForm';

const objectName = 'mapping-profiles';

const EditMappingProfileComponent = ({
  resources: { mappingProfile },
  resources,
  mutator,
  parentMutator,
  parentResources,
  stripes,
  fullWidthContainer,
  onEdit,
  ...routerProps
}) => {
  const mappingProfileRecord = get(mappingProfile, 'records.0');

  if (!mappingProfileRecord) {
    return (
      <FullScreenPreloader
        isLoading
      />
    );
  }

  const handleSubmit = e => {
    return onEdit(e);
  };

  return (
    <Layer
      isOpen
      container={fullWidthContainer}
      contentLabel="Mapping profile form"
    >
      <MappingProfilesForm
        {...routerProps}
        id={`${objectName}form-add${objectName}`}
        stripes={stripes}
        parentResources={parentResources}
        parentMutator={parentMutator}
        initialValues={mappingProfileRecord}
        handleSubmit={handleSubmit}
      />
    </Layer>
  );
};

EditMappingProfileComponent.manifest = Object.freeze({
  mappingProfile: {
    type: 'okapi',
    path: 'data-import-profiles/mappingProfiles/:{id}',
    PUT: { throwErrors: false },
  },
});

export const EditMappingProfile = stripesConnect(EditMappingProfileComponent);
