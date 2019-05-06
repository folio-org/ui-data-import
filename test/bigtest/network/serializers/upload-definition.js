import { RestSerializer } from '@bigtest/mirage';

export default RestSerializer.extend({
  serialize(...args) {
    const response = RestSerializer.prototype.serialize.apply(this, args);

    const { uploadDefinitions } = response;

    if (!uploadDefinitions) {
      return response;
    }

    return {
      uploadDefinitions,
      totalRecords: uploadDefinitions.length,
    };
  },
});
