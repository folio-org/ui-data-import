import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import {
  Layout,
  Icon,
} from '@folio/stripes/components';

import css from './EndOfList.css';

export const EndOfList = () => (
  <Layout className={classnames('textCentered', css.endOfList)}>
    <Icon icon="end-mark">
      <FormattedMessage id="stripes-components.endOfList" />
    </Icon>
  </Layout>
);
