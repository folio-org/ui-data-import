/* istanbul ignore file */
import React, { Component } from 'react';

import {
  Button,
  Icon,
  Pane,
  Paneset,
  PaneMenu,
  PaneHeaderIconButton,
} from '@folio/stripes/components';

import {
  Report,
  ResultPanel,
  SearchPanel,
} from '../components';

export class Results extends Component {
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
        <PaneHeaderIconButton
          icon="times"
          onClick={this.toggleFilterPane}
        />
      </PaneMenu>
    );
  }

  addResultsFirstMenu() {
    return (
      <PaneMenu>
        <PaneHeaderIconButton
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
          href="#"
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          Export <Icon icon="caret-down" />
        </Button>
      </PaneMenu>
    );
  }

  addRecordDetailsMenu() {
    return (
      <PaneMenu>
        <PaneHeaderIconButton
          icon="times"
          onClick={this.toggleRecordDetailsPane}
        />
      </PaneMenu>
    );
  }

  render() {
    const {
      filterPaneIsVisible,
      recordDetailsPaneIsVisible,
    } = this.state;

    return (
      <Paneset>
        {filterPaneIsVisible &&
          <Pane
            defaultWidth="20"
            paneTitle="Search and Filter"
            firstMenu={this.addFirstMenu()}
          >
            <SearchPanel />
          </Pane>
        }
        <Pane
          defaultWidth="fill"
          paneTitle={<div>Search Results <Icon icon="caret-down" /></div>}
          paneSub="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur beatae blanditiis"
          firstMenu={this.addResultsFirstMenu()}
          lastMenu={this.addResultsLastMenu()}
        >
          <ResultPanel itemOnClick={this.toggleRecordDetailsPane} />
        </Pane>
        {recordDetailsPaneIsVisible &&
          <Pane
            defaultWidth="fill"
            paneTitle="Source Record 51/354"
            firstMenu={this.addRecordDetailsMenu()}
          >
            <Report />
          </Pane>
        }
      </Paneset>
    );
  }
}
