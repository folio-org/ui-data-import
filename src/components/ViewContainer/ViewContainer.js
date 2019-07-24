import React, {
  Fragment,
  memo,
  useState,
  useRef,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { Callout } from '@folio/stripes/components';
import { buildUrl } from '@folio/stripes/smart-components';

import { getCRUDActions } from './getCRUDActions';
import {
  ExceptionModal,
  networkMessage,
} from '../index';

import sharedCss from '../../shared.css';

export const ViewContainer = memo(({
  entityKey,
  children,
  mutator,
  location,
  history,
  match: { path },
  selectedRecords,
  selectRecord = noop,
}) => {
  const fullWidthContainerRef = useRef();
  const calloutRef = useRef();

  const [showExceptionModal, setShowExceptionModal] = useState(false);

  const CRUDActions = getCRUDActions({
    entityKey,
    mutator,
    onSuccess: networkMessage('success', entityKey, calloutRef),
    onError: networkMessage('error', entityKey, calloutRef),
  });

  const transitionToParams = params => {
    history.push(buildUrl(location, params));
  };

  const handleUpdateSuccess = (record, dispatch, properties) => {
    const { reset: resetForm } = properties;

    resetForm();
    transitionToParams({
      _path: `${path}/view/${record.id}`,
      layer: null,
    });
  };

  const deselectOnDelete = recordId => {
    const isRecordSelected = selectedRecords.has(recordId);

    if (isRecordSelected) {
      selectRecord(recordId);
    }
  };

  const handleDeleteSuccess = record => {
    transitionToParams({
      _path: `${path}/view`,
      layer: null,
    });
    deselectOnDelete(record.id);
  };

  const handleDeleteError = (record, error) => {
    if (error.status === 409) {
      setShowExceptionModal(true);
    }
  };

  return (
    <Fragment>
      {children({
        fullWidthContainer: fullWidthContainerRef.current,
        calloutRef: calloutRef.current,
        handleCreateSuccess: handleUpdateSuccess,
        handleEditSuccess: handleUpdateSuccess,
        handleDeleteSuccess,
        handleDeleteError,
        ...CRUDActions,
      })}
      <div
        className={sharedCss.fullWidthAndHeightContainer}
        ref={fullWidthContainerRef}
      />
      <ExceptionModal
        id={`delete-${entityKey}-exception-modal`}
        label={<FormattedMessage id={`ui-data-import.settings.${entityKey}.exceptionModal.label`} />}
        message={<FormattedMessage id={`ui-data-import.settings.${entityKey}.exceptionModal.message`} />}
        showExceptionModal={showExceptionModal}
        onClose={() => setShowExceptionModal(false)}
      />
      <Callout ref={calloutRef} />
    </Fragment>
  );
});

ViewContainer.propTypes = {
  entityKey: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  match: PropTypes.shape({ path: PropTypes.string.isRequired }).isRequired,
  selectRecord: PropTypes.func,
  selectedRecords: PropTypes.instanceOf(Set),
};
