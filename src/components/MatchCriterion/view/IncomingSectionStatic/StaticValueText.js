import React from 'react';

import {
  KeyValue,
  NoValue,
} from '@folio/stripes/components';

export const StaticValueText = ({ value }) => {
  return (
    <div data-test-static-text-field>
      <KeyValue value={value || <NoValue />} />
    </div>
  );
};
