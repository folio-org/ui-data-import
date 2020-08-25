export default server => {
  server.get('/field-protection-settings/marc', {
    marcFieldProtectionSettings: [{
      field: '001',
      id: '2d706874-8a10-4d3e-a190-33c301d157e3',
      indicator1: '',
      indicator2: '',
      subfield: '',
      data: '*',
      source: 'SYSTEM',
    }, {
      field: '999',
      id: '82d0b904-f8b0-4cc2-b238-7d8cddef7b7e',
      indicator1: 'f',
      indicator2: 'f',
      subfield: '*',
      data: '*',
      source: 'SYSTEM',
    }],
    totalRecords: 2,
  }, 200);
};
