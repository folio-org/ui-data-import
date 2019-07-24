import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { noop } from 'lodash';
import { Checkbox } from '@folio/stripes/components';

import sharedCss from '../../../shared.css';

export const CheckboxColumn = memo(({
  value,
  checked = false,
  onChange = noop,
}) => (
  <div // eslint-disable-line jsx-a11y/click-events-have-key-events
    tabIndex="0"
    role="button"
    className={sharedCss.selectableCellButton}
    data-test-select-item
    onClick={e => e.stopPropagation()}
  >
    <Checkbox
      name={`selected-${value}`}
      checked={checked}
      onChange={() => onChange(value)}
    />
  </div>
));

CheckboxColumn.propTypes = {
  value: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};
