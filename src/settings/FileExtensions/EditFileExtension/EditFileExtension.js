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

import { FileExtensionForm } from '../FileExtensionForm';

import { LAYER_TYPES } from '../../../utils';

const EditFileExtensionComponent = ({
  resources: { fileExtension },
  fullWidthContainer,
  layerType,
  ...routeProps
}) => {
  const { formatMessage } = useIntl();

  const fileExtensionRecord = get(fileExtension, 'records.0');

  if (!fileExtensionRecord) {
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
  const initialValues = !isDuplicateMode ? fileExtensionRecord : omit(fileExtensionRecord, ['id', 'parentProfiles', 'childProfiles']);

  return (
    <Layer
      isOpen
      container={fullWidthContainer}
      contentLabel={formatMessage({ id: 'ui-data-import.settings.fileExtensions.form' })}
    >
      <FileExtensionForm
        {...routeProps}
        initialValues={initialValues}
        layerType={layerType}
      />
    </Layer>
  );
};

EditFileExtensionComponent.manifest = Object.freeze({
  fileExtension: {
    type: 'okapi',
    path: 'data-import/fileExtensions/:{id}',
    PUT: { throwErrors: false },
  },
});

EditFileExtensionComponent.propTypes = {
  resources: PropTypes.shape({ fileExtension: PropTypes.object }).isRequired,
  fullWidthContainer: PropTypes.instanceOf(Element),
  layerType: PropTypes.string,
};

export const EditFileExtension = stripesConnect(EditFileExtensionComponent);
