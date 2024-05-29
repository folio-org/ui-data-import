import React from 'react';
import PropTypes from 'prop-types';

import {
  checkIfUserInCentralTenant,
  useStripes,
} from '@folio/stripes/core';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';

import { TreeLine } from '../../TreeLine';
import { TreeView } from '../../TreeView';
import { RecordItem } from './RecordItem';


import treeViewStyles from '../../TreeView/TreeView.css';
import recordTypeSelectStyles from '../RecordTypesSelect.css';

const recordsDataConnections = [
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
];

const childrenConnections = [{
  itemMeta: FOLIO_RECORD_TYPES.HOLDINGS,
  children: [{ itemMeta: FOLIO_RECORD_TYPES.ITEM }],
}];

export const RecordSelect = ({
  id,
  onSelect,
  container = `#${id} .${treeViewStyles.rootListContainer}`,
  isEditable = true,
  isLocalLTR = true,
}) => {
  const stripes = useStripes();
  const isUserInCentralTenant = checkIfUserInCentralTenant(stripes);

  const recordsData = {
    connections: isUserInCentralTenant ? [] : recordsDataConnections,
    children: [
      {
        itemMeta: FOLIO_RECORD_TYPES.INSTANCE,
        children: isUserInCentralTenant ? [] : childrenConnections,
      },
      { itemMeta: FOLIO_RECORD_TYPES.MARC_BIBLIOGRAPHIC },
      { itemMeta: FOLIO_RECORD_TYPES.MARC_AUTHORITY },
    ],
  };

  return (
    <>
      <TreeView
        data={recordsData}
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
      {recordsData.connections.map(element => {
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
};

RecordSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  id: PropTypes.string,
  container: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Element)]),
  isEditable: PropTypes.bool,
  isLocalLTR: PropTypes.bool,
};
