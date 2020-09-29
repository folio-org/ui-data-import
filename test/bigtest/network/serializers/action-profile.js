import { RestSerializer } from 'miragejs';

export default RestSerializer.extend({
  serialize(...args) {
    const json = RestSerializer.prototype.serialize.apply(this, args);
    const {
      actionProfile,
      actionProfiles,
    } = json;

    if (actionProfile) {
      return actionProfile;
    }

    return {
      actionProfiles,
      totalRecords: actionProfiles.length,
    };
  },
});
