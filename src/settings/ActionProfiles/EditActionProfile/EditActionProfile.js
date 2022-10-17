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

import { ActionProfilesForm } from '../ActionProfilesForm';

import { LAYER_TYPES } from '../../../utils';

const EditActionProfileComponent = ({
  resources: { actionProfile },
  fullWidthContainer,
  layerType,
  ...routeProps
}) => {
  const { formatMessage } = useIntl();

  const actionProfileRecord = get(actionProfile, 'records.0');

  if (!actionProfileRecord) {
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
  const initialValues = !isDuplicateMode ? actionProfileRecord : omit(actionProfileRecord, ['id', 'parentProfiles', 'childProfiles']);

  return (
    <Layer
      isOpen
      container={fullWidthContainer}
      contentLabel={formatMessage({ id: 'settings.actionProfiles.form' })}
    >
      <ActionProfilesForm
        {...routeProps}
        initialValues={initialValues}
        layerType={layerType}
      />
    </Layer>
  );
};

EditActionProfileComponent.manifest = Object.freeze({
  actionProfile: {
    type: 'okapi',
    path: 'data-import-profiles/actionProfiles/:{id}',
    PUT: { throwErrors: false },
  },
});

EditActionProfileComponent.propTypes = {
  resources: PropTypes.shape({ actionProfile: PropTypes.object }).isRequired,
  fullWidthContainer: PropTypes.instanceOf(Element),
  layerType: PropTypes.string,
};

export const EditActionProfile = stripesConnect(EditActionProfileComponent);
