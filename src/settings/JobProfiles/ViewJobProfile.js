import React, { Component } from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { FormattedMessage } from 'react-intl';
import { omit } from 'lodash';

import {
  Pane,
  Button,
  Icon,
  Layer,
  PaneMenu,
  Headline,
} from '@folio/stripes/components';

import { Preloader } from '../../components/Preloader';
import { JobProfilesForm } from '../../components/JobProfilesForm';

// TODO: view component will be developed in UIDATIMP-133
export class ViewJobProfile extends Component {
  static manifest = Object.freeze({
    jobProfile: {
      type: 'okapi',
      path: 'data-import-profiles/jobProfiles/:{id}',
      throwErrors: false,
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      jobProfile: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(
          PropTypes.shape({
            metadata: PropTypes.shape({
              createdByUserId: PropTypes.string.isRequired,
              updatedByUserId: PropTypes.string.isRequired,
            }).isRequired,
          }),
        ),
      }),
    }).isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }).isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    onOpenEdit: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onEditSuccess: PropTypes.func.isRequired,
    onCloseEdit: PropTypes.func.isRequired,
    editContainer: PropTypes.instanceOf(Element),
    editLink: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  get jopProfileData() {
    const {
      resources,
      match: { params },
    } = this.props;

    const jobProfile = resources.jobProfile || {};
    const records = jobProfile.records || [];

    return {
      hasLoaded: jobProfile.hasLoaded,
      record: records.find(record => record.id === params.id),
    };
  }

  renderSpinner() {
    const { onClose } = this.props;

    return (
      <Pane
        id="pane-job-profiles-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle=""
        dismissible
        lastMenu={this.renderDetailMenu()}
        onClose={onClose}
      >
        <Preloader />
      </Pane>
    );
  }

  renderActionMenu = menu => {
    return (
      <Button
        data-test-edit-job-profile-button
        buttonStyle="dropdownItem"
        onClick={() => this.handleOpenEdit(menu)}
      >
        <Icon icon="edit">
          <FormattedMessage id="ui-data-import.edit" />
        </Icon>
      </Button>
    );
  };

  renderLayer(record) {
    const {
      editContainer,
      onEdit,
      onCloseEdit,
      onEditSuccess,
    } = this.props;

    const isEditLayer = this.isLayerOpen('edit');

    if (isEditLayer) {
      return (
        <Layer
          isOpen={isEditLayer}
          container={editContainer}
        >
          <JobProfilesForm
            id="edit-job-profile-form"
            initialValues={this.getFormData(record)}
            onSubmit={onEdit}
            onSubmitSuccess={onEditSuccess}
            onCancel={onCloseEdit}
          />
        </Layer>
      );
    }

    return null;
  }

  handleOpenEdit = menu => {
    const { onOpenEdit } = this.props;

    onOpenEdit();
    menu.onToggle();
  };

  renderDetailMenu(record) {
    const {
      onOpenEdit,
      editLink,
    } = this.props;

    const editButtonVisibility = !record ? 'hidden' : 'visible';

    return (
      <PaneMenu>
        <Button
          data-test-edit-job-profile-menu-button
          href={editLink}
          style={{ visibility: editButtonVisibility }}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
          onClick={onOpenEdit}
        >
          <FormattedMessage id="ui-data-import.edit" />
        </Button>
      </PaneMenu>
    );
  }

  renderJobProfile(record) {
    const { onClose } = this.props;

    return (
      <Pane
        id="pane-job-profile-details"
        defaultWidth="fill"
        fluidContentWidth
        paneTitle={record.name}
        paneSub={<FormattedMessage id="ui-data-import.settings.jobProfile.title" />}
        actionMenu={this.renderActionMenu}
        lastMenu={this.renderDetailMenu(record)}
        dismissible
        onClose={onClose}
      >
        <Headline
          data-test-headline
          size="xx-large"
          tag="h2"
        >
          {record.name}
        </Headline>
      </Pane>
    );
  }

  getFormData(record) {
    return omit(record, 'userInfo', 'metadata');
  }

  isLayerOpen = value => {
    const { location: { search } } = this.props;

    const query = queryString.parse(search);

    return query.layer === value;
  };

  render() {
    const {
      hasLoaded,
      record,
    } = this.jopProfileData;

    if (!record || !hasLoaded) {
      return this.renderSpinner();
    }

    return this.renderLayer(record) || this.renderJobProfile(record);
  }
}
