import React from 'react';
import Settings from '@folio/stripes-smart-components/lib/Settings';
import { stripesShape } from '@folio/stripes-core/src/Stripes';

import GeneralSettings from './general-settings';
import SomeFeatureSettings from './some-feature-settings';

/*
  STRIPES-NEW-APP
  Your app's settings pages are defined here.
  The pages "general" and "some feature" are examples. Name them however you like.
*/

export default class DataImportSettings extends React.Component {
  static propTypes = {
    stripes: stripesShape.isRequired
  };

  pages = [
    {
      route: 'general',
      label: this.props.stripes.intl.formatMessage({
        id: 'ui-data-import.settings.general'
      }),
      component: GeneralSettings
    },
    {
      route: 'somefeature',
      label: this.props.stripes.intl.formatMessage({
        id: 'ui-data-import.settings.some-feature'
      }),
      component: SomeFeatureSettings
    }
  ];

  render() {
    return (
      <Settings
        {...this.props}
        pages={this.pages}
        paneTitle={this.props.stripes.intl.formatMessage({
          id: 'ui-data-import.settings.index.paneTitle'
        })}
      />
    );
  }
}
