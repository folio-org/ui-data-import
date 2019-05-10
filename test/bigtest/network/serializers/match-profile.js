import { RestSerializer } from '@bigtest/mirage';

export default RestSerializer.extend({
  serialize(...args) {
    const json = RestSerializer.prototype.serialize.apply(this, args);
    const {
      matchProfile,
      matchProfiles,
    } = json;

    if (matchProfile) {
      return matchProfile;
    }

    return {
      matchProfiles,
      totalRecords: matchProfiles.length,
    };
  },
});
