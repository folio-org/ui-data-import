import React from 'react';
import { PropTypes } from 'prop-types';

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
  onSelect,
}) => (
  <Dropdown
    id={id}
    label={label}
    buttonProps={{ buttonStyle: 'primary' }}
  >
    <DropdownMenu aria-label={label}>
      <ul>
        {!isEmpty(dataOptions) && dataOptions.map(option => (
          <li key={option?.value}>
            <Button
              type="button"
              align="start"
              onClick={() => onSelect(option?.value)}
              fullWidth
            >
              {option?.label}
            </Button>
          </li>
        ))}
      </ul>
    </DropdownMenu>
  </Dropdown>
);

OptionsList.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string.isRequired,
  dataOptions: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  onSelect: PropTypes.func.isRequired,
};
