import React, { memo } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { noop } from 'lodash';
import { Checkbox } from '@folio/stripes/components';

import sharedCss from '../../../shared.css';

export const CheckboxHeader = memo(({
  checked = false,
  onChange = noop,
}) => (
  // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
  <div
    className={sharedCss.selectableCellButton}
    data-test-select-all-checkbox
    onClick={e => e.stopPropagation()}
  >
    <FormattedMessage id="ui-data-import.settings.table.checkboxAll">
      {([ariaLabel]) => (
        <Checkbox
          name="selected-all"
          checked={checked}
          onChange={onChange}
          aria-label={ariaLabel}
        />
      )}
    </FormattedMessage>
  </div>
));

CheckboxHeader.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};
