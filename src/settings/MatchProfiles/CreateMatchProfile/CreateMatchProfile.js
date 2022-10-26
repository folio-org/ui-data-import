import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Layer } from '@folio/stripes/components';

import { MatchProfilesForm } from '../MatchProfilesForm';
import { getSectionInitialValues } from '../MatchProfiles';

export const CreateMatchProfile = ({
  fullWidthContainer,
  ...routeProps
}) => {
  const { formatMessage } = useIntl();

  const initialValues = {
    name: '',
    description: '',
    /* TODO: these values are hardcoded now and will need to be changed in future (https://issues.folio.org/browse/UIDATIMP-175) */
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    matchDetails: [{
      incomingRecordType: 'MARC_BIBLIOGRAPHIC',
      incomingMatchExpression: getSectionInitialValues('MARC_BIBLIOGRAPHIC'),
      existingRecordType: 'INSTANCE',
      existingMatchExpression: getSectionInitialValues('INSTANCE'),
      matchCriterion: 'EXACTLY_MATCHES',
    }],
  };

  return (
    <Layer
      isOpen
      container={fullWidthContainer}
      contentLabel={formatMessage({ id: 'settings.matchProfiles.form' })}
    >
      <MatchProfilesForm
        {...routeProps}
        initialValues={initialValues}
      />
    </Layer>
  );
};

CreateMatchProfile.propTypes = { fullWidthContainer: PropTypes.instanceOf(Element) };
