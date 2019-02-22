import { RestSerializer } from '@bigtest/mirage';

export default RestSerializer.extend({
  serialize(...args) {
    const json = RestSerializer.prototype.serialize.apply(this, args);
    const {
      fileExtension,
      fileExtensions,
    } = json;

    if (fileExtension) {
      return fileExtension;
    }

    return {
      fileExtensions,
      totalRecords: fileExtensions.length,
    };
  },
});
