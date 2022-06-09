import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { noop } from 'lodash';
import { Checkbox } from '@folio/stripes/components';

import sharedCss from '../../../shared.css';

export const CheckboxColumn = memo(({
  value,
  checked = false,
  disabled = false,
  onChange = noop,
}) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
  <div
    className={sharedCss.selectableCellButton}
    data-test-select-item
    onClick={e => e.stopPropagation()}
  >
    <FormattedMessage id="ui-data-import.settings.table.checkbox">
      {([ariaLabel]) => (
        <Checkbox
          name={`selected-${value}`}
          checked={checked}
          onChange={() => onChange(value)}
          aria-label={ariaLabel}
          disabled={disabled}
        />
      )}
    </FormattedMessage>
  </div>
));

CheckboxColumn.propTypes = {
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};
