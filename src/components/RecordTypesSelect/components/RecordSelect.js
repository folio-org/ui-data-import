import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import { LineBetween } from '../../LineBetween';
import { TreeView } from '../../TreeView';
import { RecordItem } from './RecordItem';
import { FOLIO_RECORD_TYPES } from '../../ListTemplate';

import { rootList } from '../../TreeView/TreeView.css';
import css from '../RecordTypesSelect.css';

const recordsData = {
  connections: [
    FOLIO_RECORD_TYPES.INSTANCE.type,
    FOLIO_RECORD_TYPES.HOLDINGS.type,
    FOLIO_RECORD_TYPES.ITEM.type,
    FOLIO_RECORD_TYPES.ORDER.type,
    FOLIO_RECORD_TYPES.INVOICE.type,
  ].map(id => `#${id}`),
  children: [
    {
      itemMeta: FOLIO_RECORD_TYPES.INSTANCE,
      children: [
        {
          itemMeta: FOLIO_RECORD_TYPES.HOLDINGS,
          children: [{ itemMeta: FOLIO_RECORD_TYPES.MARC_HOLDINGS }, { itemMeta: FOLIO_RECORD_TYPES.ITEM }],
        },
        { itemMeta: FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC },
      ],
    },
    {
      itemMeta: {
        ...FOLIO_RECORD_TYPES.ORDER,
        captionId: 'ui-data-import.recordTypes.orderLine',
      },
    },
    { itemMeta: FOLIO_RECORD_TYPES.INVOICE },
    { itemMeta: FOLIO_RECORD_TYPES.MARC_AUTHORITY },
  ],
};

export const RecordSelect = ({
  onSelect = noop,
  container = `.${rootList}`,
  treeData = recordsData,
}) => (
  <Fragment>
    <TreeView
      data={treeData}
      className={css.treeView}
      container={container}
      renderItem={item => (
        <RecordItem
          item={item.itemMeta}
          onClick={onSelect}
        />
      )}
    />
    {treeData.connections.map(element => (
      <LineBetween
        key={element}
        from={element}
        to={treeData.connections[0]}
        fromAnchor="right"
        toAnchor="right"
        toAnchorOffset="20px"
        container={container}
      />
    ))}
  </Fragment>
);

RecordSelect.propTypes = {
  onSelect: PropTypes.func,
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Element)]),
  treeData: PropTypes.object,
};
