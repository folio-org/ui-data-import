import {
  memo,
  useCallback,
} from 'react';

import { validateQuotedStringOrMarcPath } from '../../utils';

export const WithValidation = memo(({
  children,
  isRemoveValueAllowed = false,
  isSubfieldRequired = false,
}) => {
  const validation = useCallback(
    value => validateQuotedStringOrMarcPath(value, isRemoveValueAllowed, isSubfieldRequired),
    [isRemoveValueAllowed, isSubfieldRequired],
  );

  return children(validation);
});
