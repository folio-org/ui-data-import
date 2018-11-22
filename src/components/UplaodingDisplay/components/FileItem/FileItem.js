import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Progress from '../../../Progress';

import css from './FileItem.css';

class FileItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    currentUploaded: PropTypes.number,
  };

  static defaultProps = {
    currentUploaded: 0,
  };

  render() {
    const {
      name,
      currentUploaded,
      size,
    } = this.props;

    const payload = {
      message: <FormattedMessage id="ui-data-import.uploadingMessage" />,
    };

    return (
      <div className={css.fileItem}>
        <span>{name}</span>
        <Progress
          payload={payload}
          progressInfoType="messagedPercentage"
          progressClassName={css.progress}
          progressWrapperClassName={css.progressWrapper}
          progressInfoClassName={css.progressInfo}
          total={size}
          current={currentUploaded}
        />
      </div>
    );
  }
}

export default FileItem;
