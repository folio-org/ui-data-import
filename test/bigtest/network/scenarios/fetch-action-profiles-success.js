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

  server.get('/data-import-profiles/actionProfiles');
};
