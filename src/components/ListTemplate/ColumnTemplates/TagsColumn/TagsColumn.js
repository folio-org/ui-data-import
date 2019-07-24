import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
  get,
  isEmpty,
} from 'lodash';

import { Icon } from '@folio/stripes/components';

import { DefaultColumn } from '..';

import css from './TagsColumn.css';

export const TagsColumn = memo(({
  record,
  searchTerm,
}) => {
  const tags = get(record, 'tags.tagList', []);

  if (isEmpty(tags)) {
    return '-';
  }

  return (
    <span className={css.tags}>
      <Icon
        size="small"
        icon="tag"
        iconClassName={css.tagsIcon}
      />
      <DefaultColumn
        value={tags.join(', ')}
        searchTerm={searchTerm}
      />
    </span>
  );
});

TagsColumn.propTypes = {
  record: PropTypes.object.isRequired,
  searchTerm: PropTypes.string,
};
