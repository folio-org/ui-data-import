import React, { memo } from 'react';
import PropTypes from 'prop-types';
import HighLight from 'react-highlighter';
import {
  get,
  isEmpty,
} from 'lodash';

import { Icon } from '@folio/stripes/components';

import css from './TagsColumn.css';
import sharedCss from '../../../../shared.css';

export const TagsColumn = memo(props => {
  const {
    record,
    searchTerm,
  } = props;
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
      <HighLight
        search={searchTerm}
        className={sharedCss.container}
      >
        {tags.join(', ')}
      </HighLight>
    </span>
  );
});

TagsColumn.propTypes = {
  record: PropTypes.shape.isRequired,
  searchTerm: PropTypes.string.isRequired,
};
