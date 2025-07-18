import React, {
  Component,
  createRef,
} from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  injectIntl,
} from 'react-intl';
import { flow } from 'lodash';

import { Settings } from '@folio/stripes/smart-components';
import { InfoPopover } from '@folio/stripes/components';
import {
  stripesShape,
  TitleManager,
  withRoot,
  checkIfUserInCentralTenant,
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

class DataImportSettingsComponent extends Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    root: PropTypes.shape({ addReducer: PropTypes.func.isRequired }).isRequired,
    intl: PropTypes.object.isRequired,
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

  shouldHideDefaultCreateHoldingProfile = checkIfUserInCentralTenant(this.props.stripes);

  sections = [
    {
      label: this.renderProfilesLabel(),
      pages: [
        {
          route: 'job-profiles',
          label: generateSettingsLabel('jobProfiles.title', 'jobProfiles'),
          component: createJobProfiles(false, '', false, this.shouldHideDefaultCreateHoldingProfile),
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
      <TitleManager page={this.props.intl.formatMessage({ id: 'ui-data-import.settings.dataImport.title' })}>
        <Settings
          {...this.props}
          paneTitleRef={this.paneTitleRef}
          navPaneWidth="15%"
          sections={this.sections}
          paneTitle={generateSettingsLabel('index.paneTitle')}
        />
      </TitleManager>
    );
  }
}

export const DataImportSettings = flow([
  () => injectIntl(DataImportSettingsComponent),
  withRoot,
])();
