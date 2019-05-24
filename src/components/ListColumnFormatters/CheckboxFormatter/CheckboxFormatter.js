import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Checkbox } from '@folio/stripes/components';

import sharedCss from '../../../shared.css';

export const CheckboxFormatter = memo(props => {
  const {
    value,
    checked,
    onChange,
  } = props;

  return (
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
  );
});

CheckboxFormatter.propTypes = {
  value: PropTypes.string.isRequired,
  checked: PropTypes.boolean,
  onChange: PropTypes.func,
};
