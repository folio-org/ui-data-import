import { searchEntityByQuery } from '../../helpers/searchEntityByQuery';
import { noAssociatedJobProfiles } from '../../mocks';

export default server => {
  server.create('match-profile', {
    name: '001 to Instance HRID',
    description: 'MARC 001 to Instance ID (numerics only)',
    existingRecordType: 'INSTANCE',
    incomingRecordType: 'MARC_BIBLIOGRAPHIC',
    matchDetails: [
      {
        incomingRecordType: 'MARC_BIBLIOGRAPHIC',
        existingRecordType: 'INSTANCE',
        matchCriterion: 'EXACTLY_MATCHES',
        existingMatchExpression: {
          dataValueType: 'VALUE_FROM_RECORD',
          fields: [{
            label: 'field',
            value: 'instance.metadata.updatedByUsername',
          }],
          qualifier: { comparisonPart: 'NUMERICS_ONLY' },
        },
        incomingMatchExpression: {
          dataValueType: 'VALUE_FROM_RECORD',
          fields: [{
            label: 'field',
            value: '001',
          }, {
            label: 'indicator1',
            value: '',
          }, {
            label: 'indicator2',
            value: '',
          }, {
            label: 'recordSubfield',
            value: 'a',
          }],
          qualifier: { comparisonPart: 'NUMERICS_ONLY' },
        },
      },
    ],
  });
  server.create('match-profile', {
    name: 'MARC Identifiers',
    description: 'EDIFACT POL',
    existingRecordType: 'ORDER',
    incomingRecordType: 'EDIFACT',
    parentProfiles: noAssociatedJobProfiles,
  });
  server.createList('match-profile', 5);

  server.get('/data-import-profiles/matchProfiles', (schema, request) => {
    const { query = '' } = request.queryParams;
    const matchProfiles = schema.matchProfiles.all();

    const searchPattern = /name="(\w+)/;

    return searchEntityByQuery({
      query,
      entity: matchProfiles,
      searchPattern,
      fieldsToMatch: [
        'name',
        'existingRecordType',
        'field',
        'fieldMarc',
        'fieldNonMarc',
        'existingStaticValueType',
        'tags.tagList',
      ],
    });
  });
  server.get('/data-import-profiles/matchProfiles/:id');
  server.delete('/data-import-profiles/matchProfiles/:id', {}, 409);
  server.post('/data-import-profiles/matchProfiles', (_, request) => {
    const params = JSON.parse(request.requestBody);
    const record = server.create('match-profile', params);

    return record.attrs;
  });
  server.put('/data-import-profiles/matchProfiles/:id', (schema, request) => {
    const {
      params: { id },
      requestBody,
    } = request;
    const matchProfileModel = schema.matchProfiles.find(id);
    const updatedMatchProfile = JSON.parse(requestBody);

    matchProfileModel.update({ ...updatedMatchProfile.profile });

    return matchProfileModel.attrs;
  });
};
