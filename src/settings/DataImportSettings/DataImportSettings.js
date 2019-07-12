import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import { InfoPopover } from '@folio/stripes/components';
import {
  AppIcon,
  stripesShape,
} from '@folio/stripes/core';

import { JobProfiles } from '../JobProfiles';
import { MatchProfiles } from '../MatchProfiles';
import { ActionProfiles } from '../ActionProfiles';
import { MappingProfiles } from '../MappingProfiles';
import { FileExtensions } from '../FileExtensions';

import css from './DataImportSettings.css';

export class DataImportSettings extends Component {
  static propTypes = { stripes: stripesShape.isRequired };

  sections = [
    {
      label: this.renderProfilesLabel(),
      pages: [
        {
          route: 'job-profiles',
          label: this.generateSettingsLabel('jobProfiles.title', 'jobProfiles'),
          component: JobProfiles,
        },
        {
          route: 'match-profiles',
          label: this.generateSettingsLabel('matchProfiles.title', 'matchProfiles'),
          component: MatchProfiles,
        },
        {
          route: 'action-profiles',
          label: this.generateSettingsLabel('actionProfiles.title', 'actionProfiles'),
          component: ActionProfiles,
        },
        {
          route: 'mapping-profiles',
          label: this.generateSettingsLabel('mappingProfiles.title', 'mappingProfiles'),
          component: MappingProfiles,
        },
      ],
    },
    {
      label: <FormattedMessage id="ui-data-import.settings.other" />,
      pages: [
        {
          route: 'file-extensions',
          label: <FormattedMessage id="ui-data-import.settings.fileExtensions.title" />,
          component: FileExtensions,
        },
      ],
    },
  ];

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
        navPaneWidth="15%"
        sections={this.sections}
        paneTitle={this.generateSettingsLabel('index.paneTitle')}
      />
    );
  }
}
