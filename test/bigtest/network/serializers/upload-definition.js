import { RestSerializer } from '@bigtest/mirage';

export default RestSerializer.extend({
  serialize(...args) {
    const { uploadDefinitions } = RestSerializer.prototype.serialize.apply(this, args);

    return {
      uploadDefinitions,
      totalRecords: uploadDefinitions.length,
    };
  },
});
