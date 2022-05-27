import React, {
  Component,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import { InfoPopover } from '@folio/stripes/components';
import {
  stripesShape,
  withRoot,
} from '@folio/stripes/core';

import { createJobProfiles } from '../JobProfiles';
import { MatchProfiles } from '../MatchProfiles';
import { ActionProfiles } from '../ActionProfiles';
import { MappingProfiles } from '../MappingProfiles';
import { FileExtensions } from '../FileExtensions';
import { MARCFieldProtection } from '../MARCFieldProtection';
import { reducer } from '../../redux';
import {
  generateSettingsLabel,
  STATE_MANAGEMENT,
} from '../../utils';

import css from './DataImportSettings.css';

@withRoot
export class DataImportSettings extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    root: PropTypes.shape({
      addReducer: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    props.root.addReducer(STATE_MANAGEMENT.REDUCER, reducer);
  }

  componentDidMount() {
    if (this.paneTitleRef.current) {
      this.paneTitleRef.current.focus();
    }
  }

  sections = [
    {
      label: this.renderProfilesLabel(),
      pages: [
        {
          route: 'job-profiles',
          label: generateSettingsLabel('jobProfiles.title', 'jobProfiles'),
          component: createJobProfiles(),
        },
        {
          route: 'match-profiles',
          label: generateSettingsLabel('matchProfiles.title', 'matchProfiles'),
          component: MatchProfiles,
        },
        {
          route: 'action-profiles',
          label: generateSettingsLabel('actionProfiles.title', 'actionProfiles'),
          component: ActionProfiles,
        },
        {
          route: 'mapping-profiles',
          label: generateSettingsLabel('mappingProfiles.title', 'mappingProfiles'),
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
        {
          route: 'marc-field-protection',
          label: <FormattedMessage id="ui-data-import.settings.marcFieldProtection.title" />,
          component: MARCFieldProtection,
        },
      ],
    },
  ];

  paneTitleRef = createRef();

  renderProfilesLabel() {
    const profilesLink = 'https://wiki.folio.org/display/FOLIOtips/2-Creating+and+using+profiles';

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

  render() {
    return (
      <Settings
        {...this.props}
        paneTitleRef={this.paneTitleRef}
        navPaneWidth="15%"
        sections={this.sections}
        paneTitle={generateSettingsLabel('index.paneTitle')}
      />
    );
  }
}
