import React from 'react';
import Pane from '@folio/stripes-components/lib/Pane';
import Paneset from '@folio/stripes-components/lib/Paneset';
import PaneMenu from '@folio/stripes-components/lib/PaneMenu';
import IconButton from '@folio/stripes-components/lib/IconButton';
import { Button, Icon } from '@folio/stripes-components';
import SearchPanel from '../components/search-panel';
import ResultPanel from '../components/ResultPanel';

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

  addResultsLastMenu() {
    return (
      <PaneMenu>
        <Button
          id="clickable-new-12"
          href="#"
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          Export <Icon icon="down-caret" />
        </Button>
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
        <Pane
          defaultWidth="fill"
          paneTitle={<div>Search Results <Icon icon="down-caret" /></div>}
          paneSub="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur beatae blanditiis"
          firstMenu={this.addResultsFirstMenu()}
          lastMenu={this.addResultsLastMenu()}
        >
          <ResultPanel />
        </Pane>
      </Paneset>
    );
  }
}
