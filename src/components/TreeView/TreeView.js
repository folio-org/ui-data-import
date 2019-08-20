import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { LineBetween } from '../LineBetween';

import css from './TreeView.css';

export const TreeView = ({
  data,
  indentation = 40,
  className,
  renderItem,
}) => {
  const renderList = ({
    items,
    root = false,
    parent,
  }) => Array.isArray(items) && (
    <ul
      className={classNames(css.list, { [css.rootList]: root })}
      style={root ? null : { paddingLeft: indentation }}
    >
      {items.map(item => {
        const itemKey = item.itemMeta.type;
        const itemSelector = `#${itemKey}`;

        return (
          <li
            key={itemKey}
            className={classNames(css.listItem)}
          >
            {renderItem(item)}
            {parent && (
              <LineBetween
                from={parent}
                to={itemSelector}
                container={`.${css.rootList}`}
                fromAnchor="left bottom"
                toAnchor="left"
                fromAnchorOffset={`${indentation / 2}px`}
                orientation="horizontal"
              />
            )}
            {renderList({
              items: item.children,
              parent: itemSelector,
            })}
          </li>
        );
      })}
    </ul>
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
  className: PropTypes.string,
  renderItem: PropTypes.func,
};
