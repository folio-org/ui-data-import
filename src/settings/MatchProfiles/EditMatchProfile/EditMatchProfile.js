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

import { MatchProfilesForm } from '../MatchProfilesForm';

import { LAYER_TYPES } from '../../../utils';

const EditMatchProfileComponent = ({
  resources: { matchProfile },
  fullWidthContainer,
  layerType,
  ...routeProps
}) => {
  const { formatMessage } = useIntl();

  const matchProfileRecord = get(matchProfile, 'records.0');

  if (!matchProfileRecord) {
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
  const initialValues = !isDuplicateMode ? matchProfileRecord : omit(matchProfileRecord, ['id', 'parentProfiles', 'childProfiles']);

  return (
    <Layer
      isOpen
      container={fullWidthContainer}
      contentLabel={formatMessage({ id: 'settings.matchProfiles.form' })}
    >
      <MatchProfilesForm
        {...routeProps}
        initialValues={initialValues}
        layerType={layerType}
      />
    </Layer>
  );
};

EditMatchProfileComponent.manifest = Object.freeze({
  matchProfile: {
    type: 'okapi',
    path: 'data-import-profiles/matchProfiles/:{id}',
    PUT: { throwErrors: false },
  },
});

EditMatchProfileComponent.propTypes = {
  resources: PropTypes.shape({ matchProfile: PropTypes.object }).isRequired,
  fullWidthContainer: PropTypes.instanceOf(Element),
  layerType: PropTypes.string,
};

export const EditMatchProfile = stripesConnect(EditMatchProfileComponent);
