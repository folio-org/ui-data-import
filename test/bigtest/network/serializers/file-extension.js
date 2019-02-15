import { RestSerializer } from '@bigtest/mirage';

export default RestSerializer.extend({
  serialize(...args) {
    const { fileExtensions } = RestSerializer.prototype.serialize.apply(this, args);

    return {
      fileExtensions,
      totalRecords: fileExtensions.length,
    };
  },
});
