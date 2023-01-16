import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  TextLink,
} from '@folio/stripes/components';
import { listTemplate } from '@folio/stripes-data-transfer-components';

import {
  stringToWords,
  fieldsConfig,
} from '../../utils';

import sharedCss from '../../shared.css';
import css from './ProfileAssociator.css';

export const associatedProfilesColumns = ({
  entityKey,
  isStatic,
  isMultiSelect,
  searchTerm,
  selectRecord,
  selectedRecords,
  onRemove,
  intl,
}) => {
  const formatter = listTemplate({
    entityKey,
    searchTerm,
    selectRecord,
    selectedRecords,
    fieldsConfig,
  });
  const entityName = stringToWords(entityKey).map(word => word.toLocaleLowerCase()).join('-');

  if (!isStatic) {
    if (!isMultiSelect) {
      return formatter;
    }

    return {
      ...formatter,
      unlink: record => (
        <Button
          data-test-profile-unlink
          size="medium"
          buttonStyle="default"
          buttonClass={css['button-unlink']}
          title={intl.formatMessage({ id: 'ui-data-import.settings.profile.unlink' })}
          marginBottom0
          onClick={() => onRemove(record)}
        >
          <Icon
            size="medium"
            icon="unlink"
            className={sharedCss.cellAppIcon}
          />
        </Button>
      ),
    };
  }

  return {
    ...formatter,
    name: record => (
      <TextLink
        data-test-profile-link
        to={`/settings/data-import/${entityName}/view/${record.id}`}
      >
        {formatter.name(record)}
      </TextLink>
    ),
  };
};

associatedProfilesColumns.propTypes = {
  entityKey: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  selectRecord: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  selectedRecords: PropTypes.instanceOf(Set).isRequired,
  isMultiSelect: PropTypes.bool,
};
