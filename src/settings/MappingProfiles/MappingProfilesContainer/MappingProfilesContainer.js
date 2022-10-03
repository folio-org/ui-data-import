import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Route,
  useStripes
} from '@folio/stripes/core';
import { makeQueryFunction } from '@folio/stripes/smart-components';
import { MappingProfiles } from '@folio/stripes-data-transfer-components';

import {
  CheckboxHeader,
  useListFormatter
} from '../../../components';
import {
  ENTITY_KEYS,
  FIND_ALL_CQL,
  getSearchQuery,
  getSortQuery,
  OCLC_CREATE_INSTANCE_MAPPING_ID,
  OCLC_CREATE_MARC_BIB_MAPPING_ID,
  OCLC_UPDATE_INSTANCE_MAPPING_ID,
  QUICKMARK_DERIVE_CREATE_BIB_MAPPING_ID,
  QUICKMARK_DERIVE_CREATE_HOLDINGS_MAPPING_ID,
  withCheckboxList
} from '../../../utils';
import { ViewMappingProfile } from '../ViewMappingProfile';
import { ViewContainer } from '../../../components/ViewContainer';
import { EditMappingProfile } from '../EditMappingProfile';

// big numbers to get rid of infinite scroll
const INITIAL_RESULT_COUNT = 5000;
const RESULT_COUNT_INCREMENT = 5000;
const queryTemplate = `(
  name="%{query.query}*" OR
  existingRecordType="%{query.query}*" OR
  tags.tagList="%{query.query}*"
)`;
const sortMap = {
  name: 'name',
  folioRecord: 'existingRecordType',
  tags: 'tags.tagList',
  updated: 'metadata.updatedDate',
  updatedBy: 'userInfo.firstName userInfo.lastName userInfo.userName',
};

export const mappingProfilesShape = {
  INITIAL_RESULT_COUNT,
  RESULT_COUNT_INCREMENT,
  manifest: {
    initializedFilterConfig: { initialValue: false },
    query: { initialValue: {} },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      perRequest: RESULT_COUNT_INCREMENT,
      records: ENTITY_KEYS.MAPPING_PROFILES,
      recordsRequired: '%{resultCount}',
      path: 'data-import-profiles/mappingProfiles',
      clientGeneratePk: false,
      throwErrors: true,
      params: (_q, _p, _r, _l) => {
        const sort = _r?.query?.sort;
        const search = _r?.query?.query;
        const sortQuery = sort ? `sortBy ${getSortQuery(sortMap, sort)}` : '';
        const searchQuery = search ? `AND ${getSearchQuery(queryTemplate, search)}` : '';

        const withoutDefaultProfiles = `AND id<>(${OCLC_CREATE_INSTANCE_MAPPING_ID} AND ${OCLC_UPDATE_INSTANCE_MAPPING_ID} AND ${OCLC_CREATE_MARC_BIB_MAPPING_ID} AND ${QUICKMARK_DERIVE_CREATE_BIB_MAPPING_ID} AND ${QUICKMARK_DERIVE_CREATE_HOLDINGS_MAPPING_ID})`;
        const query = `${FIND_ALL_CQL} ${withoutDefaultProfiles} ${searchQuery} ${sortQuery}`;

        return { query };
      },
    },
  },
  visibleColumns: [
    'name',
    'folioRecord',
    'tags',
    'updated',
    'updatedBy',
  ],
  columnWidths: {
    selected: '40px',
    isChecked: '35px',
    name: '300px',
    folioRecord: '150px',
    tags: '150px',
    updated: '100px',
    updatedBy: '250px',
  },
  renderHeaders: props => {
    let headers = {
      name: <FormattedMessage id="ui-data-import.name" />,
      folioRecord: <FormattedMessage id="ui-data-import.folioRecordType" />,
      tags: <FormattedMessage id="ui-data-import.tags" />,
      updated: <FormattedMessage id="ui-data-import.updated" />,
      updatedBy: <FormattedMessage id="ui-data-import.updatedBy" />,
    };

    if (props && props.unlink) {
      headers = {
        unlink: <FormattedMessage id="ui-data-import.unlink" />,
        ...headers,
      };
    }

    if (props && props.checkboxList) {
      const {
        checkboxList: {
          isAllSelected,
          handleSelectAllCheckbox,
        },
      } = props;

      headers = {
        ...headers,
        selected: (
          <CheckboxHeader
            checked={isAllSelected}
            onChange={handleSelectAllCheckbox}
          />
        ),
      };
    }

    return headers;
  },
};

const entityKey = ENTITY_KEYS.MAPPING_PROFILES;

export const MappingProfilesContainer = withCheckboxList()(({
  history,
  location,
  match,
  history: { push },
  match: { path },
  location: { search },
  resources,
  mutator,
  checkboxList,
  checkboxList: {
    selectRecord,
    selectedRecords,
  },
  ...rest
}) => {
  const stripes = useStripes();

  const handleNavigationToMappingProfilesList = useCallback(
    () => push(`${path}${search}`),
    [push, path, search]
  );

  const deselectOnDelete = recordId => {
    const isRecordSelected = selectedRecords.has(recordId);

    if (isRecordSelected) {
      selectRecord(recordId);
    }
  };

  const deleteRecord = async (record, onDelete, handleDeleteSuccess, handleDeleteError) => {
    const response = await onDelete(record);

    if (response.ok) {
      handleNavigationToMappingProfilesList();
      deselectOnDelete(record.id);
    } else {
      handleDeleteError(record, response);
    }
  };

  return (
    <>
      <ViewContainer
        location={location}
        history={history}
        match={match}
        mutator={mutator}
        entityKey={entityKey}
        selectRecord={selectRecord}
        selectedRecords={selectedRecords}
      >
        {viewContainerProps => (
          <>
            <MappingProfiles
              parentResources={resources}
              parentMutator={mutator}
              formatter={useListFormatter({
                entityKey: ENTITY_KEYS.MAPPING_PROFILES,
                selectRecord,
                selectedRecords,
              })}
              columnMapping={mappingProfilesShape.renderHeaders({ ...rest, checkboxList })}
              columnWidths={mappingProfilesShape.columnWidths}
              visibleColumns={['selected', ...mappingProfilesShape.visibleColumns]}
            />
            <Route
              path={`${path}/view/:id`}
              render={routerProps => (
                <ViewMappingProfile
                  {...routerProps}
                  {...viewContainerProps}
                  stripes={stripes}
                  parentResources={resources}
                  onClose={handleNavigationToMappingProfilesList}
                  onDelete={record => deleteRecord(record, viewContainerProps.onDelete, viewContainerProps.handleDeleteSuccess, viewContainerProps.handleDeleteError)}
                />
              )}
            />
            <Route
              path={`${path}/edit/:id`}
              render={routerProps => (
                <EditMappingProfile
                  {...routerProps}
                  {...viewContainerProps}
                  parentMutator={mutator}
                  parentResources={resources}
                />
              )}
            />
          </>
        )}
      </ViewContainer>
    </>
  );
});

MappingProfilesContainer.manifest = Object.freeze({
  initializedFilterConfig: { initialValue: false },
  query: { initialValue: {} },
  resultCount: { initialValue: INITIAL_RESULT_COUNT },
  mappingProfiles: {
    type: 'okapi',
    perRequest: RESULT_COUNT_INCREMENT,
    records: 'mappingProfiles',
    recordsRequired: '%{resultCount}',
    path: 'data-import-profiles/mappingProfiles',
    clientGeneratePk: false,
    throwErrors: false,
    GET: {
      params: {
        query: makeQueryFunction(
          FIND_ALL_CQL,
          queryTemplate,
          sortMap,
          [],
        ),
      },
      staticFallback: { params: {} },
    },
  },
  marcFieldProtectionSettings: {
    type: 'okapi',
    path: 'field-protection-settings/marc',
    records: 'marcFieldProtectionSettings',
    throwErrors: false,
    GET: { path: 'field-protection-settings/marc?query=source=USER&limit=1000' },
  },
});
