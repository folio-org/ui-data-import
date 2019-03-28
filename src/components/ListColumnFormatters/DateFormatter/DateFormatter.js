import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';

import { Icon } from '@folio/stripes/components';

import css from './DateFormatter.css';

export const DateFormatter = memo(props => (
  <Icon
    icon="edit"
    size="small"
    iconClassName={css.editIcon}
  >
    <FormattedDate value={props.value} />
  </Icon>
));

DateFormatter.propTypes = { value: PropTypes.string.isRequired };
