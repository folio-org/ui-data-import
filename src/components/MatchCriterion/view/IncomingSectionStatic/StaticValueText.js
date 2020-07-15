import React from 'react';
import PropTypes from 'prop-types';

import { NoValue } from '@folio/stripes/components';

export const StaticValueText = ({ value }) => {
  return (
    <div data-test-static-text-field>
      {value || <NoValue />}
    </div>
  );
};

StaticValueText.propTypes = { value: PropTypes.string };

StaticValueText.defaultProps = { value: null };
