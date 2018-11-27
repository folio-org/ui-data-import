import React from 'react';
import PropTypes from 'prop-types';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import Home from './routes/Home';
import Results from './routes/Results';
import Settings from './settings';

class DataImport extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      path: PropTypes.string.isRequired,
    }).isRequired,
    showSettings: PropTypes.bool.isRequired,
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
    const {
      showSettings,
      match: { path },
    } = this.props;

    if (showSettings) {
      return <Settings {...this.props} />;
    }

    return (
      <Switch>
        <Route
          path={`${path}`}
          exact
          render={this.renderConnectedHome}
        />
        <Route
          path={`${path}/results`}
          exact
          component={Results}
        />
      </Switch>
    );
  }
}

export default DataImport;
