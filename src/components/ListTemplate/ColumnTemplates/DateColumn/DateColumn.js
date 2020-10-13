import React, { memo } from 'react';
import PropTypes from 'prop-types';

import {
  Icon,
  FormattedDate,
} from '@folio/stripes/components';

import css from './DateColumn.css';

export const DateColumn = memo(({ value }) => (
  <Icon
    icon="edit"
    size="small"
    iconClassName={css.editIcon}
  >
    <FormattedDate value={value} />
  </Icon>
));

DateColumn.propTypes = { value: PropTypes.string.isRequired };
