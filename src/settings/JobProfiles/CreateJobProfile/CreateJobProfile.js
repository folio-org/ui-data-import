import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Layer } from '@folio/stripes/components';

import { JobProfilesForm } from '../JobProfilesForm';

export const CreateJobProfile = ({
  fullWidthContainer,
  ...routeProps
}) => {
  const { formatMessage } = useIntl();

  const initialValues = {
    name: '',
    description: '',
    dataType: '',
  };

  return (
    <Layer
      isOpen
      container={fullWidthContainer}
      contentLabel={formatMessage({ id: 'ui-data-import.settings.jobProfiles.form' })}
    >
      <JobProfilesForm
        {...routeProps}
        initialValues={initialValues}
      />
    </Layer>
  );
};

CreateJobProfile.propTypes = { fullWidthContainer: PropTypes.instanceOf(Element) };
