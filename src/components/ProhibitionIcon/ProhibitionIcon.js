import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Tooltip } from '@folio/stripes/components';

import css from './ProhibitionIcon.css';

/**
 * Component for rendering the circle backslash character with given message as an aria-label
 *
 * @param {string} [ariaLabel] - A label or a translation id for the aria-label attribute
 * @param {string} fieldName - field name for creation of required tooltip id attribute
 * @returns {{}}
 */
export const ProhibitionIcon = ({
  ariaLabel,
  fieldName,
}) => {
  const ariaLabelIsTranslationId = ariaLabel && ariaLabel.includes('ui-');
  const ariaLabelIsMessageString = ariaLabel && !ariaLabel.includes('ui-');
  const translationId = ariaLabelIsTranslationId ? ariaLabel : 'ui-data-import.settings.mappingProfiles.canNotBeMapped';

  const getIcon = message => (
    <div className={css.iconContainer}>
      <Tooltip
        id={fieldName}
        text={message || <FormattedMessage id="ui-data-import.settings.mappingProfiles.canNotBeMapped" />}
      >
        {({
          ref,
          ariaIds,
        }) => (
          <span
            aria-label={message}
            aria-labelledby={ariaIds.text}
            ref={ref}
            className={css.noValueAllowed}
          >
            &#8416;
          </span>
        )}
      </Tooltip>
    </div>
  );

  const renderIcon = () => {
    if (ariaLabelIsMessageString) {
      return getIcon(ariaLabel);
    }

    return (
      <FormattedMessage id={translationId}>
        {([message]) => getIcon(message)}
      </FormattedMessage>
    );
  };

  return renderIcon();
};

ProhibitionIcon.propTypes = {
  ariaLabel: PropTypes.string,
  fieldName: PropTypes.string.isRequired,
};
