import { FormattedMessage } from 'react-intl';

import {
  TextLink,
  NoValue,
} from '@folio/stripes/components';

import { isEmpty } from 'lodash';
import { RECORD_ACTION_STATUS_LABEL_IDS } from '../../../utils';

import sharedCss from '../../../shared.css';

export const BaseLineCell = ({ children }) => <div className={sharedCss.baselineCell}>{children}</div>;

export const getHotlinkCellFormatter = (isHotlink, entityLabel, path, entity) => {
  if (isHotlink) {
    return (
      <BaseLineCell>
        <TextLink
          data-test-entity-name={entity}
          to={path}
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

  return <BaseLineCell><FormattedMessage id={labelId} /></BaseLineCell>;
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

    return <div key={`cell-${itemIndex}`} style={{ paddingBottom: '7px' }}>{groupOfItems}</div>;
  });

  return (
    <BaseLineCell>
      {itemsInfoCell}
    </BaseLineCell>
  );
};

export const fillCellWithNoValues = (itemData, isErrorColumn = false) => {
  if (isEmpty(itemData)) {
    return <BaseLineCell><NoValue /></BaseLineCell>;
  }

  return renderNoValues(itemData, isErrorColumn);
};
