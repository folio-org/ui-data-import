import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { noop } from 'lodash';
import { Checkbox } from '@folio/stripes/components';

import sharedCss from '../../../shared.css';

export const CheckboxHeader = memo(props => {
  const {
    checked,
    onChange,
  } = props;

  return (
    <div // eslint-disable-line jsx-a11y/click-events-have-key-events
      role="button"
      tabIndex="0"
      className={sharedCss.selectableCellButton}
      data-test-select-all-checkbox
      onClick={e => e.stopPropagation()}
    >
      <Checkbox
        name="selected-all"
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
});

CheckboxHeader.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

CheckboxHeader.defaultProps = {
  checked: false,
  onChange: noop,
};
