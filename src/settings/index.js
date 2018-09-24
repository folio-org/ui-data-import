import React from 'react';
import Settings from '@folio/stripes-components/lib/Settings';
import GeneralSettings from './general-settings';
import SomeFeatureSettings from './some-feature-settings';

/*
  STRIPES-NEW-APP
  Your app's settings pages are defined here.
  The pages "general" and "some feature" are examples. Name them however you like.
*/

export default class CataloadSettings extends React.Component {
  pages = [
    {
      route: 'general',
      label: this.props.stripes.intl.formatMessage({ id: 'ui-cataload.settings.general' }),
      component: GeneralSettings,
    },
    {
      route: 'somefeature',
      label: this.props.stripes.intl.formatMessage({ id: 'ui-cataload.settings.some-feature' }),
      component: SomeFeatureSettings,
    },
  ];

  render() {
    return (
      <Settings {...this.props} pages={this.pages} paneTitle="ui-cataload" />
    );
  }
}
