import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

import css from './TreeView.css';

export const TreeView = ({
  data,
  indentation = 40,
  spacing = '1rem',
  isLocalLTR = true,
  className,
  renderItem = noop,
}) => {
  const renderList = ({
    items,
    root = false,
  }) => Array.isArray(items) && (
    <div className={css.rootListContainer}>
      <ul
        className={classNames(css.list, { [css.rootList]: root })}
        style={root ? null : { [isLocalLTR ? 'paddingLeft' : 'paddingRight']: indentation }}
      >
        {items.map((item, index) => {
          const itemKey = item.itemMeta.type;
          const itemSelector = `[data-id="${itemKey}"]`;
          const isFirstItem = root && index === 0;

          return (
            <li
              key={itemKey}
              className={classNames(css.listItem)}
              style={{ marginTop: isFirstItem ? 0 : spacing }}
            >
              {renderItem(item)}
              {renderList({
                items: item.children,
                parent: itemSelector,
              })}
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <section className={className}>
      {renderList({
        items: data.children,
        root: true,
      })}
    </section>
  );
};

TreeView.propTypes = {
  data: PropTypes.shape({
    connections: PropTypes.arrayOf(PropTypes.string),
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
  indentation: PropTypes.number, // in pixels
  spacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  renderItem: PropTypes.func,
  isLocalLTR: PropTypes.bool,
};
