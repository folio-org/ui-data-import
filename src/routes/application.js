import React from 'react';
import PropTypes from 'prop-types';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IconButton from '@folio/stripes-components/lib/IconButton';
import SearchPanel from '../components/search-panel';


export default class Application extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  };

  addFirstMenu() {
    return (
      <PaneMenu>
        <IconButton
          id="clickable-close-permission-set"
          onClick={() => {}}
          icon="closeX"
          aria-label="123"
        />
      </PaneMenu>
    );
  }

  render() {
    return (
      <Paneset>
        <Pane defaultWidth="20%" paneTitle="Filters">
          Pane Content
        </Pane>
        <Pane defaultWidth="20" paneTitle="Search and Filter" firstMenu={this.addFirstMenu()}>
          <SearchPanel />
        </Pane>
        <Pane defaultWidth="fill" paneTitle="Search Results">
          Pane Content
        </Pane>
      </Paneset>
    );
  }
}
