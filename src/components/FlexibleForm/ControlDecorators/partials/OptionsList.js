import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';

import { isEmpty } from 'lodash';

import {
  Button,
  Dropdown,
  DropdownMenu,
} from '@folio/stripes/components';

import styles from './partials.css';

export const OptionsList = ({
  id,
  label,
  dataOptions,
  optionValue,
  optionLabel,
  className,
  disabled,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      data-test-accepted-values-list
      id={id}
      label={label}
      className={classNames(styles['options-list'], className)}
      buttonProps={{
        buttonStyle: 'default',
        marginBottom0: true,
      }}
      placement="bottom-end"
      disabled={disabled}
      open={open}
      onToggle={() => setOpen(!open)}
    >
      <DropdownMenu
        aria-label={label}
        role="menu"
      >
        <ul>
          {!isEmpty(dataOptions) && dataOptions.map(option => (
            <li key={option?.[optionValue]}>
              <Button
                buttonStyle="dropdownItem"
                role="menuitem"
                align="start"
                onClick={() => {
                  onSelect(option?.[optionValue] || option?.[optionLabel]);
                  setOpen(false);
                }}
                fullWidth
              >
                {option?.[optionLabel]}
              </Button>
            </li>
          ))}
        </ul>
      </DropdownMenu>
    </Dropdown>
  );
};

OptionsList.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, Node]).isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  optionValue: PropTypes.string,
  optionLabel: PropTypes.string,
  disabled: PropTypes.bool,
};

OptionsList.defaultProps = {
  id: '',
  optionValue: 'value',
  optionLabel: 'label',
  className: null,
  disabled: false,
};
