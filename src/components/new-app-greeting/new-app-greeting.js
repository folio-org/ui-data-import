import React from 'react';
import { FormattedMessage } from 'react-intl';

export default class NewAppGreeting extends React.Component {
  render() {
    return (
      <div>
        <h2 id="stripes-new-app-greeting"><FormattedMessage id="ui-data-import.new-app.greeting" /></h2>
        <FormattedMessage id="ui-data-import.new-app.message" />
      </div>
    );
  }
}
