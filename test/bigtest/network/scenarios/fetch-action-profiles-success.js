import { associatedJobProfiles } from '../../mocks';
import { searchEntityByQuery } from '../../helpers/searchEntityByQuery';

export default server => {
  server.create('action-profile', {
    action: 'CREATE',
    folioRecord: 'ORDER',
  });
  server.create('action-profile', {
    action: 'CREATE',
    folioRecord: 'INVOICE',
  });
  server.create('action-profile', {
    action: 'COMBINE',
    folioRecord: 'ITEM',
  });
  server.create('action-profile', {
    action: 'COMBINE',
    folioRecord: 'INSTANCE',
  });
  server.create('action-profile', {
    action: 'MODIFY',
    folioRecord: 'HOLDINGS',
  });
  server.create('action-profile', {
    action: 'MODIFY',
    folioRecord: 'MARC_BIBLIOGRAPHIC',
  });
  server.create('action-profile', {
    action: 'REPLACE',
    folioRecord: 'MARC_AUTHORITY',
  });
  server.create('action-profile', {
    action: 'REPLACE',
    folioRecord: 'MARC_HOLDINGS',
  });

  server.get('/data-import-profiles/actionProfiles', (schema, request) => {
    const { query = '' } = request.queryParams;
    const actionProfiles = schema.actionProfiles.all();

    const searchPattern = /name="(\w+)/;

    return searchEntityByQuery({
      query,
      entity: actionProfiles,
      searchPattern,
      fieldsToMatch: [
        'name',
        'action',
        'folioRecord',
        'mapping',
        'tags.tagList',
      ],
    });
  });
  server.get('/data-import-profiles/actionProfiles/:id');
  server.delete('/data-import-profiles/actionProfiles/:id', {}, 409);
  server.get('/data-import-profiles/profileAssociations/:id/masters', associatedJobProfiles);
  server.post('/data-import-profiles/actionProfiles', (_, request) => {
    const params = JSON.parse(request.requestBody);
    const record = server.create('action-profile', params);

    return record.attrs;
  });
  server.put('/data-import-profiles/actionProfiles/:id', (schema, request) => {
    const {
      params: { id },
      requestBody,
    } = request;
    const actionProfileModel = schema.actionProfiles.find(id);
    const updatedActionProfile = JSON.parse(requestBody);

    actionProfileModel.update({ ...updatedActionProfile });

    return actionProfileModel.attrs;
  });
};
