import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import Progress from '../../../Progress';

import css from './FileItem.css';

class FileItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    uploadedValue: PropTypes.number,
  };

  static defaultProps = {
    uploadedValue: 0,
  };

  progressPayload = {
    message: <FormattedMessage id="ui-data-import.uploadingMessage" />,
  };

  render() {
    const {
      name,
      uploadedValue,
      size,
    } = this.props;

    return (
      <div className={css.fileItem}>
        <span>{name}</span>
        <Progress
          payload={this.progressPayload}
          progressInfoType="messagedPercentage"
          progressClassName={css.progress}
          progressWrapperClassName={css.progressWrapper}
          progressInfoClassName={css.progressInfo}
          total={size}
          current={uploadedValue}
        />
      </div>
    );
  }
}

export default FileItem;
