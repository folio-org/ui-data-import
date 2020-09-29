import { RestSerializer } from 'miragejs';

export default RestSerializer.extend({
  serialize(...args) {
    const { jobExecutions } = RestSerializer.prototype.serialize.apply(this, args);

    return {
      jobExecutions,
      totalRecords: jobExecutions.length,
    };
  },
});
