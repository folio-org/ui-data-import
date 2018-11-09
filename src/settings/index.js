import React from 'react';
import {
  injectIntl,
  intlShape,
} from 'react-intl';

import { stripesShape } from '@folio/stripes/core';
import { Settings } from '@folio/stripes/smart-components';

import GeneralSettings from './general-settings';
import SomeFeatureSettings from './some-feature-settings';

class DataImportSettings extends React.Component {
  static propTypes = {
    stripes: stripesShape.isRequired,
    intl: intlShape.isRequired,
  };

  pages = [
    {
      route: 'general',
      label: this.props.intl.formatMessage({ id: 'ui-data-import.settings.general' }),
      component: GeneralSettings,
    },
    {
      route: 'somefeature',
      label: this.props.intl.formatMessage({ id: 'ui-data-import.settings.some-feature' }),
      component: SomeFeatureSettings,
    },
  ];

  render() {
    return (
      <Settings
        {...this.props}
        pages={this.pages}
        paneTitle={this.props.intl.formatMessage({ id: 'ui-data-import.settings.index.paneTitle' })}
      />
    );
  }
}

export default injectIntl(DataImportSettings);
