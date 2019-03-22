export default server => {
  server.get('/data-import/uploadDefinitions');
  server.post('/data-import/uploadDefinitions', (schema, request) => {
    const { fileDefinitions: files } = JSON.parse(request.requestBody);

    return {
      errors: files.map(file => ({
        message: 'validation.uploadDefinition.fileExtension.blocked',
        code: file.name,
        parameters: [],
      })),
      total_records: files.length,
    };
  });
};
