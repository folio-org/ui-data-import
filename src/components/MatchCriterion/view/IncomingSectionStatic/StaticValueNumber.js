import React from 'react';

import { KeyValue } from '@folio/stripes/components';

export const StaticValueNumber = ({ value }) => {
  return (
    <div data-test-static-number-field>
      <KeyValue value={value} />
    </div>
  );
};
