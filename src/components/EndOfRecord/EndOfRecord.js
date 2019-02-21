import React from 'react';
import { FormattedMessage } from 'react-intl';
import classnames from 'classnames';

import {
  Layout,
  Icon,
} from '@folio/stripes/components';

import css from './EndOfRecord.css';

export const EndOfRecord = () => (
  <Layout className={classnames(css.endOfRecord)}>
    <Icon icon="end-mark">
      <FormattedMessage id="ui-data-import.settings.fileExtension.endOfRecord"/>
    </Icon>
  </Layout>
);
