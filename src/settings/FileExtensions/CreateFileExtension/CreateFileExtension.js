import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Layer } from '@folio/stripes/components';

import { FileExtensionForm } from '../FileExtensionForm';

export const CreateFileExtension = ({
  fullWidthContainer,
  layerType,
  ...routeProps
}) => {
  const { formatMessage } = useIntl();

  const initialValues = {
    importBlocked: false,
    description: '',
    extension: '',
    dataTypes: [],
  };

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

CreateFileExtension.propTypes = {
  fullWidthContainer: PropTypes.instanceOf(Element),
  layerType: PropTypes.string,
};
