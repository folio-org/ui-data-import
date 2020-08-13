import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import { Headline } from '@folio/stripes-components';

export const MappedHeader = ({
  mappedLabelId,
  mappableLabelId,
  mappingTypeLabelId,
  headlineProps,
}) => {
  const { formatMessage } = useIntl();

  return (
    <Headline
      size="large"
      margin="none"
      {...headlineProps}
    >
      <span data-test-mapped-label={formatMessage({ id: mappedLabelId })}>
        <FormattedMessage id={mappedLabelId} />
      </span>
      <span>&nbsp;&middot;&nbsp;</span>
      <span data-test-mappable-label={formatMessage({ id: mappableLabelId })}>
        <FormattedMessage id={mappableLabelId} />
      </span>
      {mappingTypeLabelId && (
        <>
          <span>&nbsp;&middot;&nbsp;</span>
          <span data-test-mapping-type-label={formatMessage({ id: mappingTypeLabelId })}>
            <FormattedMessage id={mappingTypeLabelId} />
          </span>
        </>
      )}
    </Headline>
  );
};

MappedHeader.propTypes = {
  mappedLabelId: PropTypes.string.isRequired,
  mappableLabelId: PropTypes.string.isRequired,
  mappingTypeLabelId: PropTypes.string,
  headlineProps: PropTypes.object,
};

MappedHeader.defaultProps = { headlineProps: {} };
