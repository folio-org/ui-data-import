import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import {
  get,
  omit
} from 'lodash';

import { stripesConnect } from '@folio/stripes/core';
import { Layer } from '@folio/stripes/components';
import { Preloader } from '@folio/stripes-data-transfer-components';

import { JobProfilesForm } from '../JobProfilesForm';

import { LAYER_TYPES } from '../../../utils';

const EditJobProfileComponent = ({
  resources: { jobProfile },
  fullWidthContainer,
  layerType,
  ...routeProps
}) => {
  const { formatMessage } = useIntl();

  const jobProfileRecord = get(jobProfile, 'records.0');

  if (!jobProfileRecord) {
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
  const initialValues = !isDuplicateMode ? jobProfileRecord : omit(jobProfileRecord, ['id', 'parentProfiles', 'childProfiles']);

  return (
    <Layer
      isOpen
      container={fullWidthContainer}
      contentLabel={formatMessage({ id: 'settings.jobProfiles.form' })}
    >
      <JobProfilesForm
        {...routeProps}
        initialValues={initialValues}
      />
    </Layer>
  );
};

EditJobProfileComponent.manifest = Object.freeze({
  jobProfile: {
    type: 'okapi',
    path: 'data-import-profiles/jobProfiles/:{id}',
    PUT: { throwErrors: false },
  },
});

EditJobProfileComponent.propTypes = {
  resources: PropTypes.shape({ jobProfile: PropTypes.object }).isRequired,
  fullWidthContainer: PropTypes.instanceOf(Element),
  layerType: PropTypes.string,
};

export const EditJobProfile = stripesConnect(EditJobProfileComponent);
