import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate } from 'react-intl';

import {
  Layout,
  NoValue,
} from '@folio/stripes/components';

export const StaticValueDate = ({ value }) => {
  return (
    <Layout
      data-test-static-exact-date-wrapper
      className="display-flex"
    >
      {value ? <FormattedDate value={value} /> : <NoValue />}
    </Layout>
  );
};

StaticValueDate.propTypes = { value: PropTypes.string };

StaticValueDate.defaultProps = { value: null };
