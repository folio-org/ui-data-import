export default server => {
  server.get('/users', {
    users: [{
      username: 'diku_admin',
      id: 'c4275ce3-0ec8-58d0-97a2-cc2259977c71',
      personal: {
        lastName: 'ADMINISTRATOR',
        firstName: 'DIKU',
        email: 'admin@diku.example.org',
        addresses: [],
      },
      createdDate: '2019-05-03T03:59:08.025+0000',
      updatedDate: '2019-05-03T03:59:08.025+0000',
    }],
    totalRecords: 1,
    resultInfo: { totalRecords: 1 },
  }, 200);
};
