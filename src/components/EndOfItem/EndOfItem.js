import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import {
  Layout,
  Icon,
} from '@folio/stripes/components';

import css from './EndOfItem.css';

export const EndOfItem = memo(({
  title = <FormattedMessage id="stripes-components.endOfList" />,
  className,
}) => (
  <Layout className={classnames('textCentered', css.endOfItem, className)}>
    <Icon icon="end-mark">{title}</Icon>
  </Layout>
));

EndOfItem.propTypes = {
  title: PropTypes.node,
  className: PropTypes.string,
};
