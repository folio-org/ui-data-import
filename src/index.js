import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import Home from './routes/Home';
import Results from './routes/Results';
import JobProfile from './routes/JobProfile';
import Settings from './settings';

class DataImport extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    showSettings: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.connectedHome = props.stripes.connect(Home);
  }

  // wire up home page with stripes
  renderConnectedHome = () => {
    return <this.connectedHome {...this.props} />;
  };

  render() {
    if (this.props.showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Switch>
        <Route
          path={`${this.props.match.path}`}
          render={this.renderConnectedHome}
          exact
        />
        <Route
          path={`${this.props.match.path}/results`}
          component={Results}
          exact
        />
        <Route
          path={`${this.props.match.path}/job-profile`}
          component={JobProfile}
          exact
        />
      </Switch>
    );
  }
}

export default DataImport;
