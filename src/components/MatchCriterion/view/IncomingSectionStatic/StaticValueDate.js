import React from 'react';
import { FormattedDate } from 'react-intl';

import {
  Layout,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

export const StaticValueDate = ({ value }) => {
  return (
    <Layout
      data-test-static-exact-date-wrapper
      className="display-flex"
    >
      <KeyValue value={value ? <FormattedDate value={value} /> : <NoValue />} />
    </Layout>
  );
};
