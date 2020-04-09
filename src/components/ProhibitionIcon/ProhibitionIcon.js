import React from 'react';
import { FormattedMessage } from 'react-intl';

import css from './ProhibitionIcon.css';

export const ProhibitionIcon = () => (
  <FormattedMessage id="ui-data-import.noValueAllowed">
    {ariaLabel => (
      <span
        /* eslint-disable-next-line jsx-a11y/aria-role */
        role="text"
        aria-label={ariaLabel}
        className={css.noValueAllowed}
        data-test-no-value-allowed
      >
        &#8416;
      </span>
    )}
  </FormattedMessage>
);
