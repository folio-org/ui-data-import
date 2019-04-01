import { RestSerializer } from '@bigtest/mirage';

export default RestSerializer.extend({
  serialize(...args) {
    const json = RestSerializer.prototype.serialize.apply(this, args);
    const {
      jobProfile,
      jobProfiles,
    } = json;

    if (jobProfile) {
      return jobProfile;
    }

    return {
      jobProfiles,
      totalRecords: jobProfiles.length,
    };
  },
});
