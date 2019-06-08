export default server => server.get(
  '/configurations/entries',
  { configs: [{ value: 'true' }] },
);
