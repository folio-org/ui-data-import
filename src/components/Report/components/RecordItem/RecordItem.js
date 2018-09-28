import React from 'react';
import PropTypes from 'prop-types';

import {
  Icon,
} from '@folio/stripes-components';

import css from './RecordItem.css';

const recordTypes = {
  instance: {
    title: 'Instance',
  },
  bib: {
    title: 'Marc',
  },
  item: {
    title: 'Item'
  },
  holding: {
    title: 'Holding'
  },
  order: {
    title: 'Order'
  },
};

class RecordItem extends React.Component {
  static propTypes = {
    record: PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    }),
  };

  render() {
    const { record } = this.props;

    return (
      <a href="/" className={css.resultRecordItemLink}>
        <div className={css.resultRecordItem}>
          <div className={css.resultRecordViewInfo}>
            <span className={css.resultRecordItemType} />
            <span>{recordTypes[record.type].title}</span> <span>{record.id}</span>
          </div>
          <div className={css.resultRecordViewItem}>
            <span>View item</span>
            <Icon icon="up-caret" />
          </div>
        </div>
      </a>
    );
  }
}

export default RecordItem;
