import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import {
  Layout,
  Icon,
} from '@folio/stripes/components';

import css from './EndOfItem.css';

export const EndOfItem = props => (
  <Layout className={classnames('textCentered', css.endOfItem, props.className)}>
    <Icon icon="end-mark">
      {props.title}
    </Icon>
  </Layout>
);

EndOfItem.propTypes = {
  title: PropTypes.node,
  className: PropTypes.string,
};

EndOfItem.defaultProps = { title: <FormattedMessage id="stripes-components.endOfList" /> };
