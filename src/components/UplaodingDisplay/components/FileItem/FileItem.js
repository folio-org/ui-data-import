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
      current,
      total,
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
          total={1320}
          current={570}
        />
      </div>
    );
  }
}

export default FileItem;
