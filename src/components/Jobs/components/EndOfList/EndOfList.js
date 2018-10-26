import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Layout,
  Icon,
} from '@folio/stripes/components';

const EndOfList = () => (
  <Layout className="textCentered">
    <Icon icon="end-mark">
      <FormattedMessage id="stripes-components.endOfList" />
    </Icon>
  </Layout>
);

export default EndOfList;
