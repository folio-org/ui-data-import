import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Layer } from '@folio/stripes/components';

import { FileExtensionForm } from '../FileExtensionForm';

export const CreateFileExtension = ({
  fullWidthContainer,
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
      contentLabel={formatMessage({ id: 'settings.fileExtensions.form' })}
    >
      <FileExtensionForm
        {...routeProps}
        initialValues={initialValues}
      />
    </Layer>
  );
};

CreateFileExtension.propTypes = { fullWidthContainer: PropTypes.instanceOf(Element) };