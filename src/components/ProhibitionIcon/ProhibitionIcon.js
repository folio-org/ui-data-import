import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import css from './ProhibitionIcon.css';

/**
 * Component for rendering the circle backslash character with given message as an aria-label
 *
 * @param {string} [ariaLabel] - A label or a translation id for the aria-label attribute
 * @returns {{}}
 */
export const ProhibitionIcon = ({ ariaLabel }) => {
  const ariaLabelIsTranslationId = ariaLabel && ariaLabel.includes('ui-');
  const ariaLabelIsMessageString = ariaLabel && !ariaLabel.includes('ui-');
  const translationId = ariaLabelIsTranslationId ? ariaLabel : 'ui-data-import.noValueAllowed';

  const getIcon = message => (
    <span
      data-test-no-value-allowed
      aria-label={message}
      className={css.noValueAllowed}
    >
      &#8416;
    </span>
  );

  const renderIcon = () => {
    if (ariaLabelIsMessageString) {
      return getIcon(ariaLabel);
    }

    return (
      <FormattedMessage id={translationId}>
        {getIcon}
      </FormattedMessage>
    );
  };

  return renderIcon();
};

ProhibitionIcon.propTypes = { ariaLabel: PropTypes.string };
