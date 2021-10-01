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
    FOLIO_RECORD_TYPES.INSTANCE.type,
    FOLIO_RECORD_TYPES.HOLDINGS.type,
    FOLIO_RECORD_TYPES.ITEM.type,
    FOLIO_RECORD_TYPES.ORDER.type,
    FOLIO_RECORD_TYPES.INVOICE.type,
  ].map(id => `[data-id="${id}"]`),
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
    {treeData.connections.map(element => (
      <TreeLine
        key={element}
        from={element}
        to={treeData.connections[0]}
        fromAnchor={isLocalLTR ? 'right' : 'left'}
        toAnchor={isLocalLTR ? 'right' : 'left'}
        toAnchorOffset="20px"
        container={container}
        isLocalLTR={isLocalLTR}
      />
    ))}
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
