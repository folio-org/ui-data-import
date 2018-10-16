import React from 'react';
import { Button, Pane, Paneset, PaneMenu } from '@folio/stripes/components';

export default class Application extends React.Component {
  addResultsFirstMenu() {
    const buttonRightStyle = {
      position: 'absolute',
      right: 0
    };

    return (
      <PaneMenu>
        <Button
          id="clickable-new-12"
          href="#"
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
          style={buttonRightStyle}
        >
                    Manage
        </Button>
      </PaneMenu>
    );
  }

  render() {
    const buttonRightStyle = {
      position: 'absolute',
      right: 0
    };

    return (
      <Paneset>
        <Pane defaultWidth="20" paneTitle="Jobs" firstMenu={this.addResultsFirstMenu()} />
        <Pane
          defaultWidth="fill"
          paneTitle={<div>Logs
            <Button
              style={buttonRightStyle}
              id="clickable-new-12"
              href="#"
              buttonStyle="primary paneHeaderNewButton"
              marginBottom0
            >View all
            </Button></div>}
        />
        <Pane defaultWidth="fill" paneTitle="Import" />
      </Paneset>
    );
  }
}
