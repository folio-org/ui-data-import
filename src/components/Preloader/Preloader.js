import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Icon } from '@folio/stripes/components';

import css from './Preloader.css';

export const Preloader = ({ message }) => (
  <div className={css.preloader}>
    {message}
    <Icon
      icon="spinner-ellipsis"
      size="small"
    />
  </div>
);

Preloader.propTypes = {
  message: PropTypes.node,
};

Preloader.defaultProps = {
  message: <FormattedMessage id="ui-data-import.loading" />,
};
