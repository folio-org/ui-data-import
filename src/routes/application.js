import React from 'react';
import PropTypes from 'prop-types';
import Link from 'react-router-dom/Link';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import NewAppGreeting from '../components/new-app-greeting';


export default class Application extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  render() {
    return (
      <Paneset>
        <Pane defaultWidth="fill" fluidContentWidth paneTitle="Batch Bot">
          <NewAppGreeting />
          <br />
          <ul>
            <li>View the <Link to={`${this.props.match.path}/examples`}>examples page</Link> to see some useful components.</li>
            <li>Please refer to the <a href="https://github.com/folio-org/stripes-core/blob/master/doc/dev-guide.md">Stripes Module Developer‘s Guide</a> for more information.</li>
          </ul>
        </Pane>
      </Paneset>
    );
  }
}
