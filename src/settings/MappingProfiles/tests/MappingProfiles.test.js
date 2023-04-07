import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { noop } from 'lodash';

import '../../../../test/jest/__mock__';

import { renderWithIntl } from '@folio/stripes-data-transfer-components/test/jest/helpers';
import { FOLIO_RECORD_TYPES } from '@folio/stripes-data-transfer-components';
import {
  buildMutator,
  buildResources,
} from '@folio/stripes-data-transfer-components/test/helpers';

import { Paneset } from '@folio/stripes/components';
import {
  renderWithReduxForm,
  translationsProperties,
} from '../../../../test/jest/helpers';

import {
  MappingProfiles,
  mappingProfilesShape,
} from '../MappingProfiles';

import { getInitialDetails } from '../initialDetails';
import {
  OCLC_CREATE_INSTANCE_MAPPING_ID,
  OCLC_UPDATE_INSTANCE_MAPPING_ID,
  OCLC_CREATE_MARC_BIB_MAPPING_ID,
  QUICKMARK_DERIVE_CREATE_BIB_MAPPING_ID,
  QUICKMARK_DERIVE_CREATE_HOLDINGS_MAPPING_ID,
} from '../../../utils';

const history = createMemoryHistory();

history.push = jest.fn();

const mappingDetails = getInitialDetails(FOLIO_RECORD_TYPES.INVOICE.type);

const resources = buildResources({
  resourceName: 'mappingProfiles',
  records: [{
    childProfiles: [],
    deleted: false,
    description: 'testDescription',
    existingRecordType: 'INVOICE',
    incomingRecordType: 'EDIFACT_INVOICE',
    id: 'id1',
    name: 'name1',
    mappingDetails,
    marcFieldProtectionSettings: [],
    userInfo: {
      firstName: 'System',
      lastName: 'System',
      userName: 'System',
    },
    metadata: {
      createdByUserId: '00000000-0000-0000-0000-000000000000',
      createdDate: '2021-03-01T15:00:00.000+00:00',
      updatedByUserId: '00000000-0000-0000-0000-000000000000',
      updatedDate: '2021-03-01T16:00:00.462+00:00',
    },
    parentProfiles: [],
  }],
  otherResources: {
    query: {
      query: '',
      sort: 'name',
    },
    marcFieldProtectionSettings: { records: [] },
  },
});

const mutator = buildMutator({
  query: {
    replace: noop,
    update: noop,
  },
  mappingProfiles: {
    POST: noop,
    PUT: noop,
  },
  marcFieldProtectionSettings: {
    POST: noop,
    PUT: noop,
    DELETE: noop,
  },
});

const testSet = new Set();

const mappingProfilesProps = {
  location: {
    search: '?sort=name',
    pathname: '/settings/data-import/mapping-profiles',
  },
  unlink: true,
  match: { path: '/settings/data-import/mapping-profiles' },
  label: <span>Field mapping profiles</span>,
  selectedRecord: {
    record: {},
    hasLoaded: false,
  },
  checkboxList: {
    selectedRecords: testSet,
    isAllSelected: false,
    selectRecord: noop,
    selectAll: noop,
    deselectAll: noop,
    handleSelectAllCheckbox: noop,
  },
  setList: noop,
  detailProps: { jsonSchemas: { identifierTypes: [] } },
};

const renderMappingProfiles = ({
  location,
  unlink,
  match,
  label,
  selectedRecord,
  checkboxList,
  setList,
  detailProps,
}) => {
  const component = () => (
    <Router>
      <Paneset>
        <MappingProfiles
          resources={resources}
          mutator={mutator}
          location={location}
          unlink={unlink}
          match={match}
          history={history}
          label={label}
          selectedRecord={selectedRecord}
          checkboxList={checkboxList}
          setList={setList}
          detailProps={detailProps}
          initialValues={{}}
        />
      </Paneset>
    </Router>
  );

  return renderWithIntl(renderWithReduxForm(component), translationsProperties);
};

describe('MappingProfiles component', () => {
  it('renders correctly', async () => {
    const { getByText } = renderMappingProfiles(mappingProfilesProps);
    const numberOfMappingProfiles = resources.mappingProfiles.other.totalRecords;
    const expectedString = `${numberOfMappingProfiles} field mapping profile${numberOfMappingProfiles !== 1 ? 's' : ''}`;

    // heading section
    expect(getByText('Field mapping profiles')).toBeInTheDocument();
    expect(getByText(expectedString)).toBeInTheDocument();

    // MultiColumn list headers
    expect(getByText('Name')).toBeInTheDocument();
    expect(getByText('FOLIO record type')).toBeInTheDocument();
    expect(getByText('Tags')).toBeInTheDocument();
    expect(getByText('Updated')).toBeInTheDocument();
    expect(getByText('Updated by')).toBeInTheDocument();
  });

  describe('mappingProfilesShape', () => {
    it('returns correct query string with given query params', () => {
      const queryParams = {
        query: {
          query: 'testTerm',
          sort: 'name',
        },
      };
      const { query } = mappingProfilesShape.manifest.records.params(null, null, queryParams, null);

      expect(query.includes(OCLC_CREATE_INSTANCE_MAPPING_ID)).toBeTruthy();
      expect(query.includes(OCLC_UPDATE_INSTANCE_MAPPING_ID)).toBeTruthy();
      expect(query.includes(OCLC_CREATE_MARC_BIB_MAPPING_ID)).toBeTruthy();
      expect(query.includes(QUICKMARK_DERIVE_CREATE_BIB_MAPPING_ID)).toBeTruthy();
      expect(query.includes(QUICKMARK_DERIVE_CREATE_HOLDINGS_MAPPING_ID)).toBeTruthy();
      expect(query.includes(queryParams.query.query)).toBeTruthy();
      expect(query.includes(queryParams.query.sort)).toBeTruthy();
    });
  });
});
