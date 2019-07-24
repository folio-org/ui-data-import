import { searchEntityByQuery } from '../../helpers/searchEntityByQuery';
import { associatedActionProfiles } from '../../mocks';

export default server => {
  server.createList('mapping-profile', 3);

  server.get('/data-import-profiles/mappingProfiles', (schema, request) => {
    const { query = '' } = request.queryParams;
    const mappingProfiles = schema.mappingProfiles.all();

    const searchPattern = /name="([\w\s]+)/;

    return searchEntityByQuery({
      query,
      entity: mappingProfiles,
      searchPattern,
      fieldsToMatch: [
        'name',
        'mapped',
        'tags.tagList',
      ],
    });
  });
  server.get('/data-import-profiles/mappingProfiles/:id');
  server.delete('/data-import-profiles/mappingProfiles/:id', {}, 409);
  server.get('/data-import-profiles/profileAssociations/:id/masters', associatedActionProfiles);
  server.post('/data-import-profiles/mappingProfiles', (_, request) => {
    const params = JSON.parse(request.requestBody);
    const record = server.create('mapping-profile', params);

    return record.attrs;
  });
  server.put('/data-import-profiles/mappingProfiles/:id', (schema, request) => {
    const {
      params: { id },
      requestBody,
    } = request;
    const mappingProfileModel = schema.mappingProfiles.find(id);
    const updatedMappingProfile = JSON.parse(requestBody);

    mappingProfileModel.update({ ...updatedMappingProfile });

    return mappingProfileModel.attrs;
  });
};
