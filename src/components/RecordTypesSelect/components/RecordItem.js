import React, {
  memo,
  useRef,
} from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { noop } from 'lodash';
import classNames from 'classnames';

import { AppIcon } from '@folio/stripes/components';

import css from '../RecordTypesSelect.css';

export const RecordItem = memo(({
  item,
  className,
  style,
  onClick = noop,
}) => {
  const {
    type,
    captionId,
    iconKey,
  } = item;
  const ref = useRef();

  return (
    <div // eslint-disable-line jsx-a11y/click-events-have-key-events
      data-test-record-item
      tabIndex="0"
      role="button"
      id={type}
      className={classNames(css.item, { [css.clickableItem]: onClick !== noop }, className)}
      style={style}
      ref={ref}
      onClick={() => onClick(item)}
    >
      <AppIcon
        size="medium"
        app="data-import"
        iconKey={iconKey}
      >
        <FormattedMessage id={captionId} />
      </AppIcon>
    </div>
  );
});

RecordItem.propTypes = {
  item: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
};
