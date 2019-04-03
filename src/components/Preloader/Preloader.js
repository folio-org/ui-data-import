import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import { Icon } from '@folio/stripes/components';

import css from './Preloader.css';

export const Preloader = memo(props => {
  const {
    preloaderClassName,
    message,
  } = props;

  return (
    <div className={classNames(css.preloader, preloaderClassName)}>
      {message}
      <Icon
        icon="spinner-ellipsis"
        size="small"
        iconClassName={css.spinner}
      />
    </div>
  );
});

Preloader.propTypes = {
  preloaderClassName: PropTypes.string,
  message: PropTypes.node,
};

Preloader.defaultProps = {
  message: <FormattedMessage id="ui-data-import.loading" />,
};
