import React, {
  memo,
  Fragment,
} from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Icon,
  Button,
} from '@folio/stripes/components';

export const ExportSelected = memo(props => {
  const {
    menu,
    selectedCount,
  } = props;

  return (
    <Button
      data-test-export-selected-items-menu-button
      buttonStyle="dropdownItem"
      disabled={!selectedCount}
      onClick={menu.onToggle}
    >
      <Icon icon="arrow-down">
        <FormattedMessage id="ui-data-import.exportSelected" />
        {!!selectedCount && (
          <Fragment>
            {' '}
            <FormattedMessage
              id="ui-data-import.itemsCount"
              values={{ count: selectedCount }}
            />
          </Fragment>
        )}
      </Icon>
    </Button>
  );
});

ExportSelected.propTypes = {
  menu: PropTypes.object.isRequired,
  selectedCount: PropTypes.number.isRequired,
};
