import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Progress from '../../../Progress';
import css from './FileItem.css';

class FileItem extends PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    isUploaded: PropTypes.bool.isRequired,
    onRemove: PropTypes.func.isRequired,
  }

  render() {
    const {
      name,
      currentUploaded,
      size,
      isUploaded,
      onRemove,
    } = this.props;

    return (
      <div className={css.fileItem}>
        <span>{name}</span>
        <Progress
          message="Uploading"
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
