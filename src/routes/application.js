import React from 'react';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IconButton from '@folio/stripes-components/lib/IconButton';
import SearchPanel from '../components/search-panel';

export default class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = { filterPaneIsVisible: true };
  }

  toggleFilterPane = () => {
    this.setState(prevState => ({ filterPaneIsVisible: !prevState.filterPaneIsVisible }));
  };

  addFirstMenu() {
    return (
      <PaneMenu>
        <IconButton
          onClick={this.toggleFilterPane}
          icon="closeX"
        />
      </PaneMenu>
    );
  }

  addResultsFirstMenu() {
    return (
      <PaneMenu>
        <IconButton
          icon="search"
          onClick={this.toggleFilterPane}
        />
      </PaneMenu>
    );
  }

  render() {
    const { filterPaneIsVisible } = this.state;

    return (
      <Paneset>
        {/* Filter Pane */}
        {filterPaneIsVisible &&
          <Pane defaultWidth="20" paneTitle="Search and Filter" firstMenu={this.addFirstMenu()}>
            <SearchPanel />
          </Pane>
        }
        <Pane defaultWidth="fill" paneTitle="Search Results" firstMenu={this.addResultsFirstMenu()}>
          Pane Content
        </Pane>
      </Paneset>
    );
  }
}
