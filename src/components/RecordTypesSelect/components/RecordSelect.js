import React from 'react';
import PropTypes from 'prop-types';

import { TreeLine } from '../../TreeLine';
import { TreeView } from '../../TreeView';
import { RecordItem } from './RecordItem';

import { FOLIO_RECORD_TYPES } from '../../ListTemplate';

import treeViewStyles from '../../TreeView/TreeView.css';
import recordTypeSelectStyles from '../RecordTypesSelect.css';

const recordsData = {
  connections: [
    {
      from: FOLIO_RECORD_TYPES.INSTANCE.type,
      to: FOLIO_RECORD_TYPES.INSTANCE.type,
    },
    {
      from: FOLIO_RECORD_TYPES.HOLDINGS.type,
      to: FOLIO_RECORD_TYPES.INSTANCE.type,
    },
    {
      from: FOLIO_RECORD_TYPES.ITEM.type,
      to: FOLIO_RECORD_TYPES.INSTANCE.type,
    },
    {
      from: FOLIO_RECORD_TYPES.ORDER.type,
      to: FOLIO_RECORD_TYPES.INSTANCE.type,
    },
    {
      from: FOLIO_RECORD_TYPES.INVOICE.type,
      to: FOLIO_RECORD_TYPES.INSTANCE.type,
    },
    {
      from: FOLIO_RECORD_TYPES.AUTHORITY.type,
      to: FOLIO_RECORD_TYPES.MARC_AUTHORITY.type,
    },
    {
      from: FOLIO_RECORD_TYPES.MARC_AUTHORITY.type,
      to: FOLIO_RECORD_TYPES.MARC_AUTHORITY.type,
    },
  ],
  children: [
    {
      itemMeta: FOLIO_RECORD_TYPES.INSTANCE,
      children: [
        {
          itemMeta: FOLIO_RECORD_TYPES.HOLDINGS,
          children: [{ itemMeta: FOLIO_RECORD_TYPES.ITEM }],
        },
        { itemMeta: FOLIO_RECORD_TYPES.MARC_HOLDINGS },
      ],
    },
    { itemMeta: FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC },
    {
      itemMeta: {
        ...FOLIO_RECORD_TYPES.ORDER,
        captionId: 'ui-data-import.recordTypes.orderLine',
      },
    },
    { itemMeta: FOLIO_RECORD_TYPES.INVOICE },
    { itemMeta: FOLIO_RECORD_TYPES.AUTHORITY },
    { itemMeta: FOLIO_RECORD_TYPES.MARC_AUTHORITY },
  ],
};

export const RecordSelect = ({
  id,
  onSelect,
  container = `#${id} .${treeViewStyles.rootListContainer}`,
  treeData = recordsData,
  isEditable,
  isLocalLTR,
}) => (
  <>
    <TreeView
      data={treeData}
      className={isLocalLTR ? recordTypeSelectStyles.treeViewLTR : recordTypeSelectStyles.treeViewRTL}
      isLocalLTR={isLocalLTR}
      renderItem={item => (
        <RecordItem
          item={item.itemMeta}
          onClick={onSelect}
          isEditable={isEditable}
        />
      )}
    />
    {treeData.connections.map(element => {
      const dataIdFrom = `[data-id="${element.from}"]`;
      const dataIdTo = `[data-id="${element.to}"]`;

      return (
        <TreeLine
          key={dataIdFrom}
          from={dataIdFrom}
          to={dataIdTo}
          fromAnchor={isLocalLTR ? 'right' : 'left'}
          toAnchor={isLocalLTR ? 'right' : 'left'}
          toAnchorOffset="20px"
          container={container}
          isLocalLTR={isLocalLTR}
        />
      );
    })}
  </>
);

RecordSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  id: PropTypes.string,
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Element)]),
  treeData: PropTypes.object,
  isEditable: PropTypes.bool,
  isLocalLTR: PropTypes.bool,
};

RecordSelect.defaultProps = {
  isEditable: true,
  isLocalLTR: true,
};
