import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { Icon } from '@folio/stripes-components';

import css from './RecordItem.css';

const recordTypes = {
  instance: {
    title: 'Instance',
  },
  bib: {
    title: 'Marc',
  },
  item: {
    title: 'Item',
  },
  holding: {
    title: 'Holding',
  },
  order: {
    title: 'Order',
  },
};

const RecordItem = ({ record }) => {
  return (
    <a href="/" className={css.resultRecordItemLink}>
      <div className={css.resultRecordItem}>
        <div className={css.resultRecordViewInfo}>
          <span
            className={classNames(
              css.resultRecordItemType,
              css[`resultRecordItemType--${record.type}`]
            )}
          />
          <span>
            {recordTypes[record.type].title} {record.id}
          </span>
        </div>
        <div className={css.resultRecordViewItem}>
          <span>View item</span>
          <Icon icon="up-caret" />
        </div>
      </div>
    </a>
  );
};

RecordItem.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }),
};

export default RecordItem;
