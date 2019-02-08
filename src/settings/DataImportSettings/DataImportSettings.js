import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import {
  AppIcon,
  InfoPopover,
} from '@folio/stripes/components';
import { stripesShape } from '@folio/stripes/core';

import JobProfiles from '../JobProfiles';
import MatchProfiles from '../MatchProfiles';
import ActionProfiles from '../ActionProfiles';
import FieldMappingProfiles from '../FieldMappingProfiles';
import FileExtensions from '../FileExtensions';

import css from './DataImportSettings.css';

class DataImportSettings extends Component {
  static propTypes = { stripes: stripesShape.isRequired };

  constructor(props) {
    super(props);

    const { stripes } = this.props;

    const connectedFileExtensions = stripes.connect(FileExtensions);

    this.sections = [
      {
        label: this.renderProfilesLabel(),
        pages: [
          {
            route: 'job-profiles',
            label: this.generateSettingsLabel('jobProfiles', 'jobProfiles'),
            component: JobProfiles,
          },
          {
            route: 'match-profiles',
            label: this.generateSettingsLabel('matchProfiles', 'matchProfiles'),
            component: MatchProfiles,
          },
          {
            route: 'action-profiles',
            label: this.generateSettingsLabel('actionProfiles', 'actionProfiles'),
            component: ActionProfiles,
          },
          {
            route: 'mapping-profiles',
            label: this.generateSettingsLabel('fieldMappingProfiles', 'fieldMapping'),
            component: FieldMappingProfiles,
          },
        ],
      },
      {
        label: <FormattedMessage id="ui-data-import.settings.other" />,
        pages: [
          {
            route: 'file-extensions',
            label: <FormattedMessage id="ui-data-import.settings.fileExtensions.title" />,
            component: connectedFileExtensions,
          },
        ],
      },
    ];
  }

  renderProfilesLabel() {
    const profilesLink = 'https://wiki.folio.org/display/FOLIOtips/Creating+and+using+profiles';

    return (
      <div className={css.profilesLabel}>
        <FormattedMessage id="ui-data-import.settings.profiles" />
        <InfoPopover
          allowAnchorClick
          hideOnButtonClick
          buttonHref={profilesLink}
          buttonLabel={<FormattedMessage id="ui-data-import.settings.learnMore" />}
          content={<FormattedMessage id="ui-data-import.settings.profilesInfo" />}
          contentClass={css.profilesPopoverContent}
          iconSize="medium"
        />
      </div>
    );
  }

  generateSettingsLabel(labelId, iconKey) {
    return (
      <AppIcon
        size="small"
        app="data-import"
        iconKey={iconKey}
      >
        <FormattedMessage id={`ui-data-import.settings.${labelId}`} />
      </AppIcon>
    );
  }

  render() {
    return (
      <Settings
        {...this.props}
        sections={this.sections}
        paneTitle={this.generateSettingsLabel('index.paneTitle')}
      />
    );
  }
}

export default DataImportSettings;
