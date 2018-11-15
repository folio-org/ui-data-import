import React, {Component} from 'react';
import {IconButton} from '@folio/stripes/components';
import {FormattedMessage} from 'react-intl';

export default class FileStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toDelete: false
    };
  }

  deleteFile() {
    this.setState({toDelete: true});
  }

  render() {
    const {name} = this.props;
    const {toDelete} = this.state;

    const clickHandler = () => {
      if (this.state.toDelete) {
        this.setState({toDelete: false});
      }
      else {
        this.deleteFile();
      }
    };

    return (
      <div>
        {name} item
        {toDelete ? (
          <u onClick={clickHandler}><FormattedMessage id="ui-data-import.undo"/></u>
        ) : (
          <IconButton
            onClick={clickHandler}
            icon="closeX"
          />
        )}
      </div>
    );
  }
}
