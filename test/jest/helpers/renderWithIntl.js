import React from 'react';
import { render } from '@testing-library/react';

import { Intl } from '../__mock__/intl.mock';

export const renderWithIntl = children => {
  return render(<Intl>{children}</Intl>);
};
