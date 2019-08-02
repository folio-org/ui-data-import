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

export const GroupAction = memo(({
  menu,
  caption,
  icon,
  selectedCount,
  dataAttributes,
}) => (
  <Button
    buttonStyle="dropdownItem"
    disabled={!selectedCount}
    onClick={menu.onToggle}
    {...dataAttributes}
  >
    <Icon icon={icon}>
      <FormattedMessage id={caption} />
      {!!selectedCount && (
        <Fragment>
          &nbsp;
          <FormattedMessage
            id="ui-data-import.itemsCount"
            values={{ count: selectedCount }}
          />
        </Fragment>
      )}
    </Icon>
  </Button>
));

GroupAction.propTypes = {
  menu: PropTypes.object.isRequired,
  caption: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  selectedCount: PropTypes.number.isRequired,
  dataAttributes: PropTypes.object,
};
