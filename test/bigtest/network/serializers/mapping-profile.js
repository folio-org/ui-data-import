import { RestSerializer } from '@bigtest/mirage';

export default RestSerializer.extend({
  serialize(...args) {
    const json = RestSerializer.prototype.serialize.apply(this, args);
    const {
      mappingProfile,
      mappingProfiles,
    } = json;

    if (mappingProfile) {
      return mappingProfile;
    }

    return {
      mappingProfiles,
      totalRecords: mappingProfiles.length,
    };
  },
});
