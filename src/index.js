import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import Application from './routes/Application';
import Settings from './settings';

class DataImport extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
  };

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Switch>
        <Route path={`${this.props.match.path}`} exact component={Application} />
      </Switch>
    );
  }
}

export default DataImport;
