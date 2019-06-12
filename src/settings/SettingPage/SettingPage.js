import React, {
  Fragment,
  useRef,
} from 'react';
import PropTypes from 'prop-types';

import { Callout } from '@folio/stripes/components';

import { getCRUDActions } from './getCRUDActions';

import sharedCss from '../../shared.css';

export const SettingPage = props => {
  const {
    finishedResourceName,
    children,
    mutator,
    location,
    history,
    match,
    onUpdateRecordError,
    onDeleteSuccess,
    onDeleteError,
  } = props;

  const fullWidthContainerRef = useRef();
  const calloutRef = useRef();

  const CRUDActions = getCRUDActions({
    finishedResourceName,
    mutator,
    location,
    history,
    match,
    onUpdateRecordError,
    onDeleteSuccess,
    onDeleteError,
  });

  return (
    <Fragment>
      {children({
        fullWidthContainer: fullWidthContainerRef.current,
        calloutRef: calloutRef.current,
        ...CRUDActions,
      })}
      <div
        className={sharedCss.fullWidthAndHeightContainer}
        ref={fullWidthContainerRef}
      />
      <Callout ref={calloutRef} />
    </Fragment>
  );
};

SettingPage.propTypes = {
  children: PropTypes.func.isRequired,
  finishedResourceName: PropTypes.string.isRequired,
  mutator: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
  onUpdateRecordError: PropTypes.func,
  onDeleteSuccess: PropTypes.func,
  onDeleteError: PropTypes.func,
};
