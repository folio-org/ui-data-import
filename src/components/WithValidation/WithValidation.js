import {
  memo,
  useCallback,
} from 'react';

import { validateQuotedStringOrMarcPath } from '../../utils';

export const WithValidation = memo(({
  children,
  isRemoveValueAllowed = false,
}) => {
  const validation = useCallback(
    value => validateQuotedStringOrMarcPath(value, isRemoveValueAllowed),
    [isRemoveValueAllowed],
  );

  return children(validation);
});
