import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';

import {
  Layout,
  Icon,
} from '@folio/stripes/components';

import css from './EndOfItem.css';

export const EndOfItem = memo(props => (
  <Layout className={classnames('textCentered', css.endOfItem, props.className)}>
    <Icon icon="end-mark">{props.title}</Icon>
  </Layout>
));

EndOfItem.propTypes = {
  title: PropTypes.node,
  className: PropTypes.string,
};

EndOfItem.defaultProps = { title: <FormattedMessage id="stripes-components.endOfList" /> };
