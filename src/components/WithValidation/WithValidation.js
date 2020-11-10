import {
  memo,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';

import { validateQuotedStringOrMarcPath } from '../../utils';

export const WithValidation = memo(({
  children,
  isRemoveValueAllowed,
}) => {
  const validation = useCallback(
    value => validateQuotedStringOrMarcPath(value, isRemoveValueAllowed),
    [isRemoveValueAllowed],
  );

  return children(validation);
});

WithValidation.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  isRemoveValueAllowed: PropTypes.bool,
};

WithValidation.defaultProps = { isRemoveValueAllowed: false };
