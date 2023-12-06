import { FormattedMessage } from 'react-intl';
import {
  groupBy,
  isEmpty,
} from 'lodash';

import {
  TextLink,
  NoValue,
} from '@folio/stripes/components';

import {
  RECORD_ACTION_STATUS,
  RECORD_ACTION_STATUS_LABEL_IDS,
} from '../../../utils';

import sharedCss from '../../../shared.css';

export const BaseLineCell = ({ children }) => (
  <div className={sharedCss.baselineCell}>
    {children}
  </div>
);

export const getHotlinkCellFormatter = (isHotlink, entityLabel, path, entity, tenant) => {
  if (isHotlink) {
    return (
      <BaseLineCell>
        <TextLink
          data-test-entity-name={entity}
          to={{
            pathname: path,
            state: { tenantTo: tenant }
          }}
        >
          {entityLabel}
        </TextLink>
      </BaseLineCell>
    );
  }

  return <BaseLineCell>{entityLabel}</BaseLineCell>;
};

export const getRecordActionStatusLabel = recordType => {
  if (!recordType) {
    return (
      <BaseLineCell>
        <NoValue />
      </BaseLineCell>
    );
  }

  const labelId = RECORD_ACTION_STATUS_LABEL_IDS[recordType];

  return (
    <BaseLineCell>
      <FormattedMessage id={labelId} />
    </BaseLineCell>
  );
};

const renderNoValues = (itemData, isErrorColumn) => {
  const itemsInfoCell = itemData?.map((sortedItems, itemIndex) => {
    const groupOfItems = sortedItems?.map((item, index) => {
      return (
        <div key={`group-${index}`}>
          <span>
            {item.error && isErrorColumn ? <FormattedMessage id="ui-data-import.error" /> : null}
            {!isErrorColumn ? <NoValue /> : null}
          </span>
          <br />
        </div>
      );
    });

    return (
      <div key={`cell-${itemIndex}`} style={{ paddingBottom: '7px' }}>
        {groupOfItems}
      </div>
    );
  });

  return (
    <BaseLineCell>
      {itemsInfoCell}
    </BaseLineCell>
  );
};

export const fillCellWithNoValues = (itemData, isErrorColumn = false) => {
  if (isEmpty(itemData)) {
    return (
      <BaseLineCell>
        <NoValue />
      </BaseLineCell>
    );
  }

  return renderNoValues(itemData, isErrorColumn);
};

/*
  When there is general item error, BE sends response like this
  realtedItemInfo: [{
    actionStatus: "DISCARDED",
    error: "Error",
    hrid: "",
  }];
  This array always contains one item with status 'DISCARDED' and has no holdingsId and has error message.
*/
export const isGeneralItemsError = (itemStatus, itemData = []) => {
  const [item] = itemData;

  return itemData.length === 1 && !item.holdingsId && itemStatus === RECORD_ACTION_STATUS.DISCARDED && item.error;
};

export const getRelatedInfo = (jobLogRecords, sourceRecordId) => {
  const sourceRecord = jobLogRecords?.find(item => item.sourceRecordId === sourceRecordId);
  const instanceData = sourceRecord?.relatedInstanceInfo;
  const holdingsData = sourceRecord?.relatedHoldingsInfo;
  const itemData = sourceRecord?.relatedItemInfo;

  return {
    instanceData,
    holdingsData,
    itemData,
  };
};

export const groupAndSortDataForRender = (itemData, holdingsData, isError = false) => {
  const groupedItemData = groupBy(itemData, 'holdingsId');
  const sortedItemData = holdingsData?.map(holdings => groupedItemData[holdings.id]);

  return isError
    ? sortedItemData?.map(element => (element || [{ error: true }]))
    : sortedItemData?.map(element => (element || [{}]));
};
