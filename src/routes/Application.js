import React from 'react';
import { Pane, Paneset, PaneMenu, IconButton } from '@folio/stripes-components';

import SearchPanel from '../components/SearchPanel';
import Report from '../components/Report/Report';

export default class Application extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterPaneIsVisible: true,
      recordDetailsPaneIsVisible: true,
    };
  }

  toggleFilterPane = () => {
    this.setState(prevState => ({ filterPaneIsVisible: !prevState.filterPaneIsVisible }));
  };

  toggleRecordDetailsPane = () => {
    this.setState(prevState => ({ recordDetailsPaneIsVisible: !prevState.recordDetailsPaneIsVisible }));
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

  addRecordDetailsMenu() {
    return (
      <PaneMenu>
        <IconButton
          onClick={this.toggleRecordDetailsPane}
          icon="closeX"
        />
      </PaneMenu>
    );
  }

  render() {
    const { filterPaneIsVisible, recordDetailsPaneIsVisible } = this.state;

    return (
      <Paneset>
        {filterPaneIsVisible &&
          <Pane defaultWidth="20" paneTitle="Search and Filter" firstMenu={this.addFirstMenu()}>
            <SearchPanel />
          </Pane>
        }
        <Pane defaultWidth="fill" paneTitle="Search Results" firstMenu={this.addResultsFirstMenu()}>
          <div>
            <button type="button" onClick={this.toggleRecordDetailsPane}>Pane Content</button>
          </div>
        </Pane>
        {recordDetailsPaneIsVisible &&
          <Pane defaultWidth="fill" paneTitle="Source Record 51/354" firstMenu={this.addRecordDetailsMenu()}>
            <Report />
          </Pane>
        }
      </Paneset>
    );
  }
}
