import React from 'react';
import PropTypes from 'prop-types';

import { NoValue } from '@folio/stripes/components';

export const StaticValueNumber = ({ value }) => {
  return (
    <div data-test-static-number-field>
      {value || <NoValue />}
    </div>
  );
};

StaticValueNumber.propTypes = { value: PropTypes.string };

StaticValueNumber.defaultProps = { value: '' };
