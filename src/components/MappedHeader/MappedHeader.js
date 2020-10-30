import React from 'react';
import PropTypes from 'prop-types';

import { Headline } from '@folio/stripes-components';

import { WithTranslation } from '..';

export const MappedHeader = ({
  headersToSeparate,
  headlineProps,
}) => {
  const headers = headersToSeparate.filter(header => !!header);

  return (
    <Headline
      size="large"
      margin="none"
      {...headlineProps}
    >
      {headers.map((header, i) => {
        const needSeparator = i < headers.length - 1;

        return (
          <WithTranslation wrapperLabel={header}>
            {label => (
              <>
                {label}
                {needSeparator && <>&nbsp;&middot;&nbsp;</>}
              </>
            )}
          </WithTranslation>
        );
      })}
    </Headline>
  );
};

MappedHeader.propTypes = {
  headersToSeparate: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.node])).isRequired,
  headlineProps: PropTypes.object,
};

MappedHeader.defaultProps = { headlineProps: {} };
