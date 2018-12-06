import classnames from 'classnames/bind';

import css from '../FileItem.css';

const config = () => {
  const cx = classnames.bind(css);
  const {
    fileItem,
    progress,
    progressWrapper,
    dateWrapper,
  } = css;

  return {
    classNames: {
      fileItem,
      progress,
      progressWrapper,
      dateWrapper,
      forDelete: cx('fileItem', 'fileItemForDelete'),
      undoBtn: cx('icon', 'undoIcon'),
      trashIcon: cx('icon', 'trashIcon'),
    },
  };
};

export default config();
