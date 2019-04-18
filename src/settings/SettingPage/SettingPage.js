import React, {
  Fragment,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Callout } from '@folio/stripes/components';
import { buildUrl } from '@folio/stripes/smart-components';

import { getXHRErrorMessage } from '../../utils';

import sharedCss from '../../shared.css';

export const SettingPage = props => {
  const {
    children,
    finishedResourceName,
    parentMutator: { [finishedResourceName]: resourceMutator },
    location,
    history,
    match: { path },
    getDeleteRecordSuccessfulMessage,
    getDeleteRecordErrorMessage,
    getRecordName,
  } = props;

  const fullWidthContainerRef = useRef();
  const calloutRef = useRef();

  const transitionToParams = params => {
    const url = buildUrl(location, params);

    history.push(url);
  };

  const showUpdateRecordErrorMessage = async (response, record) => {
    const errorMsgIdEnding = await getXHRErrorMessage(response);
    let errorMessage;

    if (errorMsgIdEnding) {
      errorMessage = (
        <FormattedMessage
          id="ui-data-import.settings.save.error.network"
          values={{
            description: (
              <FormattedMessage
                id={`ui-data-import.validation.${errorMsgIdEnding}`}
                values={{ value: <strong>{getRecordName(record)}</strong> }}
              />
            ),
          }}
        />
      );
    } else {
      errorMessage = (
        <FormattedMessage
          id="ui-data-import.settings.save.error.network"
          values={{ description: <FormattedMessage id="ui-data-import.communicationProblem" /> }}
        />
      );
    }

    calloutRef.current.sendCallout({
      type: 'error',
      message: errorMessage,
    });
  };

  const createRecord = async record => resourceMutator.POST(record)
    .catch(error => {
      showUpdateRecordErrorMessage(error, record);

      throw error;
    });

  const editRecord = record => resourceMutator.PUT(record)
    .catch(error => {
      showUpdateRecordErrorMessage(error, record);

      throw error;
    });

  const showDeleteRecordSuccessfulMessage = record => {
    const message = getDeleteRecordSuccessfulMessage(record);

    calloutRef.current.sendCallout({ message });
  };

  const showDeleteRecordErrorMessage = record => {
    const message = getDeleteRecordErrorMessage(record);

    calloutRef.current.sendCallout({
      type: 'error',
      message,
    });
  };

  const deleteRecord = async record => {
    try {
      await resourceMutator.DELETE(record);

      transitionToParams({
        _path: `${path}/view`,
        layer: null,
      });
      showDeleteRecordSuccessfulMessage(record);

      return true;
    } catch (error) {
      showDeleteRecordErrorMessage(record);

      return false;
    }
  };

  const handleUpdateRecordSuccess = (record, dispatch, properties) => {
    const { reset: resetForm } = properties;

    resetForm();

    transitionToParams({
      _path: `${path}/view/${record.id}`,
      layer: null,
    });
  };

  const childrenProps = {
    finishedResourceName,
    fullWidthContainer: fullWidthContainerRef.current,
    onCreate: createRecord,
    onEdit: editRecord,
    onDelete: deleteRecord,
    handleCreateSuccess: handleUpdateRecordSuccess,
    handleEditSuccess: handleUpdateRecordSuccess,
  };

  return (
    <Fragment>
      {children(childrenProps)}
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
  parentMutator: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string.isRequired,
  }).isRequired,
  getDeleteRecordSuccessfulMessage: PropTypes.func.isRequired,
  getDeleteRecordErrorMessage: PropTypes.func.isRequired,
  getRecordName: PropTypes.func.isRequired,
};
