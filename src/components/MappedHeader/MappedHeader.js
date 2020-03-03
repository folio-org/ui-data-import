import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Headline } from '@folio/stripes-components';

export const MappedHeader = ({
  mappedLabelId,
  mappableLabelId,
  mappedLabel,
  mappableLabel,
  headlineProps,
}) => (
  <Headline
    size="large"
    margin="none"
    {...headlineProps}
  >
    <span data-test-mapped-label={mappedLabel}>
      <FormattedMessage id={mappedLabelId} />
    </span>
    <span>&nbsp;&middot;&nbsp;</span>
    <span data-test-mappable-label={mappableLabel}>
      <FormattedMessage id={mappableLabelId} />
    </span>
  </Headline>
);

MappedHeader.propTypes = {
  mappedLabelId: PropTypes.string.isRequired,
  mappableLabelId: PropTypes.string.isRequired,
  mappedLabel: PropTypes.string,
  mappableLabel: PropTypes.string,
  headlineProps: PropTypes.object,
};

MappedHeader.defaultProps = {
  mappedLabel: '',
  mappableLabel: '',
  headlineProps: {}
};
