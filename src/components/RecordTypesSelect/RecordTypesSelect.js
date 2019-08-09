import React from 'react';
import { FormattedMessage } from 'react-intl';

import { AppIcon } from '@folio/stripes-core';

import { FOLIO_RECORD_TYPES } from '../ListTemplate';
import { TreeView } from '../TreeView';

import css from './RecordTypesSelect.css';
import { rootList } from '../TreeView/TreeView.css';
import { LineBetween } from '../LineBetween';

const treeData = {
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

// TODO: RecordTypesSelect component will be rewritten in UIDATIMP-244
export const RecordTypesSelect = () => {
  // eslint-disable-next-line no-console
  const onItemClick = console.log;

  const renderItem = item => {
    const itemKey = item.itemMeta.type;

    return (
      <div // eslint-disable-line jsx-a11y/click-events-have-key-events
        tabIndex="0"
        role="button"
        id={itemKey}
        className={css.item}
        onClick={() => onItemClick(item.itemMeta.type)}
      >
        <AppIcon
          size="medium"
          app="data-import"
          iconKey={item.itemMeta.iconKey}
        >
          <FormattedMessage id={item.itemMeta.captionId} />
        </AppIcon>
      </div>
    );
  };

  return (
    <section className={css.container}>
      <h3 className={css.heading}>
        <FormattedMessage
          id="ui-data-import.recordTypesSelect.compareExisting"
          values={{ type: <FormattedMessage id="ui-data-import.marc" /> }}
        />
      </h3>
      <TreeView
        data={treeData}
        className={css.treeView}
        renderItem={renderItem}
      />
      {treeData.connections.map(element => (
        <LineBetween
          key={element}
          from={element}
          to={treeData.connections[0]}
          fromAnchor="right"
          toAnchor="right"
          toAnchorOffset="20px"
          container={`.${rootList}`}
        />
      ))}
    </section>
  );
};
