import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { noop } from 'lodash';

import { TreeLine } from '../TreeLine';

import css from './TreeView.css';

export const TreeView = ({
  data,
  indentation = 40,
  spacing = '1rem',
  container = `.${css.rootList}`,
  className,
  renderItem = noop,
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
      {items.map((item, index) => {
        const itemKey = item.itemMeta.type;
        const itemSelector = `#${itemKey}`;
        const isFirstItem = root && index === 0;

        return (
          <li
            key={itemKey}
            className={classNames(css.listItem)}
            style={{ marginTop: isFirstItem ? 0 : spacing }}
          >
            {renderItem(item)}
            {parent && (
              <TreeLine
                from={parent}
                to={itemSelector}
                container={container}
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
  spacing: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Element)]),
  className: PropTypes.string,
  renderItem: PropTypes.func,
};
